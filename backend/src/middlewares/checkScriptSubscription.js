const userModel = require("../model/userModel");

async function checkScriptSubscription(req, res, next) {
    const scriptId = req.params.id;

    try {
        const script = await ScriptModel.findById(scriptId).populate("author");

        if (!script || !script.author || !script.author.subscription || !script.author.subscription.expirationDate) {
            return res.status(401).json({ error: "Invalid subscription information" });
        }

        const currentDate = new Date();
        const expirationDate = new Date(script.author.subscription.expirationDate);

        if (currentDate > expirationDate) {
            return res.status(401).json({ error: "Subscription expired. Please renew your subscription." });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = checkScriptSubscription;
