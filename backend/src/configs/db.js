const { default: mongoose } = require("mongoose");

/**
 * Establish DB.
 * @returns {void}
 */

module.exports = function () {
  const db = mongoose.connection;

  const { DB_URI } = process.env;

  mongoose.connect(DB_URI);

  db.once("open", () => {
    console.log("mongodb connected");
  });

  db.on("error", console.error.bind(console, "Connection ERROR: "));
};
