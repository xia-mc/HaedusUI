document.addEventListener('DOMContentLoaded', function() {
    function setSubmenuWidthsAndPositions() {
        const wrapperWidth = document.querySelector(".nav-desktop .submenus-wrapper").offsetWidth;
        const submenuCount = document.querySelectorAll(".nav-desktop .top-level-menu > li.has-submenu").length;
        const submenus = document.querySelectorAll(".nav-desktop .submenus");
        submenus.forEach(function(submenu) {
            submenu.style.width = (wrapperWidth * submenuCount) + "px";
        });

        document.querySelectorAll(".nav-desktop .submenu").forEach(function(submenu) {
            submenu.style.width = wrapperWidth + "px";
        });
    }

    function adjustNavigationHeight(show) {
        const baseHeight = document.querySelector(".nav-desktop .level-0").offsetHeight;
        let submenuHeight = 0;

        if (show) {
            const activeSubmenuId = document.querySelectorAll(".nav-desktop .top-level-menu > li.has-submenu")[show - 1].getAttribute("data-submenu");
            submenuHeight = document.querySelector("#" + activeSubmenuId).offsetHeight;
        }

        const navDesktop = document.querySelector(".nav-desktop");
        navDesktop.style.height = (baseHeight + submenuHeight) + "px";
    }

    // Setting up the menu indicator
    const firstSubmenu = document.querySelector(".nav-desktop .top-level-menu > li.has-submenu");
    const menuIndicator = document.querySelector(".nav-desktop .menu-indicator");
    menuIndicator.style.width = firstSubmenu.offsetWidth + "px";
    menuIndicator.style.left = "0";
    menuIndicator.style.height = firstSubmenu.offsetHeight + "px";
    menuIndicator.style.opacity = "0";

    // Store link click event
    document.getElementById("store-link").addEventListener("click", function() {
        gtag("event", "view_cart", {});
    });

    // Button click event
    document.querySelector(".navigation-wrapper .primary-button").addEventListener("click", function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "button_click",
            label: "My account",
            source: "Website navigation"
        });
    });

    // Setting widths and positions
    setSubmenuWidthsAndPositions();
    window.addEventListener('resize', setSubmenuWidthsAndPositions);

    // Hover event for desktop menu
    document.querySelectorAll(".nav-desktop .top-level-menu > li").forEach(function(item, index) {
        item.addEventListener("mouseenter", function() {
            document.querySelectorAll(".nav-desktop .top-level-menu > li").forEach(function(li) {
                li.classList.remove("submenu-opened");
            });

            if (item.classList.contains("has-submenu")) {
                const submenuIndex = Array.from(document.querySelectorAll(".nav-desktop .top-level-menu > li.has-submenu")).indexOf(item);
                const translateValue = -submenuIndex * document.querySelector(".submenus-wrapper").offsetWidth;
                document.querySelector(".nav-desktop .submenus").style.transform = "translateX(" + translateValue + "px)";
                setTimeout(function() {
                    document.querySelector(".nav-desktop .submenus-wrapper").style.opacity = "1";
                }, 500);
                adjustNavigationHeight(submenuIndex + 1);
                item.classList.add("submenu-opened");
            } else {
                adjustNavigationHeight();
            }


            // Updated position calculation for menu indicator
            const itemRect = item.getBoundingClientRect();  // Get the bounding rectangle of the current item
            const level0Rect = document.querySelector(".nav-desktop .level-0").getBoundingClientRect(); // Get the position of the .level-0 container
            const toplevelRect = document.querySelector(".nav-desktop .top-level-menu").getBoundingClientRect(); // Get the position of the .top-level-menu container
            const leftPosition = itemRect.left - toplevelRect.left; // this should be the abs left pos of the selected item


            menuIndicator.style.width = item.offsetWidth + "px";
            menuIndicator.style.left = leftPosition + "px"; // Corrected left position
            menuIndicator.style.height = item.offsetHeight + "px";
            menuIndicator.style.opacity = "1";

        });
    });

    // Mouseleave event for navigation wrapper
    document.querySelector(".navigation-wrapper").addEventListener("mouseleave", function() {
        document.querySelectorAll(".nav-desktop .top-level-menu > li").forEach(function(item) {
            item.classList.remove("submenu-opened");
        });
        setTimeout(function() {
            document.querySelector(".nav-desktop .submenus-wrapper").style.opacity = "0";
        }, 0);
        adjustNavigationHeight();
        menuIndicator.style.opacity = "0";
    });

    // Mobile submenu toggle
    document.querySelectorAll(".nav-mobile .has-submenu > div, .nav-mobile .has-submenu > div i, .nav-mobile .has-submenu > a > i").forEach(function(element) {
        element.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parentLi = this.closest(".top-level-menu-link");
            const mobileSubmenu = parentLi.querySelector(".mobile-submenu");
            mobileSubmenu.style.display = mobileSubmenu.style.display === "block" ? "none" : "block";
            parentLi.classList.toggle("opened");
        });
    });

    // Prevent propagation on submenu links
    document.querySelectorAll(".nav-mobile .has-submenu a").forEach(function(link) {
        link.addEventListener("click", function(e) {
            if (!this.querySelector("i")) {
                e.stopPropagation();
            }
        });
    });

    document.querySelectorAll('.setting-group-title').forEach(function(group) {
        group.addEventListener('click', function() {
            console.log('Setting group clicked:', this);
            const settingGroup = this.parentElement;
            const settingWrapper = settingGroup.querySelector('.setting-wrapper');

            // Log the selected elements
            console.log('Selected settingGroup:', settingGroup);
            console.log('Selected settingWrapper:', settingWrapper);

            if (settingWrapper) {
                settingGroup.classList.toggle('expanded');
                settingWrapper.classList.toggle('expanded');
                this.querySelector('i').classList.toggle('icon-chevron-up');
                adjustNavigationHeight(2); // Call function whenever expanded
            } else {
                console.error('settingWrapper not found for', settingGroup);
            }
        });
    });


