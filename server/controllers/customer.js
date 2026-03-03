const bcrypt = require("bcrypt");
const { Customer, CustomerAuth } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.user.customer_id, {
      include: [
        {
          model: CustomerAuth,
          attributes: ["username", "role"],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fname, lname, address } = req.body;

    await Customer.update(
      { fname, lname, address },
      { where: { customer_id: req.user.customer_id } }
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const authRecord = await CustomerAuth.findOne({
      where: { customer_uuid: req.user.customer_id },
    });

    if (!authRecord) {
      return res.status(404).json({ message: "Auth record not found" });
    }

    const isMatch = await bcrypt.compare(current_password, authRecord.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await CustomerAuth.update(
      { password: hashedPassword },
      { where: { customer_uuid: req.user.customer_id } }
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
