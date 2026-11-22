(function () {
    // Единый справочник цен и базовых данных тортов.
    // Меняйте значения price здесь — они сразу применятся на странице торта и в корзине.
    window.KARAS_CAKE_CATALOG = {
        "berry-cake": {
            name: "Berry Cake",
            price: 7,
            image: "images/BerryCake.jpg"
        },
        "chocolate-cake": {
            name: "Chocolate Cake",
            price: 12,
            image: "images/ChocolateCake.jpg"
        },
        "zebra": {
            name: "Zebra",
            price: 14,
            image: "images/Zebra_1.jpg"
        },
        "sochi-walnut-pastry": {
            name: "Sochi Walnut Pastry",
            price: 7,
            image: "images/Sochinskiy.jpg"
        },
        "gata": {
            name: "Gata",
            price: 2,
            image: "images/Gata.jpg"
        },
        "cigarettes": {
            name: "Cigarettes",
            price: 3,
            image: "images/Cigarettes.jpg"
        },
        "birds-milk-pastry": {
            name: "Bird's Milk Pastry",
            price: 6,
            image: "images/BirdsMilk.jpg"
        },
        "bon-bon": {
            name: "Bon-Bon",
            price: 14,
            image: "images/BonBon.png"
        },
        "berry-basket": {
            name: "Berry Basket",
            price: 22,
            image: "images/BerryBasket.jpg"
        }
    };

    window.getCakeCatalogEntry = function (cakeId) {
        const catalog = window.KARAS_CAKE_CATALOG || {};
        return catalog[cakeId] || null;
    };

    window.getCakePrice = function (cakeId, fallbackPrice = 0) {
        const entry = window.getCakeCatalogEntry(cakeId);
        if (entry && typeof entry.price === "number" && !Number.isNaN(entry.price)) {
            return Math.max(0, entry.price);
        }
        const parsedFallback = Number(fallbackPrice);
        return Number.isNaN(parsedFallback) ? 0 : Math.max(0, parsedFallback);
    };
})();
