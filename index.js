require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const productRoutes = require("./routes/Products.js");
const authRoutes = require("./routes/authRoutes.js");
const aiAssistantRoutes = require("./routes/aiAssistantRoutes.js");

const db = require("./database.js");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/assistant", aiAssistantRoutes);

const initApp = async () => {
  console.log("Testing the database connection..");

  // Test the connection.
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};
initApp();
