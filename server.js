const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { fallbackProjects, fallbackActivity, skillGroups } = require("./data/portfolioContent");

const app = express();
const inMemoryContacts = [];
const activityFeed = [...fallbackActivity];

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Model
const Project = require("./models/Project");
const Contact = require("./models/Contact");

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

async function getProjects() {
  if (!isDatabaseReady()) {
    return fallbackProjects;
  }

  const projects = await Project.find().lean();
  return projects.length ? projects : fallbackProjects;
}

async function getContactCount() {
  if (!isDatabaseReady()) {
    return inMemoryContacts.length;
  }

  return Contact.countDocuments();
}

function makeReferenceId() {
  return `KY-${Date.now().toString(36).toUpperCase()}`;
}

function pushActivity(title, detail, type = "update") {
  activityFeed.unshift({ title, detail, type });

  if (activityFeed.length > 6) {
    activityFeed.length = 6;
  }
}

// Routes
app.get("/projects", async (req, res) => {
  try {
    const projects = await getProjects();
    return res.json(projects);
  } catch (error) {
    console.error("Projects fetch failed:", error.message);
    return res.json(fallbackProjects);
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    const projects = await getProjects();
    const messagesReceived = await getContactCount();
    const uniqueStacks = new Set(projects.flatMap((project) => project.stack || []));
    const categories = [...new Set(projects.map((project) => project.category).filter(Boolean))];

    return res.json({
      stats: [
        { label: "Projects in API", value: String(projects.length), tone: "accent" },
        { label: "Tech Stack Coverage", value: String(uniqueStacks.size), tone: "neutral" },
        { label: "Messages Received", value: String(messagesReceived), tone: "success" },
        { label: "Database Status", value: isDatabaseReady() ? "Connected" : "Fallback Mode", tone: isDatabaseReady() ? "success" : "warning" }
      ],
      activity: activityFeed,
      filters: ["All", ...categories],
      stackGroups: skillGroups,
      system: {
        backend: "Express API",
        database: isDatabaseReady() ? "MongoDB live" : "MongoDB unavailable",
        contactMode: isDatabaseReady() ? "Persisted to database" : "Stored in memory for this session",
      }
    });
  } catch (error) {
    console.error("Dashboard fetch failed:", error.message);
    return res.status(500).json({ message: "Dashboard data unavailable." });
  }
});

app.post("/contact", async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const message = req.body.message?.trim();

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in your name, email, and message."
    });
  }

  const referenceId = makeReferenceId();
  const payload = {
    referenceId,
    name,
    email,
    message,
    source: "portfolio-site",
  };

  try {
    if (isDatabaseReady()) {
      await Contact.create(payload);
    } else {
      inMemoryContacts.unshift({
        ...payload,
        createdAt: new Date().toISOString(),
      });
    }

    pushActivity(
      "New portfolio inquiry",
      `Message received from ${name} with reference ${referenceId}.`,
      "contact"
    );

    console.log("Contact Form:", name, email, message);
    return res.json({
      success: true,
      referenceId,
      message: `Thanks for reaching out. Your message has been received with reference ${referenceId}.`
    });
  } catch (error) {
    console.error("Contact save failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not save your message right now. Please try again."
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
