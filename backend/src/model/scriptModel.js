const { Schema, model } = require("mongoose");

const scriptSchema = new Schema(
  {
    title: {
      type: String,
      requried: "Requires Title",
      default: "Untitled Document",
    },
    characters: { type: Array, default: [] },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: "Requires Author",
    },
    editorState: { type: String, default: null },
  },
  { timestamps: true },
);

const ScriptModel = model("script", scriptSchema);
module.exports = ScriptModel;
