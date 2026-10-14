const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const Passport = require("./models/Passport");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for passport image uploads
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024 // Maximum 5 MB
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("Please upload an image file."));
        }
    }
});

// Connect to MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/passport_verification")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Passport Verification Backend is Working!"
    });
});

// Passport verification route
app.post(
    "/verify",
    upload.single("passportImage"),
    async (req, res) => {
        try {
            // Read the submitted form fields
            const { passportNumber, name } = req.body || {};

            console.log("Received passport details:");
            console.log("Passport Number:", passportNumber);
            console.log("Name:", name);
            console.log(
                "Uploaded image:",
                req.file ? req.file.originalname : "No image"
            );

            // Validate the form fields
            if (!passportNumber || !name) {
                return res.status(400).json({
                    success: false,
                    message: "Passport number and name are required."
                });
            }

            // Validate the uploaded image
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload a passport image."
                });
            }

            // Save passport details in MongoDB
            const newPassport = new Passport({
                passportNumber: passportNumber,
                name: name,
                verificationStatus: "Pending"
            });

            await newPassport.save();

            return res.status(201).json({
                success: true,
                message: "Passport details saved successfully!",
                passport: newPassport
            });

        } catch (error) {
            console.error("Error saving passport:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to save passport details."
            });
        }
    }
);

// Handle upload errors
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Image size must be less than 5 MB."
            });
        }
    }

    if (error.message === "Please upload an image file.") {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    console.error("Server error:", error);

    return res.status(500).json({
        success: false,
        message: "Something went wrong on the server."
    });
});

// Search passport by passport number
app.get("/passport/:passportNumber", async (req, res) => {
    try {
        const passport = await Passport.findOne({
            passportNumber: req.params.passportNumber
        });

        if (!passport) {
            return res.status(404).json({
                success: false,
                message: "Passport not found."
            });
        }

        res.json({
            success: true,
            passport: passport
        });

    } catch (error) {
        console.error("Search error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search passport."
        });
    }
});

// Update passport verification status
app.patch("/passport/:passportNumber/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Verified", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Pending, Verified, or Rejected.",
      });
    }

    const passport = await Passport.findOneAndUpdate(
      { passportNumber: req.params.passportNumber },
      { verificationStatus: status },
      { new: true, runValidators: true }
    );

    if (!passport) {
      return res.status(404).json({
        success: false,
        message: "Passport record not found.",
      });
    }

    res.json({
      success: true,
      message: "Passport status updated successfully.",
      passport,
    });
  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update passport status.",
    });
  }
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
