document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("siteMenuButton");
    const navigation = document.getElementById("siteNavigation");
    const dropdownButtons = Array.from(
        document.querySelectorAll(".site-nav-dropdown-button")
    );

    menuButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        navigation?.classList.toggle("active");
        menuButton.setAttribute("aria-expanded", String(navigation?.classList.contains("active")));
    });

    dropdownButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const dropdown = button.closest(".site-nav-dropdown");
            const shouldOpen = !dropdown.classList.contains("open");

            document.querySelectorAll(".site-nav-dropdown.open").forEach((item) => {
                item.classList.remove("open");
                item.querySelector(".site-nav-dropdown-button")?.setAttribute("aria-expanded", "false");
            });

            dropdown.classList.toggle("open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));
        });
    });

    document.addEventListener("click", (event) => {
        document.querySelectorAll(".site-nav-dropdown.open").forEach((dropdown) => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove("open");
                dropdown.querySelector(".site-nav-dropdown-button")?.setAttribute("aria-expanded", "false");
            }
        });

        if (navigation && menuButton && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
            navigation.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });

    navigation?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuButton?.setAttribute("aria-expanded", "false");
            link.closest(".site-nav-dropdown")?.classList.remove("open");
            link.closest(".site-nav-dropdown")?.querySelector(".site-nav-dropdown-button")?.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        document.querySelectorAll(".site-nav-dropdown.open").forEach((dropdown) => dropdown.classList.remove("open"));
        dropdownButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
        navigation?.classList.remove("active");
        menuButton?.setAttribute("aria-expanded", "false");
    });
});
