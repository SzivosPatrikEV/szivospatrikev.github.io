document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector(".osztaly-table");
    const mobileView = document.getElementById("classCards");
    if (!table || !mobileView) return;

    let currentGrid = null;
    let currentSpecialties = null;

    table.querySelectorAll("tbody tr").forEach((row) => {
        if (row.classList.contains("category-row")) {
            const section = document.createElement("section");
            section.className = "mobile-class-section";
            const heading = document.createElement("h2");
            heading.textContent = row.cells[0]?.textContent.trim() || "Osztályok";
            currentGrid = document.createElement("div");
            currentGrid.className = "mobile-class-grid";
            section.append(heading, currentGrid);
            mobileView.append(section);
            currentSpecialties = null;
            return;
        }

        if (row.cells.length === 4 && currentGrid) {
            const [tagCell, classCell, branchCell, specialtyCell] = row.cells;
            const card = document.createElement("article");
            card.className = "mobile-class-card";

            const cardTop = document.createElement("div");
            cardTop.className = "mobile-class-card-top";
            const className = document.createElement("h3");
            className.textContent = classCell.textContent.trim();
            const type = document.createElement("span");
            type.className = "mobile-class-type";
            type.textContent = tagCell.textContent.trim();
            cardTop.append(className, type);

            const branch = document.createElement("p");
            branch.className = "mobile-class-branch";
            branch.textContent = branchCell.textContent.trim();
            currentSpecialties = document.createElement("ul");
            currentSpecialties.className = "mobile-specialties";
            const specialty = document.createElement("li");
            specialty.textContent = specialtyCell.textContent.trim();
            currentSpecialties.append(specialty);

            card.append(cardTop, branch, currentSpecialties);
            currentGrid.append(card);
            return;
        }

        if (row.cells.length === 1 && currentSpecialties) {
            const specialty = document.createElement("li");
            specialty.textContent = row.cells[0].textContent.trim();
            currentSpecialties.append(specialty);
        }
    });
});
