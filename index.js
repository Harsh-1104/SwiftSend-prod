const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const sampleRoutes = require("./routes/sendMessage");
const templateRoutes = require("./routes/templateRoute");

// Use routes
app.use("/api", sampleRoutes);
app.use("/api", templateRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on  port ${PORT}`);
});
