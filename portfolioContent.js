const fallbackProjects = [
  {
    title: "AI Cyber Threat Detection System",
    description: "An AI-driven security platform for monitoring suspicious network and system activity in real time.",
    year: "2026",
    category: "AI Security",
    status: "Prototype",
    stack: ["Python", "FastAPI", "Machine Learning", "React.js", "SQL"],
    highlights: [
      "Built a backend API to analyze network and system data for suspicious patterns.",
      "Implemented machine learning models for anomaly and threat detection.",
      "Created a dashboard to surface alerts, threat summaries, and security activity."
    ],
    link: ""
  },
  {
    title: "RecogX Attendance Management System",
    description: "A face-recognition attendance platform designed to verify identity and reduce spoofing in real-world usage.",
    year: "2024",
    category: "Computer Vision",
    status: "Completed",
    stack: ["Python", "OpenCV", "dlib", "YOLOv8", "Pandas", "NumPy"],
    highlights: [
      "Recorded attendance with real-time face recognition.",
      "Added blink-based liveness detection to prevent photo and screen spoofing.",
      "Used YOLOv8 to detect phone usage and block unauthorized attendance marking."
    ],
    link: ""
  },
  {
    title: "Smart Task Manager Web Application",
    description: "A responsive task management app built to organize daily work with clean client-side interaction.",
    year: "2026",
    category: "Web App",
    status: "In Progress",
    stack: ["HTML", "CSS", "JavaScript", "React.js"],
    highlights: [
      "Implemented create, read, update, and delete flows for task management.",
      "Updated task lists in real time using React state and event handling.",
      "Stored tasks with LocalStorage to preserve data across reloads."
    ],
    link: ""
  }
];

const fallbackActivity = [
  {
    title: "Portfolio API online",
    detail: "Frontend sections are served by Express and hydrated with backend data.",
    type: "system"
  },
  {
    title: "National Science Day 2026",
    detail: "Presented the AI-based Cyber Threat Detection project.",
    type: "milestone"
  },
  {
    title: "Certification track expanded",
    detail: "Added AI Literacy, MongoDB Basics, and Enterprise Design Thinking.",
    type: "learning"
  }
];

const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "SQL"]
  },
  {
    label: "Frontend",
    items: ["HTML", "CSS", "React.js", "Next.js", "Tailwind CSS"]
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "FastAPI", "MongoDB", "MySQL"]
  },
  {
    label: "AI and Data",
    items: ["OpenCV", "YOLOv8", "dlib", "Pandas", "NumPy", "Machine Learning"]
  }
];

module.exports = {
  fallbackProjects,
  fallbackActivity,
  skillGroups,
};
