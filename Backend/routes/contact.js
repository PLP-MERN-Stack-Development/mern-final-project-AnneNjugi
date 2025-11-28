import express from "express";
import Contact from "../models/Contact.js";
import { authenticateAdmin } from "../utils/auth.js";

const router = express.Router();

// Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: "All fields are required",
        details: "Please provide name, email, and message"
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Invalid email",
        details: "Please provide a valid email address"
      });
    }

    // Check message length
    if (message.length < 10) {
      return res.status(400).json({ 
        error: "Message too short",
        details: "Please provide a message with at least 10 characters"
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        error: "Message too long",
        details: "Please keep your message under 1000 characters"
      });
    }

    // Create contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    await contact.save();

    res.status(201).json({ 
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      contactId: contact._id
    });

  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ 
      error: "Server error",
      details: "Failed to save your message. Please try again later."
    });
  }
});

// Get all contact messages (admin only)
router.get("/messages", authenticateAdmin, async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ 
      error: "Server error",
      details: "Failed to fetch messages"
    });
  }
});

// Get message count
router.get("/count", authenticateAdmin, async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });

    res.json({
      success: true,
      total,
      new: newMessages
    });
  } catch (error) {
    console.error("Error counting messages:", error);
    res.status(500).json({ 
      error: "Server error",
      details: "Failed to count messages"
    });
  }
});

export default router;
