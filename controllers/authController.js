const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { Customer, CustomerAuth } = require("../models");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { fname, lname, address, username, password } = req.body;

    const existing = await CustomerAuth.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      customer_id: uuidv4(),
      fname,
      lname,
      address,
    });

    await CustomerAuth.create({
      id: uuidv4(),
      customer_uuid: customer.customer_id,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find auth record with customer info
    const authRecord = await CustomerAuth.findOne({
      where: { username },
      include: [{ model: Customer }],
    });

    if (!authRecord) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, authRecord.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        customer_id: authRecord.customer.customer_id,
        username: authRecord.username,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      customer: {
        customer_id: authRecord.customer.customer_id,
        fname: authRecord.customer.fname,
        lname: authRecord.customer.lname,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
