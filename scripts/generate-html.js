import fs from "fs";
import { techStack } from "../data/techStack.js";
import { projects } from "../data/projects.js";
import { courses } from "../data/courses.js";

const template = fs.readFileSync("templates/index.template.html", "utf8");

/* ---------- Tech Stack ---------- */

function renderTechStack() {
  return techStack
    .map(
      (section) => `
      <h3>${section.title}</h3>
      <p>
        ${section.items
          .map((i) => `<img src="${i.badge}" alt="${i.name}"/>`)
          .join(" ")}
      </p>
    `,
    )
    .join("");
}

/* ---------- Courses ---------- */

function renderCourses() {
  return courses
    .map((course) => {
      const repo = course.links.find((l) => l.tag === "repo")?.url || "#";
      const website = course.links.find((l) => l.tag === "website")?.url || "#";

      return `
<tr>
<td><a href="${repo}"><b>${course.title}</b></a></td>
<td>${course.description}</td>
<td><a href="${website}">Course website</a></td>
</tr>
`;
    })
    .join("");
}

/* ---------- Projects ---------- */

function renderProjects() {
  return projects
    .map((project) => {
      const repo = project.links.find((l) => l.tag === "repo")?.url || "#";
      const demo =
        project.links.find((l) => l.tag === "demo")?.url ||
        project.links.find((l) => l.tag === "pr")?.url ||
        "#";

      const categoryAttribute = project.category
        ? project.category.join(" ").toLowerCase()
        : "";
      return `
<tr data-category="${categoryAttribute}">
<td><a href="${repo}"><b>${project.title}</b></a></td>
<td>${project.stack.join(", ")}</td>
<td><a href="${demo}">View</a></td>
</tr>
`;
    })
    .join("");
}

/* ---------- Generate page ---------- */

let html = template
  .replace("{{TECH_STACK}}", renderTechStack())
  .replace("{{COURSES}}", renderCourses())
  .replace("{{PROJECTS}}", renderProjects());

fs.writeFileSync("index.html", html);

console.log("✅ HTML generated");
