import fs from "fs";
import { techStack } from "../data/techStack.js";
import { projects } from "../data/projects.js";
import { courses } from "../data/courses.js";

const IMG_BASE_PATH = "assets/images/projects";
const template = fs.readFileSync("templates/index.template.html", "utf8");

/* ---------- TECH STACK ---------- */

function renderTechStack() {
  return techStack
    .map(
      (section) => `
      <h3>${section.title}</h3>
      <p class="tech-icons">
        ${section.items
          .map(
            (i) =>
              ` <a href="#projects-section"><img src="${i.badge}" alt="${i.name}" class="tech-badge"/></a>`,
          )
          .join(" ")}
      </p>
      
    `,
    )
    .join("");
}

/* ---------- COURSES ---------- */

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
/* ---------- FEATURED PROJECTS ---------- */

// 1. Sorting by date
const sortedProjects = [...projects].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);

function renderFeaturedProjects() {
  return sortedProjects
    .filter((p) => p.featured)
    .map((project) => {
      const hasCover = project.media && project.media.cover;
      let visualContent = "";

      if (hasCover) {
        const coverUrl = `${IMG_BASE_PATH}/${project.slug}/${project.slug}-${project.media.cover}`;
        visualContent = `<img src="${coverUrl}" alt="${project.title}" loading="lazy">`;
      } else {
        const textForLogo = project.appName || project.title;
        visualContent = `<div class="featured-logo-text">${textForLogo}</div>`;
      }

      const mainStackHtml = (project.mainStack || [])
        .map((s) => `<span class="stack-tag main-tag">${s}</span>`)
        .join("");

      const secondaryStackHtml = (project.stack || [])
        .map((s) => `<span class="stack-tag">${s}</span>`)
        .join("");

      const repoUrl = project.links.find((l) => l.tag === "repo")?.url || "#";

      return `
        <a href="${repoUrl}" target="_blank" class="featured-card">
          <div class="featured-card-image">
            ${visualContent}
          </div>
          <div class="featured-card-content">
            <h3>${project.title}</h3>
            <div class="featured-card-stack">
              ${mainStackHtml}
              ${secondaryStackHtml}
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

/* ---------- PROJECTS ---------- */

function renderProjects() {
  return projects
    .map((project) => {
      // Links
      const repo = project.links.find((l) => l.tag === "repo")?.url || "#";

      const linkObj =
        project.links.find((l) => l.tag === "demo") ||
        project.links.find((l) => l.tag === "pr");

      const url = linkObj?.url || "#";

      const linkText =
        linkObj?.tag === "demo"
          ? "🌍 Live Demo"
          : linkObj?.tag === "pr"
            ? "📋 View PR"
            : "—";

      // Stack
      const mainStack =
        project.mainStack?.length > 0
          ? `<span class="stack-main">${project.mainStack.join(", ")}</span>`
          : "";

      const secondaryStack =
        project.stack?.length > 0 ? project.stack.join(", ") : "";

      const fullStackHtml = [mainStack, secondaryStack]
        .filter((part) => part !== "")
        .join(", ");

      // Category
      const categoryAttribute = project.category
        ? project.category.join(" ").toLowerCase()
        : "";

      return `
<tr data-category="${categoryAttribute}">
<td><a href="${repo}"><b>${project.title}</b></a></td>
<td>${fullStackHtml || "—"}</td>
<td>${url !== "#" ? `<a href="${url}">${linkText}</a>` : "—"}</td>
</tr>
`;
    })
    .join("");
}

/* ---------- GENERATE PAGE ---------- */

let html = template
  .replace("{{TECH_STACK}}", renderTechStack())
  .replace("{{COURSES}}", renderCourses())
  .replace("{{FEATURED_PROJECTS}}", renderFeaturedProjects())
  .replace("{{PROJECTS}}", renderProjects());

fs.writeFileSync("index.html", html);

console.log("✅ HTML generated");
