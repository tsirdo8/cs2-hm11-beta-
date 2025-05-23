const authRouter = require("express").Router();
const isAuth = require("../middleware/isAuth.middleware");
const User = require("../models/users.model");
const userSchema = require("../validations/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()


 authRouter.post("/sign-up", async (req, res) => {
    const error = userSchema.validate(req.body || {})
    if (error.error) {
        return res.status(400).json({ message: error.error.message });
    }

    const { name, email, password, phoneNumber, address, adminStatus } = req.body;
    console.log(req.body)
    const existUser = await User.findOne({ email });
    if (existUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,password: hashedPassword,
        phoneNumber,
        address,
        adminStatus: adminStatus || false,

    })

    console.log(hashedPassword, password)
    res.status(201).json({ message: "User created successfully" });   
})


authRouter.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existUser = await User.findOne({ email }).select("password");
    if (!existUser) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const payLoad = {
        userId: existUser._id,
        adminStatus: existUser.adminStatus
    }

    const token = await  jwt.sign(payLoad, process.env.JWT_SECRET, {expiresIn: '1h'})

    
    res.status(200).json({ message: "Login successful" , token});
});


authRouter.get("/current-user", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("email adminStatus");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ email: user.email, adminStatus: user.adminStatus });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});




module.exports = authRouter;