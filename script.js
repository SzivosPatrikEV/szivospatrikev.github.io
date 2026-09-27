
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMEK
    ========================= */

    const menuButton =
        document.getElementById("menuButton");

    const navigation =
        document.getElementById("navigation");

    const schoolMenuButton =
        document.getElementById("schoolMenuButton");

    const schoolDropdown =
        document.getElementById("schoolDropdown");

    const navDropdown =
        document.querySelector(".nav-dropdown");


    /* =========================
       MOBIL MENÜ
    ========================= */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", (event) => {

            event.stopPropagation();

            navigation.classList.toggle("active");

        });

    }

    

    /* =========================
       ISKOLÁNK DROPDOWN
    ========================= */

    if (
        schoolMenuButton &&
        schoolDropdown &&
        navDropdown
    ) {

        schoolMenuButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                navDropdown.classList.toggle("open");

                const isOpen =
                    navDropdown.classList.contains("open");

                schoolMenuButton.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );

    }


    /* =========================
       DROPDOWNON BELÜLI KATTINTÁS
    ========================= */

    if (schoolDropdown) {

        schoolDropdown.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );

    }


    /* =========================
       KATTINTÁS MÁSHOVA
    ========================= */

    document.addEventListener(
        "click",
        (event) => {

            if (
                navDropdown &&
                !navDropdown.contains(event.target)
            ) {

                navDropdown.classList.remove("open");

                if (schoolMenuButton) {

                    schoolMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }


            if (
                navigation &&
                menuButton &&
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                navigation.classList.remove("active");

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

                if (navDropdown) {

                    navDropdown.classList.remove("open");

                }

                if (navigation) {

                    navigation.classList.remove("active");

                }

                if (schoolMenuButton) {

                    schoolMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

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

                if (navDropdown) {

                    navDropdown.classList.remove("open");

                }

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

                if (navDropdown) {

                    navDropdown.classList.remove("open");

                }

                if (navigation) {

                    navigation.classList.remove("active");

                }

                if (schoolMenuButton) {

                    schoolMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

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