//     apis to this ui
    function addCategory(name, description) {
        // Create a new div element for the category
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'module';

        // Create an anchor element
        const anchor = document.createElement('a');
        anchor.href = '/';
        anchor.textContent = name;

        // Create a paragraph element for the description
        const descriptionP = document.createElement('p');
        descriptionP.className = 'description';
        descriptionP.textContent = description;

        // Append the description to the anchor
        anchor.appendChild(descriptionP);

        // Append the anchor to the category div
        categoryDiv.appendChild(anchor);

        // Append the new category div before the highlighted categories
        const parentContainer = document.querySelector('.column.categories');
        const highlightedCategories = parentContainer.querySelector('.categories.highlighted');
        parentContainer.insertBefore(categoryDiv, highlightedCategories);
    }

    addCategory('Test Category 1', 'This is a description for Test Category 1.');
    addCategory('Test Category 2', 'This is a description for Test Category 2.');
    addCategory('Test Category 3', 'This is a description for Test Category 3.');

    function addPinnedModule(name, description) {
        // Create a new div element for the module
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'module';

        // Create an anchor element
        const anchor = document.createElement('a');
        anchor.href = '/';
        anchor.textContent = name;

        // Create a paragraph element for the description
        const descriptionP = document.createElement('p');
        descriptionP.className = 'description';
        descriptionP.textContent = description;

        // Append the description and icon to the anchor
        anchor.appendChild(descriptionP);

        // Append the anchor to the module div
        moduleDiv.appendChild(anchor);

        // Append the new module div to the pinned-modules container
        const parentContainer = document.querySelector('.pinned-modules');
        parentContainer.appendChild(moduleDiv);
    }

    addPinnedModule('Test Module 1', 'This is a description for Test Module 1.');
    addPinnedModule('Test Module 2', 'This is a description for Test Module 2.');


    function addToggleModule(title, description, link = "/") {
        // Find the container where modules are added.
        const container = document.querySelector('.modules.module-container');
        if (!container) {
            console.error('Module container not found.');
            return;
        }

        // Create a new div element for the module and assign the "module" class.
        const moduleDiv = document.createElement('div');
        moduleDiv.classList.add('module');

        // Create an anchor element that wraps the module content.
        const anchor = document.createElement('a');
        anchor.href = link;

        // Add the title as a text node to the anchor.
        anchor.appendChild(document.createTextNode(title));

        // Create a paragraph element for the description and assign the "description" class.
        const descP = document.createElement('p');
        descP.classList.add('description');
        descP.textContent = description;
        anchor.appendChild(descP);

        // Append the anchor to the module container.
        moduleDiv.appendChild(anchor);

        // Finally, append the module to the modules container.
        container.appendChild(moduleDiv);
    }

    for(let i = 1; i <= 50; i++) {
        addToggleModule(`Test Module ${i}`, `This is a description for Test Module ${i}.`);
    }
});
