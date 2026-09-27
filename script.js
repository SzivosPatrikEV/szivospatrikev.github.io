
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMEK
    ========================= */

    const menuButton =
        document.getElementById("menuButton");

    const navigation =
        document.getElementById("navigation");

    const dropdownButtons = Array.from(
        document.querySelectorAll(".nav-dropdown-button")
    );


    /* =========================
       MOBIL MENÜ
    ========================= */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", (event) => {

            event.stopPropagation();

            navigation.classList.toggle("active");
            menuButton.setAttribute(
                "aria-expanded",
                String(navigation.classList.contains("active"))
            );

        });

    }

    

    /* =========================
       NAVIGATION DROPDOWNS
    ========================= */

    dropdownButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const dropdown = button.closest(".nav-dropdown");
            const shouldOpen = !dropdown.classList.contains("open");

            document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
                item.classList.remove("open");
                item.querySelector(".nav-dropdown-button")?.setAttribute("aria-expanded", "false");
            });

            dropdown.classList.toggle("open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));
        });
    });


    /* =========================
       DROPDOWNON BELÜLI KATTINTÁS
    ========================= */

    document.querySelectorAll(".dropdown-menu").forEach((dropdown) => {
        dropdown.addEventListener("click", (event) => event.stopPropagation());
    });


    /* =========================
       KATTINTÁS MÁSHOVA
    ========================= */

    document.addEventListener(
        "click",
        (event) => {

            document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove("open");
                    dropdown.querySelector(".nav-dropdown-button")?.setAttribute("aria-expanded", "false");
                }
            });


            if (
                navigation &&
                menuButton &&
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                navigation.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");

            }

        }
    );


    /* =========================
       ISKOLÁNK LINKJEK
    ========================= */

    const dropdownLinks =
        document.querySelectorAll(
            ".dropdown-menu a"
        );


    dropdownLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                link.closest(".nav-dropdown")?.classList.remove("open");

                if (navigation) {

                    navigation.classList.remove("active");

                }
                menuButton?.setAttribute("aria-expanded", "false");

                link.closest(".nav-dropdown")?.querySelector(".nav-dropdown-button")?.setAttribute("aria-expanded", "false");

            }
        );

    });


    /* =========================
       FŐ NAVIGÁCIÓ LINKJEK
    ========================= */

    const navigationLinks =
        document.querySelectorAll(
            ".navigation > a"
        );


    navigationLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                if (navigation) {

                    navigation.classList.remove("active");

                }
                menuButton?.setAttribute("aria-expanded", "false");

                document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => dropdown.classList.remove("open"));

            }
        );

    });


    /* =========================
       ESC BILLENTYŰ
    ========================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => dropdown.classList.remove("open"));

                if (navigation) {

                    navigation.classList.remove("active");

                }

                menuButton?.setAttribute("aria-expanded", "false");

                dropdownButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));

            }

        }
    );

    /* =========================
       AUTOMATIKUS KÉPSLIDER
    ========================= */

    const slider = document.querySelector(".slider");

    if (slider) {
        const slides = Array.from(slider.querySelectorAll(".slide"));
        const dots = Array.from(slider.querySelectorAll(".slider-dot"));
        const previousButton = slider.querySelector(".slider-prev");
        const nextButton = slider.querySelector(".slider-next");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let currentIndex = slides.findIndex((slide) => slide.classList.contains("active"));
        let timer;

        const showSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentIndex;
                slide.classList.toggle("active", isActive);
                slide.setAttribute("aria-hidden", String(!isActive));
            });

            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;
                dot.classList.toggle("active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        };

        const stopTimer = () => window.clearInterval(timer);
        const startTimer = () => {
            stopTimer();
            if (!reducedMotion.matches && slides.length > 1) {
                timer = window.setInterval(() => showSlide(currentIndex + 1), 5500);
            }
        };

        if (slides.length) {
            showSlide(currentIndex < 0 ? 0 : currentIndex);
            startTimer();

            previousButton?.addEventListener("click", () => {
                showSlide(currentIndex - 1);
                startTimer();
            });

            nextButton?.addEventListener("click", () => {
                showSlide(currentIndex + 1);
                startTimer();
            });

            dots.forEach((dot, index) => {
                dot.addEventListener("click", () => {
                    showSlide(index);
                    startTimer();
                });
            });

            slider.addEventListener("mouseenter", stopTimer);
            slider.addEventListener("mouseleave", startTimer);
            slider.addEventListener("focusin", stopTimer);
            slider.addEventListener("focusout", (event) => {
                if (!slider.contains(event.relatedTarget)) startTimer();
            });

            reducedMotion.addEventListener?.("change", startTimer);
        }
    }

});
