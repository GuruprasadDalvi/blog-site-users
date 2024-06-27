const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const zod = require("zod");
const mongoose = require("mongoose"); // Import Mongoose
const UserRoutes = require("./routes/UserRoutes");
const logger = require("./utils/logger");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3030;

// MongoDB URI - replace 'your_mongodb_uri' with your actual MongoDB URI
const mongoURI =
  "mongodb+srv://prasad_dalvi:dbpassword@cluster0.rlbdh.mongodb.net/blogAC2";

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error(err));

// Apply middleware
app.use(helmet()); // Security headers
app.use(morgan("tiny")); // Logging
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Routes
app.use("/api/users", UserRoutes);

// Error common handling
app.use((err, req, res, next) => {
    console.log(err);
  logger.error(err);
  res.send
    .status(500)
    .json({ message: "Something went wrong. Please try again later." });
});
