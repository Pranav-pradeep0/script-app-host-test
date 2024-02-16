const ScriptModel = require("../model/scriptModel");

module.exports = {
  /** @param {string} state @param {string} authorId */
  saveScript: async ({ state, id }) => {
    const doc = await ScriptModel.findOne({ _id: id });
    if (doc) {
      await doc.updateOne({ editorState: state });
    }
  },
  editScriptTitle: async ({ title, id }) => {
    if (!title) throw Error("Title cannot be empty");
    const doc = await ScriptModel.findOne({ _id: id });
    if (doc) {
      await doc.updateOne({ title });
    }
  },
  updateCharacterList: async ({ characters, id }) => {
    if (!Array.isArray(characters)) throw Error("Invalid payload");
    const doc = await ScriptModel.findOne({ _id: id });
    if (doc) {
      await doc.updateOne({ characters });
    }
  },
};
