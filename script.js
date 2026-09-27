
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

});

