const { mongoose, Schema } = require("mongoose");

const OneLineSchema = mongoose.model("oneline", {
  title: {
    type: String,
  },
  scriptId: {
    type: Schema.Types.ObjectId,
    ref: "script",
    required: "Requires a parent script",
  },
  oneLiners: [
    {
      location: {
        type: String,
      },
      scene: {
        type: String,
      },
      time: {
        type: String,
      },
      IntOrExt: {
        type: String,
      },
      Action: {
        type: String,
      },
      Character: {
        type: String,
      },
    },
  ],
});

module.exports = OneLineSchema;
