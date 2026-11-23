(function () {
    const DEFAULT_SIZE = "small";

    // Единый справочник цен и базовых данных тортов.
    // Базовый ID торта один (например, "zebra"), а внутри лежат размеры со своими ценами.
    window.KARAS_CAKE_CATALOG = {
        "berry-cake": {
            name: "Berry Cake",
            defaultSize: "small",
            image: "images/BerryCake.jpg",
            sizes: {
                small: { label: "Small", price: 7 },
                large: { label: "Large", price: 14 }
            }
        },
        "chocolate-cake": {
            name: "Chocolate Cake",
            defaultSize: "small",
            image: "images/ChocolateCake.jpg",
            sizes: {
                small: { label: "Small", price: 12 },
                large: { label: "Large", price: 22 }
            }
        },
        "zebra": {
            name: "Zebra",
            defaultSize: "small",
            image: "images/Zebra_1.jpg",
            sizes: {
                small: { label: "Small", price: 14 },
                large: { label: "Large", price: 26 }
            }
        },
        "sochi-walnut-pastry": {
            name: "Sochi Walnut Pastry",
            defaultSize: "small",
            image: "images/Sochinskiy.jpg",
            sizes: {
                small: { label: "Small", price: 7 },
                large: { label: "Large", price: 13 }
            }
        },
        "gata": {
            name: "Gata",
            defaultSize: "small",
            image: "images/Gata.jpg",
            sizes: {
                small: { label: "Small", price: 2 },
                large: { label: "Large", price: 4 }
            }
        },
        "cigarettes": {
            name: "Cigarettes",
            defaultSize: "small",
            image: "images/Cigarettes.jpg",
            sizes: {
                small: { label: "Small", price: 3 },
                large: { label: "Large", price: 6 }
            }
        },
        "birds-milk-pastry": {
            name: "Bird's Milk Pastry",
            defaultSize: "small",
            image: "images/BirdsMilk.jpg",
            sizes: {
                small: { label: "Small", price: 6 },
                large: { label: "Large", price: 11 }
            }
        },
        "bon-bon": {
            name: "Bon-Bon",
            defaultSize: "small",
            image: "images/BonBon.png",
            sizes: {
                small: { label: "Small", price: 14 },
                large: { label: "Large", price: 26 }
            }
        },
        "berry-basket": {
            name: "Berry Basket",
            defaultSize: "small",
            image: "images/BerryBasket.jpg",
            sizes: {
                small: { label: "Small", price: 11 },
                large: { label: "Large", price: 20 }
            }
        }
    };

    // Получить базовую запись торта по его ID (например, "zebra")
    window.getCakeCatalogEntry = function (cakeId) {
        const catalog = window.KARAS_CAKE_CATALOG || {};
        return catalog[cakeId] || null;
    };

    // Проверить и нормализовать размер ("small" или "large")
    window.resolveCakeSize = function (cakeId, requestedSize) {
        const entry = window.getCakeCatalogEntry(cakeId);
        if (!entry || !entry.sizes || typeof entry.sizes !== "object") {
            return typeof requestedSize === "string" && requestedSize.trim()
                ? requestedSize.trim().toLowerCase()
                : DEFAULT_SIZE;
        }

        const normalized = typeof requestedSize === "string"
            ? requestedSize.trim().toLowerCase()
            : "";

        if (normalized && Object.prototype.hasOwnProperty.call(entry.sizes, normalized)) {
            return normalized;
        }
        if (entry.defaultSize && Object.prototype.hasOwnProperty.call(entry.sizes, entry.defaultSize)) {
            return entry.defaultSize;
        }
        const availableSizes = Object.keys(entry.sizes);
        return availableSizes[0] || DEFAULT_SIZE;
    };

    // Получить данные конкретного размера ({ size, label, price, ... })
    window.getCakeSizeInfo = function (cakeId, requestedSize) {
        const entry = window.getCakeCatalogEntry(cakeId);
        const sizeKey = window.resolveCakeSize(cakeId, requestedSize);
        if (!entry || !entry.sizes || !entry.sizes[sizeKey]) {
            return null;
        }
        return {
            size: sizeKey,
            ...entry.sizes[sizeKey]
        };
    };

    // Получить цену торта для указанного размера (если размер не передан — берётся размер по умолчанию)
    window.getCakePrice = function (cakeId, sizeOrFallback = DEFAULT_SIZE, fallbackPrice = 0) {
        let requestedSize = sizeOrFallback;
        let effectiveFallback = fallbackPrice;

        // Поддержка старого вызова вида getCakePrice("zebra", 14)
        if (typeof sizeOrFallback === "number") {
            requestedSize = DEFAULT_SIZE;
            effectiveFallback = sizeOrFallback;
        }

        const entry = window.getCakeCatalogEntry(cakeId);
        if (entry) {
            if (entry.sizes && typeof entry.sizes === "object") {
                const sizeKey = window.resolveCakeSize(cakeId, requestedSize);
                const sizeObj = entry.sizes[sizeKey];
                if (sizeObj && typeof sizeObj.price === "number" && !Number.isNaN(sizeObj.price)) {
                    return Math.max(0, sizeObj.price);
                }
            }
            if (typeof entry.price === "number" && !Number.isNaN(entry.price)) {
                return Math.max(0, entry.price);
            }
        }

        const parsedFallback = Number(effectiveFallback);
        return Number.isNaN(parsedFallback) ? 0 : Math.max(0, parsedFallback);
    };

    // Собрать уникальный ID варианта для корзины и элементов на странице: "zebra:small" / "zebra:large"
    window.getCakeVariantId = function (cakeId, requestedSize) {
        const sizeKey = window.resolveCakeSize(cakeId, requestedSize);
        return `${cakeId}:${sizeKey}`;
    };

    // Разбить ID варианта ("zebra:large") обратно на базовый ID торта и размер
    window.parseCakeVariantId = function (variantId) {
        if (typeof variantId !== "string") {
            return { cakeId: "", size: DEFAULT_SIZE };
        }
        const separatorIndex = variantId.lastIndexOf(":");
        if (separatorIndex === -1) {
            return {
                cakeId: variantId,
                size: window.resolveCakeSize(variantId, DEFAULT_SIZE)
            };
        }
        const cakeId = variantId.slice(0, separatorIndex);
        const rawSize = variantId.slice(separatorIndex + 1);
        return {
            cakeId,
            size: window.resolveCakeSize(cakeId, rawSize)
        };
    };

    // Принудительная перезагрузка справочника с меткой времени в обход HTTP-кэша браузера
    window.reloadCakeCatalog = function (customSrc, onLoaded) {
        const currentScript = document.currentScript;
        const baseSrc = customSrc || (currentScript && currentScript.src
            ? currentScript.src.split("?")[0]
            : null);

        if (!baseSrc) {
            if (typeof onLoaded === "function") onLoaded();
            return;
        }

        const bustUrl = `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}_t=${Date.now()}`;
        const scriptEl = document.createElement("script");
        scriptEl.src = bustUrl;
        scriptEl.async = false;

        scriptEl.onload = function () {
            if (typeof onLoaded === "function") {
                onLoaded();
            }
            window.dispatchEvent(new CustomEvent("cakeCatalog:reloaded"));
        };

        scriptEl.onerror = function () {
            if (typeof onLoaded === "function") {
                onLoaded();
            }
        };

        document.head.appendChild(scriptEl);
    };
})();
