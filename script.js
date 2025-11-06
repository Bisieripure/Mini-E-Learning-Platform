// ======== Course Data =========
const courses = [
  {
    id: 1,
    title: "HTML Basics",
    description: "Learn the fundamentals of HTML structure and tags.",
    lessons: ["Introduction", "Basic Tags", "Links & Images", "Lists & Tables"],
  },
  {
    id: 2,
    title: "CSS Styling",
    description: "Understand how to style web pages beautifully.",
    lessons: ["Selectors", "Box Model", "Flexbox", "Grid Layout"],
  },
  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Get started with interactivity using JavaScript.",
    lessons: ["Variables", "Functions", "DOM Manipulation", "Events"],
  },
];

const app = document.getElementById("app");

// ======== Local Storage Helpers ========
function getProgress(courseId) {
  return JSON.parse(localStorage.getItem("course_" + courseId)) || { completed: false };
}

function saveProgress(courseId, data) {
  localStorage.setItem("course_" + courseId, JSON.stringify(data));
}

// ======== Authentication ========
function isLoggedIn() {
  return !!localStorage.getItem("vibecoding_user");
}

function login() {
  const username = document.getElementById("username").value.trim();
  if (username) {
    localStorage.setItem("vibecoding_user", username);
    renderHome();
  } else {
    alert("Please enter your name to continue.");
  }
}

function logout() {
  localStorage.removeItem("vibecoding_user");
  renderLogin();
}

// ======== UI Rendering ========
function renderLogin() {
  document.querySelector(".logout").style.display = "none";
  app.innerHTML = `
    <div class="login-container">
      <h2>Welcome to VibeCoding Learning!</h2>
      <p>Please enter your name to begin:</p>
      <input type="text" id="username" placeholder="Your Name" />
      <button onclick="login()">Start Learning</button>
    </div>
  `;
}

function renderHome() {
  document.querySelector(".logout").style.display = "inline-block";
  const user = localStorage.getItem("vibecoding_user");
  app.innerHTML = `
    <h2>Welcome, ${user} 👋</h2>
    <p>Choose a course to start learning:</p>
    <div class="course-list">
      ${courses
        .map((c) => {
          const progress = getProgress(c.id);
          return `
          <div class="course-card" onclick="viewCourse(${c.id})">
            <h3>${c.title}</h3>
            <p>${c.description}</p>
            <p><strong>Status:</strong> ${
              progress.completed ? "<span style='color:green'>Completed</span>" : "In Progress"
            }</p>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

function viewCourse(id) {
  const course = courses.find((c) => c.id === id);
  const progress = getProgress(id);
  const completion = progress.completed ? 100 : 0;

  app.innerHTML = `
    <button class="back-btn" onclick="renderHome()">← Back</button>
    <h2>${course.title}</h2>
    <p>${course.description}</p>

    <div class="progress">
      <div class="progress-bar ${progress.completed ? "completed" : ""}" style="width: ${completion}%"></div>
    </div>

    <ul class="lessons">
      ${course.lessons.map((lesson) => `<li class="lesson">${lesson}</li>`).join("")}
    </ul>

    <button onclick="markCompleted(${id})" ${
    progress.completed ? "disabled" : ""
  }>${progress.completed ? "Completed ✓" : "Mark as Completed"}</button>
  `;
}

function markCompleted(id) {
  saveProgress(id, { completed: true });
  viewCourse(id);
}

// ======== Initialize App ========
if (isLoggedIn()) {
  renderHome();
} else {
  renderLogin();
}

