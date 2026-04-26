const projectsGrid = document.getElementById("projectsGrid");
const projectsState = document.getElementById("projectsState");
const projectFilters = document.getElementById("projectFilters");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const statsGrid = document.getElementById("statsGrid");
const activityFeed = document.getElementById("activityFeed");
const skillsGrid = document.getElementById("skillsGrid");

const systemBackend = document.getElementById("systemBackend");
const systemDatabase = document.getElementById("systemDatabase");
const systemContact = document.getElementById("systemContact");

let allProjects = [];
let activeFilter = "All";

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const stack = Array.isArray(project.stack)
    ? project.stack.map((item) => `<span>${item}</span>`).join("")
    : "";

  const highlights = Array.isArray(project.highlights)
    ? project.highlights.map((item) => `<li>${item}</li>`).join("")
    : "";

  card.innerHTML = `
    <div class="project-top">
      <div>
        <p class="card-kicker">${project.category || "Project"}</p>
        <h3>${project.title}</h3>
      </div>
      <div class="project-badges">
        <span class="project-year">${project.year || "Recent"}</span>
        ${project.status ? `<span class="status-pill">${project.status}</span>` : ""}
      </div>
    </div>
    <p>${project.description || ""}</p>
    <div class="project-stack">${stack}</div>
    <ul class="project-points">${highlights}</ul>
    ${project.link ? `<a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">Open Project</a>` : ""}
  `;

  return card;
}

function renderProjects() {
  projectsGrid.innerHTML = "";

  const visibleProjects = activeFilter === "All"
    ? allProjects
    : allProjects.filter((project) => project.category === activeFilter);

  if (!visibleProjects.length) {
    projectsState.textContent = "No projects match this filter yet.";
    return;
  }

  projectsState.textContent = "";
  visibleProjects.forEach((project) => {
    projectsGrid.appendChild(createProjectCard(project));
  });
}

function renderFilters(filters) {
  projectFilters.innerHTML = "";

  filters.forEach((filterName) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = filterName === activeFilter ? "filter-chip active" : "filter-chip";
    button.textContent = filterName;
    button.addEventListener("click", () => {
      activeFilter = filterName;
      renderFilters(filters);
      renderProjects();
    });
    projectFilters.appendChild(button);
  });
}

function renderStats(stats) {
  statsGrid.innerHTML = "";

  stats.forEach((stat) => {
    const card = document.createElement("div");
    card.className = `metric tone-${stat.tone || "neutral"}`;
    card.innerHTML = `
      <strong>${stat.value}</strong>
      <span>${stat.label}</span>
    `;
    statsGrid.appendChild(card);
  });
}

function renderActivity(items) {
  activityFeed.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "activity-item";
    card.innerHTML = `
      <div class="activity-top">
        <span class="activity-type">${item.type || "update"}</span>
      </div>
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    `;
    activityFeed.appendChild(card);
  });
}

function renderSkills(groups) {
  skillsGrid.innerHTML = "";

  groups.forEach((group) => {
    const article = document.createElement("article");
    article.className = "skill-block";
    article.innerHTML = `
      <h3>${group.label}</h3>
      <div class="chip-row">
        ${group.items.map((item) => `<span class="chip">${item}</span>`).join("")}
      </div>
    `;
    skillsGrid.appendChild(article);
  });
}

async function loadProjects() {
  try {
    const response = await fetch("/projects");
    if (!response.ok) {
      throw new Error("Unable to load projects.");
    }

    allProjects = await response.json();
    renderProjects();
  } catch (error) {
    projectsState.textContent = "Could not load project data right now.";
  }
}

async function loadDashboard() {
  try {
    const response = await fetch("/dashboard");
    if (!response.ok) {
      throw new Error("Unable to load dashboard.");
    }

    const data = await response.json();
    renderStats(data.stats || []);
    renderActivity(data.activity || []);
    renderSkills(data.stackGroups || []);
    renderFilters(data.filters || ["All"]);

    systemBackend.textContent = data.system?.backend || "Express API";
    systemDatabase.textContent = data.system?.database || "Database status unavailable.";
    systemContact.textContent = data.system?.contactMode || "Contact flow unavailable.";
  } catch (error) {
    systemBackend.textContent = "Could not load backend summary.";
    systemDatabase.textContent = "Could not load database summary.";
    systemContact.textContent = "Could not load contact summary.";
  }
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  formStatus.textContent = "Sending message...";

  try {
    const response = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Message failed");
    }

    formStatus.textContent = result.message || "Message sent successfully.";
    contactForm.reset();
    await loadDashboard();
  } catch (error) {
    formStatus.textContent = error.message || "Could not send your message. Please try again.";
  }
});

Promise.all([loadProjects(), loadDashboard()]);
