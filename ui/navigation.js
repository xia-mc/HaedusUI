const API_UPDATE_PENDING = "Unsupported, waiting for backend API update.";

document.addEventListener("DOMContentLoaded", function () {
    function setSubmenuWidthsAndPositions() {
        const wrapperWidth = document.querySelector(".nav-desktop .submenus-wrapper").offsetWidth;
        const submenuCount = document.querySelectorAll(".nav-desktop .top-level-menu > li.has-submenu").length;
        const submenus = document.querySelectorAll(".nav-desktop .submenus");
        submenus.forEach(function (submenu) {
            submenu.style.width = (wrapperWidth * submenuCount) + "px";
        });

        document.querySelectorAll(".nav-desktop .submenu").forEach(function (submenu) {
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
    document.getElementById("store-link").addEventListener("click", function () {
        gtag("event", "view_cart", {});
    });

    // Button click event
    document.querySelector(".navigation-wrapper .primary-button").addEventListener("click", function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "button_click",
            label: "My account",
            source: "Website navigation"
        });
    });

    // Setting widths and positions
    setSubmenuWidthsAndPositions();
    window.addEventListener("resize", setSubmenuWidthsAndPositions);

    // Hover event for desktop menu
    document.querySelectorAll(".nav-desktop .top-level-menu > li").forEach(function (item, index) {
        item.addEventListener("mouseenter", function () {
            document.querySelectorAll(".nav-desktop .top-level-menu > li").forEach(function (li) {
                li.classList.remove("submenu-opened");
            });

            if (item.classList.contains("has-submenu")) {
                const submenuIndex = Array.from(document.querySelectorAll(".nav-desktop .top-level-menu > li.has-submenu")).indexOf(item);
                const translateValue = -submenuIndex * document.querySelector(".submenus-wrapper").offsetWidth;
                document.querySelector(".nav-desktop .submenus").style.transform = "translateX(" + translateValue + "px)";
                setTimeout(function () {
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
    document.querySelector(".navigation-wrapper").addEventListener("mouseleave", function () {
        document.querySelectorAll(".nav-desktop .top-level-menu > li").forEach(function (item) {
            item.classList.remove("submenu-opened");
        });
        setTimeout(function () {
            document.querySelector(".nav-desktop .submenus-wrapper").style.opacity = "0";
        }, 0);
        adjustNavigationHeight();
        menuIndicator.style.opacity = "0";
    });

    // Mobile submenu toggle
    document.querySelectorAll(".nav-mobile .has-submenu > div, .nav-mobile .has-submenu > div i, .nav-mobile .has-submenu > a > i").forEach(function (element) {
        element.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const parentLi = this.closest(".top-level-menu-link");
            const mobileSubmenu = parentLi.querySelector(".mobile-submenu");
            mobileSubmenu.style.display = mobileSubmenu.style.display === "block" ? "none" : "block";
            parentLi.classList.toggle("opened");
        });
    });

    // Prevent propagation on submenu links
    document.querySelectorAll(".nav-mobile .has-submenu a").forEach(function (link) {
        link.addEventListener("click", function (e) {
            if (!this.querySelector("i")) {
                e.stopPropagation();
            }
        });
    });

    // Use event delegation on the container that holds all setting groups.
    const settingsContainer = document.querySelector(".settings-column");
    if (settingsContainer) {
        settingsContainer.addEventListener("click", function (e) {
            // Check if the click came from or inside a .setting-group-title element.
            const groupTitle = e.target.closest(".setting-group-title");
            if (!groupTitle || !settingsContainer.contains(groupTitle)) return;

            console.log("Setting group clicked:", groupTitle);
            const settingGroup = groupTitle.parentElement;
            const settingWrapper = settingGroup.querySelector(".setting-wrapper");

            console.log("Selected settingGroup:", settingGroup);
            console.log("Selected settingWrapper:", settingWrapper);

            if (settingWrapper) {
                settingGroup.classList.toggle("expanded");
                settingWrapper.classList.toggle("expanded");
                const icon = groupTitle.querySelector("i");
                if (icon) {
                    icon.classList.toggle("icon-chevron-up");
                }
                adjustNavigationHeight(2); // Update navigation height if needed.
            } else {
                console.error("settingWrapper not found for", settingGroup);
            }
        });
    } else {
        console.error("Settings container not found.");
    }


//     apis to this ui
    function addCategory(name, description) {
        // Create a new div element for the category
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "module";

        // Create an anchor element
        const anchor = document.createElement("a");
        anchor.href = "/";
        anchor.textContent = name;

        // Create a paragraph element for the description
        const descriptionP = document.createElement("p");
        descriptionP.className = "description";
        descriptionP.textContent = description;

        // Append the description to the anchor
        anchor.appendChild(descriptionP);

        // Append the anchor to the category div
        categoryDiv.appendChild(anchor);

        // Append the new category div before the highlighted categories
        const parentContainer = document.querySelector(".column.categories");
        const highlightedCategories = parentContainer.querySelector(".categories.highlighted");
        parentContainer.insertBefore(categoryDiv, highlightedCategories);
    }

    function addPinnedModule(name, description) {
        // Create a new div element for the module
        const moduleDiv = document.createElement("div");
        moduleDiv.className = "module";

        // Create an anchor element
        const anchor = document.createElement("a");
        anchor.href = "/";
        anchor.textContent = name;

        // Create a paragraph element for the description
        const descriptionP = document.createElement("p");
        descriptionP.className = "description";
        descriptionP.textContent = description;

        // Append the description and icon to the anchor
        anchor.appendChild(descriptionP);

        // Append the anchor to the module div
        moduleDiv.appendChild(anchor);

        // Append the new module div to the pinned-modules container
        const parentContainer = document.querySelector(".pinned-modules");
        parentContainer.appendChild(moduleDiv);
    }

    function addToggleModule(title, description, link = "/") {
        // Find the container where modules are added.
        const container = document.querySelector(".modules.module-container");
        if (!container) {
            console.error("Module container not found.");
            return;
        }

        // Create a new div element for the module and assign the "module" class.
        const moduleDiv = document.createElement("div");
        moduleDiv.classList.add("module");

        // Create an anchor element that wraps the module content.
        const anchor = document.createElement("a");
        anchor.href = link;

        // Add the title as a text node to the anchor.
        anchor.appendChild(document.createTextNode(title));

        // Create a paragraph element for the description and assign the "description" class.
        const descP = document.createElement("p");
        descP.classList.add("description");
        descP.textContent = description;
        anchor.appendChild(descP);

        // Append the anchor to the module container.
        moduleDiv.appendChild(anchor);

        // Finally, append the module to the modules container.
        container.appendChild(moduleDiv);
    }

    /**
     * Creates a new setting group element populated with a list of settings.
     * @param {string} groupTitle - The title for the setting group.
     * @param {Array} settingsArray - An array of settings, each an object with keys:
     *    title (string), description (string), and value (string).
     * @returns {HTMLElement} The new setting group element.
     */
    function createSettingGroup(groupTitle, settingsArray = []) {
        // Create the container for the group.
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("setting-group");

        // Create the title part.
        const titleDiv = document.createElement("div");
        titleDiv.classList.add("setting-group-title");

        // Create a <p> element for the title text.
        const titleP = document.createElement("p");
        titleP.classList.add("col-title", "Title-text");
        titleP.textContent = groupTitle;
        titleDiv.appendChild(titleP);

        // Create the chevron icon.
        const icon = document.createElement("i");
        icon.classList.add("icon-chevron-down");
        titleDiv.appendChild(icon);

        groupDiv.appendChild(titleDiv);

        // Create the wrapper for settings.
        const wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("setting-wrapper");

        // Add each setting.
        settingsArray.forEach(settingObj => {
            const settingEl = createSettingElement(settingObj);
            wrapperDiv.appendChild(settingEl);
        });

        groupDiv.appendChild(wrapperDiv);

        return groupDiv;
    }

    /**
     * Creates a single setting element.
     * @param {Object} settingObj - An object with properties: title, description, value.
     * @returns {HTMLElement} The setting element.
     */
    function createSettingElement({title, description, value}) {
        const settingDiv = document.createElement("div");
        settingDiv.classList.add("setting");

        // Create the info part.
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("setting-info");

        const settingTitleP = document.createElement("p");
        settingTitleP.classList.add("setting-title");
        settingTitleP.textContent = title;
        infoDiv.appendChild(settingTitleP);

        const settingDescP = document.createElement("p");
        settingDescP.classList.add("setting-description");
        settingDescP.textContent = description;
        infoDiv.appendChild(settingDescP);

        settingDiv.appendChild(infoDiv);

        // Create the value part.
        const valueDiv = document.createElement("div");
        valueDiv.classList.add("setting-value");
        valueDiv.textContent = value;

        settingDiv.appendChild(valueDiv);

        return settingDiv;
    }

    /**
     * Adds a single setting to an existing setting group.
     * @param {HTMLElement} groupElement - The setting group element created by createSettingGroup.
     * @param {Object} settingObj - An object with properties: title, description, value.
     */
    function addSettingToGroup(groupElement, settingObj) {
        // Find the setting-wrapper inside the group.
        const wrapper = groupElement.querySelector(".setting-wrapper");
        if (!wrapper) {
            console.error("No setting-wrapper found in the provided group element.");
            return;
        }

        const newSetting = createSettingElement(settingObj);
        wrapper.appendChild(newSetting);
    }

    function createModule(title, description, link = "/") {
        // Locate the container where modules for submenu-3 are placed.
        const container = document.querySelector("#submenu-3 .sidemodules .modules-wrapper");
        if (!container) {
            console.error("Module container in submenu-3 not found.");
            return;
        }

        // Create a new module element.
        const moduleDiv = document.createElement("div");
        moduleDiv.classList.add("module");

        // Create an anchor element that wraps the module content.
        const anchor = document.createElement("a");
        anchor.href = link;
        // Set the text content of the anchor to the module title.
        anchor.appendChild(document.createTextNode(title));

        // Create a paragraph element for the description and assign the "description" class.
        const descriptionP = document.createElement("p");
        descriptionP.classList.add("description");
        descriptionP.textContent = description;

        // Append the description to the anchor.
        anchor.appendChild(descriptionP);

        // Append the anchor to the module container.
        moduleDiv.appendChild(anchor);

        // Finally, append the new module to the target container.
        container.appendChild(moduleDiv);
    }

    window.api = {
        addCategory: addCategory,
        addPinnedModule: addPinnedModule,
        addToggleModule: addToggleModule,
        createSettingGroup: createSettingGroup,
        createSettingElement: createSettingElement,
        addSettingToGroup: addSettingToGroup,
        createModule: createModule
    };

    // 原api.js
    class InternalError extends Error {
        constructor(message) {
            super(message);
            this.name = "InternalError";  // 设置错误名称
        }
    }

    const makeRequest = (type, args, callback) => {
        let fixedArgs = args.join(",");
        fetch(`headus://clickui/${type}?${fixedArgs}`)
            .then(r => {
                if (!r.ok) {
                    throw InternalError(`Internal request '${type}' failed: ${r.status} (${r.statusText}).`);
                }
                r.text().then(callback);
            })
            .catch(e => {
                throw InternalError(`Internal request '${type}' failed: ${e}.`);
            });
    };

    /**
     * 更新Categories  JsonArray<String>
     * @param callback Consumer<String>
     */
    const updateCategories = callback => {
        makeRequest("cats", [], callback);
    };

    /**
     * 更新指定Category里的所有Module  JsonArray<String>
     * @param category String
     * @param callback Consumer<String>
     */
    const updateModules = (category, callback) => {
        makeRequest("mods", [category], callback);
    };

    /**
     * 更新指定Module里的所有Value  JsonArray<JsonObject<JsonObject>>，即List<Value<"Type:Name", Metadata<MetadataName, Value>>>
     * @param module String
     * @param callback Consumer<String>
     */
    const updateValues = (module, callback) => {
        makeRequest("values", [module], callback);
    };

    /**
     * 设置指定Module里的指定Setting的值
     * @param module String
     * @param typeName String  格式"type:name"
     * @param value String
     */
    const setValue = (module, typeName, value) => {
        makeRequest("set", [module, typeName, value], () => {
        });
    };

    // 原utils.js
    const GLFW_KEY_MAP = {
        32: "Space",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        257: "Enter",
        258: "Tab",
        259: "Backspace",
        260: "Insert",
        261: "Delete",
        262: "Right Arrow",
        263: "Left Arrow",
        264: "Down Arrow",
        265: "Up Arrow",
        266: "Page Up",
        267: "Page Down",
        268: "Home",
        269: "End",
        340: "Left Shift",
        341: "Left Control",
        342: "Left Alt",
        343: "Left Super",
        344: "Right Shift",
        345: "Right Control",
        346: "Right Alt",
        347: "Right Super",
        348: "Menu"
    };

    /**
     * 获取一个GLFW键码的字符串表示
     * @param keyCode GLFW键码
     * @param defaultValue 如果找不到对应的表示，默认值
     * @return String
     */
    function getGLFWKeyName(keyCode, defaultValue) {
        return GLFW_KEY_MAP[keyCode] || defaultValue;
    }


    const init = () => {
        updateCategories(json => JSON.parse(json).forEach(categoryName => {
            addCategory(categoryName, API_UPDATE_PENDING);
            let category = createSettingGroup(categoryName);

            initModules(categoryName, category);
        }));
    };

    const initModules = (categoryName, category) => {
        updateModules(categoryName, json => JSON.parse(json).forEach(moduleName => {
            addToggleModule(moduleName, API_UPDATE_PENDING);
            createModule(moduleName, API_UPDATE_PENDING);

            initValues(moduleName, category);
        }));
    };

    const initValues = (moduleName, category) => {
        updateValues(moduleName, json => JSON.parse(json).forEach(values => {
            Object.entries(values).forEach(([key, data]) => {
                switch (key) {
                    case "bool:enabled": {
                        // TODO 等neil给API
                        return;
                    }
                    case "number:key": {
                        addSettingToGroup(category, {
                            title: moduleName,
                            description: API_UPDATE_PENDING,
                            value: getGLFWKeyName(data, "none")
                        });
                        return;
                    }
                }

                let [type, name] = key.split(":");

                switch (type) {
                    case "bool": {
                        let value = data["value"];
                        // TODO 等neil给API
                        break;
                    }
                    case "number": {
                        let min = data["min"];
                        let max = data["max"];
                        let inc = data["inc"];
                        let value = data["value"];
                        // TODO 等neil给API
                        break;
                    }
                    case "mode": {
                        let modes = data["modes"];  // Array<String>
                        let value = data["value"];
                        // TODO 等neil给API
                        break;
                    }
                }
            });
        }));
    };

    const testInit = () => {
        addCategory("Test Category 1", "This is a description for Test Category 1.");
        addCategory("Test Category 2", "This is a description for Test Category 2.");
        addCategory("Test Category 3", "This is a description for Test Category 3.");

        addPinnedModule("Test Module 1", "This is a description for Test Module 1.");
        addPinnedModule("Test Module 2", "This is a description for Test Module 2.");

        const combatGroup = createSettingGroup("Combat Settings", [
            {
                title: "Aimbot",
                description: "Aimbot is a feature that helps you aim at the enemy",
                value: "X"
            },
            {
                title: "Trigger Bot",
                description: "Automatically fires when an enemy is in sight",
                value: "B"
            }
        ]);

        const settingsColumn = document.querySelector(".settings-column");
        if (settingsColumn) {
            settingsColumn.appendChild(combatGroup);
        } else {
            console.error("Settings column not found.");
        }

        // Example: Add an additional setting to the newly created group.
        addSettingToGroup(combatGroup, {
            title: "Wallhack",
            description: "Allows you to see through walls",
            value: "X"
        });

        for (let i = 1; i <= 50; i++) {
            addToggleModule(`Test Module ${i}`, `This is a description for Test Module ${i}.`);
            createModule(`Test Module ${i}`, `This is a description for Test Module ${i}.`);
        }
    };

    testInit();
});
