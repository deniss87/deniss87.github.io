document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectRows = document.querySelectorAll("#projects-content tr");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // 1. Managing the active state of buttons
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. Filtering table rows
      projectRows.forEach((row) => {
        const categories = row.dataset.category
          ? row.dataset.category.split(" ")
          : [];

        if (filter === "all" || categories.includes(filter)) {
          row.style.display = "";
          row.classList.add("fade-in");
        } else {
          row.style.display = "none";
        }
      });
    });
  });
});
