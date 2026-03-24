import { techStack } from "../data/techStack.js";
import { courses } from "../data/courses.js";
import { projects } from "../data/projects.js";


// DETAILS RENDER HELPER
const renderDetails = (items) => `
<details>
  <summary><b>Course topics</b></summary>
  <ul>
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>
</details>
`;

// TECH STACK SECTION RENDER
function renderTechStack(stack) {
  const container = document.getElementById("tech-stack-content");
  if (!container) return;

  container.innerHTML = stack
    .map(
      (category) => `
        <h3>${category.title}</h3>
        <p class="tech-icons">
          ${category.items
            .map(
              (item) => `
              <a href="#projects" class="tech-link" title="${item.name}">
              <img class="tech-badge" src="${item.badge}" alt="${item.name}" /></a>`
            )
            .join("")}
        </p>
      `
    )
    .join("");
}

renderTechStack(techStack);

// COURCES SECTION RENDER
function renderCourses(courses) {
  const table = document.getElementById("courses-content");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Course</th>
      <th>About</th>
      <th>Links</th>
    </tr>
  `;

  courses.forEach((course) => {
    const row = document.createElement("tr");

    // Links
    const mainLink = course.links?.find(l => l.tag === "repo")?.url || course.repo || "#";
    const websiteLink = course.links?.find(l => l.tag === "website")?.url || course.website || "";

    // Rows
    row.innerHTML = `
      <td>
        <a href="${mainLink}" target="_blank">${course.title}</a>
      </td>
      <td>
        ${course.description}
        ${course.details ? renderDetails(course.details) : ""}
      </td>
      <td>
        ${websiteLink ? `<a href="${websiteLink}" target="_blank">🌍 Course Website</a>` : ""}
      </td>
    `;

    table.appendChild(row);
  });
}

renderCourses(courses);

// PROJECTS SECTION RENDER
function renderProjects(projects, filter = "all") {
  const table = document.getElementById("projects-content");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Project</th>
      <th>Stack</th>
      <th>Links</th>
    </tr>
  `;

  projects
    .filter((project) => filter === "all" || project.category.includes(filter))
    .forEach((project) => {
      const row = document.createElement("tr");

      const links = project.links || [];
      const mainLink = links.find(l => l.tag === "repo")?.url || "#";
      const secondaryLink =
        links.find(l => l.tag === "demo" || l.tag === "pr")
          ? `<a href="${links.find(l => l.tag === "demo" || l.tag === "pr").url}" target="_blank">${
              links.find(l => l.tag === "demo") ? "🌍 Live Demo" : "🔄 Pull Requests"
            }</a>`
          : "";

      row.innerHTML = `
        <td><a href="${mainLink}" target="_blank">${project.title}</a></td>
        <td>${project.stack.join(", ")}</td>
        <td>${secondaryLink}</td>
      `;

      table.appendChild(row);
    });
}

renderProjects(projects);


// TABLE FILTERING

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
    renderProjects(projects, btn.dataset.filter);
  });
});


