const router = require("express").Router();
const ScriptModel = require("../model/scriptModel");
const userModel = require("../model/userModel");

router.get("/list-users", async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete-user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        await ScriptModel.deleteMany({ author: userId });

        res.status(200).json({ message: "User and associated scripts deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/update-user-status', async (req, res) => {
    try {
        const { userId, newStatus } = req.body;

        const user = await userModel.findByIdAndUpdate(userId, { $set: { status: newStatus } }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
