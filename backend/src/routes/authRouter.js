const router = require("express").Router();
const checkSubscription = require("../middlewares/checkSubscription");
const userModel = require("../model/userModel");

function calculateExpirationDate(subscriptionType, periodInYearsOrMonths = 0) {
  const currentDate = new Date();
  let expirationDate;

  if (subscriptionType === "Yearly") {
    expirationDate = new Date(currentDate);
    expirationDate.setFullYear(currentDate.getFullYear() + Math.floor(periodInYearsOrMonths));
  } else if (subscriptionType === "Monthly") {
    expirationDate = new Date(currentDate);
    expirationDate.setMonth(currentDate.getMonth() + Math.floor(periodInYearsOrMonths));
  } else if (subscriptionType === "Hourly") {
    expirationDate = new Date(currentDate);
    expirationDate.setHours(currentDate.getHours() + Math.floor(periodInYearsOrMonths));
  } else if (subscriptionType === "Days") {
    expirationDate = new Date(currentDate);
    expirationDate.setDate(currentDate.getDate() + Math.floor(periodInYearsOrMonths));
  }
  // else {
  //   expirationDate = new Date(currentDate);
  //   expirationDate.setDate(currentDate.getHours() + 8);
  // }

  return expirationDate;
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email }).populate("scripts");

    if (user && password == user.password) {

      if (!user || !user.subscription || !user.subscription.expirationDate) {
        return res.status(401).json({ error: "Invalid subscription information" });
      }

      const currentDate = new Date();
      const expirationDate = new Date(user.subscription.expirationDate);

      if (currentDate > expirationDate) {
        await userModel.findByIdAndUpdate(user._id, { $set: { status: "Suspended" } });
        return res.status(401).json({ error: "Subscription expired. Please renew your subscription.", user });
      }

      res.status(200).json({ message: "Login successful!", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, subscriptionType, periodInYearsOrMonths } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = new userModel({
      firstname,
      lastname,
      email,
      password,
      isadmin: false,
      subscription: {
        type: subscriptionType || "Days",
        startDate: new Date(),
        expirationDate: calculateExpirationDate(subscriptionType || "Free Demo", periodInYearsOrMonths),
      },
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/userinfo/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentDate = new Date();
    const expirationDate = new Date(user.subscription.expirationDate);

    if (user.subscription.type === "Hourly") {
      remainingDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60)) + " Hours";
      subscriptionStatus = remainingDays > 0 ? "Active" : "inactive";
    }
    else {
      remainingDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24)) + " Days";
      subscriptionStatus = currentDate <= expirationDate ? "Active" : "inactive";
    }

    res.status(200).json({
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isadmin: user.isadmin,
      scripts: user.scripts,
      subscription: {
        type: user.subscription.type,
        startDate: user.subscription.startDate,
        expirationDate: user.subscription.expirationDate,
        remainingDays: remainingDays,
        status: subscriptionStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/set-subscription", async (req, res) => {
  try {
    const { userId, subscriptionType, periodInYearsOrMonths } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expirationDate = calculateExpirationDate(subscriptionType, periodInYearsOrMonths);
    await userModel.findByIdAndUpdate(userId, {
      $set: {
        "subscription.type": subscriptionType,
        "subscription.expirationDate": expirationDate,
      },
    });

    res.status(200).json({ message: "Subscription updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
