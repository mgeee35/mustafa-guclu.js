/**
 * @author Mustafa Guclu
 */

(function foo() {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const STORAGE_KEY = "recommended_products";
    const FAVORITES_KEY = "favorite_products";
    
    function init() {
        if (!$(".product-detail").length) {
            return;
        }
        fetchProducts().then(function(products) {
            buildCss();
            buildHtml(products);
        });
    }
    
    function buildHtml(products) {
        let container = $("<div class='carousel-container'></div>");
        container.append("<h2>You Might Also Like</h2>");
        
        let carousel = $("<div class='carousel'></div>");
        
        products.forEach(function(product) {
            let card = $(
                "<div class='product-card' data-id='" + product.id + "'>" +
                "<div class='favorite-icon'>&#x2665;</div>" +
                "<img src='" + product.img + "' alt='" + product.name + "' />" +
                "<p>" + product.name + "</p>" +
                "<span>" + product.price + " TRY</span>" +
                "</div>"
            );
            
            card.find(".favorite-icon").on("click", function (e) {
                e.stopPropagation();
                toggleFavorite(product.id);
            });
            
            card.on("click", function () {
                window.open(product.url, "_blank");
            });
            
            carousel.append(card);
        });
        
        container.append(carousel);
        $(".product-detail").after(container);
    }
    
    function buildCss() {
        let styles =
            ".carousel-container { padding: 20px; background: #f5f5f5; }" +
            ".carousel h2 { font-size: 20px; margin-bottom: 10px; }" +
            ".carousel { display: flex; overflow-x: auto; gap: 10px; }" +
            ".product-card { width: 150px; padding: 10px; background: white; border-radius: 8px; cursor: pointer; position: relative; }" +
            ".product-card img { width: 100%; border-radius: 5px; }" +
            ".favorite-icon { cursor: pointer; font-size: 20px; color: gray; position: absolute; top: 10px; right: 10px; }" +
            ".favorited { color: blue; }";
        $("<style>").html(styles).appendTo("head");
    }
    
    function fetchProducts() {
        let storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            return Promise.resolve(JSON.parse(storedData));
        }
        
        return fetch(API_URL)
            .then(function(response) { return response.json(); })
            .then(function(products) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
                return products;
            });
    }
    
    init();
})();
