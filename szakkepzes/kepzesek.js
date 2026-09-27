document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("documentsCarousel");
    if (carousel) {
        const cards = Array.from(carousel.querySelectorAll(".document-card"));
        const dots = Array.from(document.querySelectorAll(".document-dot"));
        const previous = document.getElementById("previousDocument");
        const next = document.getElementById("nextDocument");
        let activeIndex = Math.max(0, cards.findIndex((card) => card.classList.contains("active")));

        const showCard = (index) => {
            activeIndex = (index + cards.length) % cards.length;
            cards.forEach((card, cardIndex) => {
                const isActive = cardIndex === activeIndex;
                card.classList.toggle("active", isActive);
                card.setAttribute("aria-hidden", String(!isActive));
            });
            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === activeIndex;
                dot.classList.toggle("active", isActive);
                dot.setAttribute("aria-current", String(isActive));
            });
        };

        previous?.addEventListener("click", () => showCard(activeIndex - 1));
        next?.addEventListener("click", () => showCard(activeIndex + 1));
        dots.forEach((dot, index) => dot.addEventListener("click", () => showCard(index)));
        carousel.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") showCard(activeIndex - 1);
            if (event.key === "ArrowRight") showCard(activeIndex + 1);
        });
        showCard(activeIndex);
    }

    const search = document.getElementById("examSearch");
    const rows = Array.from(document.querySelectorAll("#examRows tr"));
    const resultCount = document.getElementById("resultCount");
    const emptyState = document.getElementById("examEmpty");

    if (!search || !rows.length) return;

    const filterRows = () => {
        const query = search.value.trim().toLocaleLowerCase("hu");
        let visibleCount = 0;

        rows.forEach((row) => {
            const matches = row.textContent.toLocaleLowerCase("hu").includes(query);
            row.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        if (resultCount) resultCount.textContent = String(visibleCount);
        if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    search.addEventListener("input", filterRows);

    document.addEventListener("keydown", (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            search.focus();
        }
        if (event.key === "Escape" && document.activeElement === search) {
            search.value = "";
            filterRows();
            search.blur();
        }
    });
});
