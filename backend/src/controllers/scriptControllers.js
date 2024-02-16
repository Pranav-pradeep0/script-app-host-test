const { default: puppeteer } = require("puppeteer");
const {
  findScriptById,
  createNewScript,
  getRecentDocList,
} = require("../helpers/scriptHelpers");
const { validateHTML } = require("../utils/validationUtils");
const OneLineSchema = require("../model/oneLineModel");
const ScriptModel = require("../model/scriptModel");
const checkSubscription = require("../middlewares/checkSubscription");

/**
 * Controller functions for script router
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {import("express").Response}
 */

module.exports = {
  getInitial: async (req, res) => {
    try {
      const data = await findScriptById(req.params.id);
      if (data) {
        return res.json({
          author: data.author,
          state: data.editorState,
          title: data.title,
          characters: data.characters || [],
        });
      }
      return res.status(404).json({ message: "Data not found" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // createScript: async (req, res) => {
  //   try {
  //     const docData = await createNewScript();
  //     res.json({
  //       author: docData.author,
  //       id: docData._id,
  //       title: docData.title,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ message: err.message });
  //   }
  // },

  createScript: async (req, res) => {
    const { userId } = req.body;
    try {
      console.log("Creating script for userId:", userId);
      const docData = await createNewScript(userId);
      console.log("Script created successfully:", docData);
      res.json({
        author: docData.author,
        id: docData._id,
        title: docData.title,
      });
    } catch (err) {
      console.error("Error creating script:", err);
      return res.status(500).json({ message: err.message, userId });
    }
  },

  // listRecent: async (req, res) => {
  //   try {
  //     const list = await getRecentDocList();
  //     res.json({ data: list });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ message: err.message });
  //   }
  // },

  listRecent: async (req, res) => {
    try {
      const { userId } = req.body;
      const list = await getRecentDocList(userId);
      res.json({ data: list });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  },

  exportFile: async (req, res) => {
    const { docFormat, css, html, margin, format, width, height } = req.body;
    const docFormatValidator = {
      pdf: docFormat === "pdf",
      docx: docFormat === "docx",
    };
    if (!docFormat || !docFormatValidator[docFormat]) {
      return res.status(400).json({ message: "invalid docFormat type" });
    }

    if (!validateHTML(html)) {
      return res.status(400).json({ message: "invalid html content" });
    }

    if (!css) {
      return res.status(400).json({ message: "invalid css content" });
    }

    if (docFormatValidator.pdf) {
      try {
        const browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(
          `<div style="word-wrap:break-word;">${html}</div>`,
        );
        await page.addStyleTag({
          content: `body{display:flex;justify-content:center;}${css}`,
        });
        await page.setViewport({
          height: 1080,
          width: 1920,
        });

        const pdfBuffer = await page.pdf({
          format: format || "A4",
          printBackground: true,
          margin: {
            top: margin?.top || `${3 * 16}px`,
            bottom: margin?.bottom || `${3 * 16}px`,
            left: margin?.left || `${3 * 16}px`,
            right: margin?.right || `${3 * 16}px`,
          },
          scale: 1,
          height: height || undefined,
          width: width || undefined,
          preferCSSPageSize: true,
          displayHeaderFooter: true,
          headerTemplate: `<div style="display:none;"></div>`,
          footerTemplate: `<div style="font-size:10px; text-align:center; width:100%;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
        });
        await browser.close();
        res.setHeader("Content-type", "application/pdf");
        res.send(pdfBuffer);
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Internal server error", message: err.message });
      }
    }
  },

  deleteDoc: async (req, res) => {
    const docId = req.params.id;
    try {
      const data = await findScriptById(docId);
      if (data) {
        await data.deleteOne();
        const list = await getRecentDocList();
        return res.json({ data: list });
      }
      return res.status(404);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  },

  addOneLine: async (req, res) => {
    try {
      const { title, scriptId, oneLiners } = req.body;

      if (title === undefined || !oneLiners || !scriptId) {
        return res.status(400).json({ message: "Invalid add request" });
      }

      let oneLineData = await OneLineSchema.findOne({ scriptId: scriptId });

      if (!oneLineData) {
        oneLineData = new OneLineSchema({
          title,
          scriptId,
          oneLiners,
        });
      } else {
        oneLineData.title = title
        oneLineData.oneLiners = oneLiners;
      }

      await oneLineData.save();

      return res.json({
        message: "One-line data added successfully",
        oneLiners: oneLineData,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Runtime error", message: err.message });
    }
  },

  getOneLinesByScriptId: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "Invalid scriptId in the request" });
      }

      const oneLineData = await OneLineSchema.find({ scriptId: id });

      if (!oneLineData) {
        return res.json({
          message: "No one-liners found for the specified scriptId",
        });
      }

      return res.json({
        message: "One-liners fetched successfully",
        oneLiners: oneLineData,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Runtime error", message: err.message });
    }
  },

  getCharacters: async (req, res) => {
    try {
      const { scriptId } = req.params;

      const script = await ScriptModel.findById(scriptId);

      if (!script) {
        return res.status(404).json({ error: "script not found" });
      } else {
        const { characters } = script;
        if (characters.length < 1) {
          res.json('No characters found, add from Script page')
        }
        else {
          res.json({ characters });
        }
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
