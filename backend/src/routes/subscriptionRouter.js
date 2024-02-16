const router = require("express").Router();
const SubscriptionModel = require("../model/subscriptionModel");

router.post("/addSubscription", async (req, res) => {
    try {
        const { planTitle, type, periodinHoursOrMonths, price, description, subscribeButtonText, isRecomended } = req.body;

        const plan = await SubscriptionModel.findOne({ planTitle });

        if (plan) {
            res.status(409).json({ message: 'Plan Already Exists' });
        }

        const newPlan = new SubscriptionModel({
            planTitle,
            type,
            periodinHoursOrMonths,
            price,
            description,
            subscribeButtonText,
            isRecomended
        });

        await newPlan.save();

        res.status(201).json({ message: 'Plan added Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/getSubscriptions", async (req, res) => {
    try {
        const plans = await SubscriptionModel.find()

        if (plans.length > 0) {
            return res.status(200).json({ plans })
        }

        else {
            return res.status(404).json({ message: "No plans found" })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
});

router.put("/updateSubscription/:planTitle", async (req, res) => {
    try {
        const { type, periodinHoursOrMonths, price, description, subscribeButtonText, isRecomended } = req.body;
        const planTitle = req.params.planTitle;

        const plan = await SubscriptionModel.findOne({ planTitle });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        plan.type = type;
        plan.periodinHoursOrMonths = periodinHoursOrMonths;
        plan.price = price;
        plan.description = description;
        plan.subscribeButtonText = subscribeButtonText;
        plan.isRecomended = isRecomended;

        await plan.save();

        return res.status(200).json({ message: 'Plan updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete("/deleteSubscription/:planId", async (req, res) => {
    try {
        const { planId } = req.params;

        const plan = await SubscriptionModel.findByIdAndDelete(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        return res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



module.exports = router;