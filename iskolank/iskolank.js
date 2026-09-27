
/* =========================================================
   PTE SZENT-GYÖRGYI
   KÖZÖS HEADER JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.getElementById("siteMenuButton");
    const navigation = document.getElementById("siteNavigation");

    const schoolMenuButton =
        document.getElementById("schoolMenuButton");

    const schoolDropdown =
        document.getElementById("schoolDropdown");

    const navDropdown =
        document.querySelector(".site-nav-dropdown");


    /* MOBIL MENÜ */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function () {

            navigation.classList.toggle("active");

        });

    }


    /* ISKOLÁNK DROPDOWN */

    if (
        schoolMenuButton &&
        schoolDropdown &&
        navDropdown
    ) {

        schoolMenuButton.addEventListener("click", function (event) {

            event.stopPropagation();

            navDropdown.classList.toggle("open");

            schoolMenuButton.setAttribute(
                "aria-expanded",
                navDropdown.classList.contains("open")
            );

        });

    }


    /* DROPDOWN BEZÁRÁSA KÍVÜLRE KATTINTÁSKOR */

    document.addEventListener("click", function (event) {

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

    });


    /* NAVIGÁCIÓS LINK */

    if (navigation) {

        const links =
            navigation.querySelectorAll("a");

        links.forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("active");

                if (navDropdown) {
                    navDropdown.classList.remove("open");
                }

                if (schoolMenuButton) {
                    schoolMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

        });

    }

});
