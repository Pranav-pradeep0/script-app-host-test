require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { createServer } = require("node:http");

const path = require("node:path");
const scriptRouter = require("./src/routes/scriptRouter");
const fontsRouter = require("./src/routes/fontsRouter");
const authRouter = require("./src/routes/authRouter");
const adminRoutes = require("./src/routes/adminRoutes");
const subscriptionRouter = require("./src/routes/subscriptionRouter");
const paymentRoutes = require("./src/routes/paymentRoutes");
const socket = require("./src/socket");
const establishDB = require("./src/configs/db");
const corsConfig = require("./src/configs/cors");
const checkSubscription = require("./src/middlewares/checkSubscription");

const { PORT, NODE_ENV } = process.env;

const isProduction = NODE_ENV === "production";

if (isProduction) console.log("server running on production");
// create app and http server
const app = express();
const server = createServer(app);

app.use(express.json());

if (!isProduction) app.use(morgan("combined"));

// set up cors
if (isProduction) app.use(cors(corsConfig));
else app.use(cors());


// establish db and socket
socket(server);
establishDB();

// routing
app.use("/api/scripts/", scriptRouter);
app.use("/fonts/", fontsRouter);
app.use("/auth/", authRouter);
app.use("/subscription/", subscriptionRouter);
app.use("/admin/", adminRoutes);
app.use("/scriptview/payment/gateway/", paymentRoutes)

// point the static files to production build of frontend
if (isProduction) {
  app.use(express.static(path.join(__dirname, "../frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const port = PORT || 8080;

server.listen(port, () => console.log(`server listening on port ${port} !`));
