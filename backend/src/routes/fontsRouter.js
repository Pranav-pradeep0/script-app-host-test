const router = require("express").Router();
const path = require("path");

router.get("/indulekha_heavy", (req, res) => {
  const fontPath = path.join(__dirname, "..", "fonts", "FML-Indulekha.woff2");
  res.sendFile(fontPath);
});

module.exports = router;
