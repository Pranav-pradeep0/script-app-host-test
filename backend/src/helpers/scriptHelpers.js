const ScriptModel = require("../model/scriptModel");

module.exports = {
  /** @param {string} id @returns {Promise<Object|null} */
  findScriptById: async (id) => {
    const data = await ScriptModel.findOne({ _id: id });
    return data;
  },

  /** @returns {Promise<Object>|null} */
  // createNewScript: async () => {
  //   const data = await ScriptModel.create({ author: "user" });
  //   return data;
  // },
  createNewScript: async (userId) => {
    try {
      const data = await ScriptModel.create({ author: userId });
      return data;
    } catch (err) {
      console.error("Error creating new script:", err);
      throw err; // Ensure the error is propagated
    }
  },

  /** @param {void} @returns {Promise<Array>|null} */

  // getRecentDocList: async () => {
  //   const list = await ScriptModel.find()
  //     .sort({ updatedAt: -1 })
  //     .limit(10)
  //     .select("_id title updatedAt");
  //   return list;
  // },

  getRecentDocList: async (userId) => {
    try {
      const list = await ScriptModel.find({ author: userId })
        .sort({ updatedAt: -1 })
        .limit(10)
        .select("_id title updatedAt");
      return list;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
