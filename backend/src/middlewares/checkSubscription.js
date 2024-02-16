const userModel = require("../model/userModel");

async function checkSubscription(req, res, next) {

    const userId = req.body.userId;

    if (userId) {
        try {
            const user = await userModel.findById(userId);

            if (!user || !user.subscription || !user.subscription.expirationDate) {
                return res.status(401).json({ error: "Invalid subscription information" });
            }

            const currentDate = new Date();
            const expirationDate = new Date(user.subscription.expirationDate);

            if (currentDate > expirationDate) {
                return res.status(401).json({ error: "Subscription expired. Please renew your subscription." });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = checkSubscription;
