// GLOBAL SCOPE
const products = [
    { name: "Lavender Wax Melt", price: 4.99, category: "Home Fragrance" },
    { name: "Vanilla Candle", price: 12.99, category: "Home Fragrance" },
    { name: "Crochet Plushie", price: 19.99, category: "Handmade" },
    { name: "Crochet Keychain", price: 7.99, category: "Handmade" }
];

let cart = []; // Global cart array

// FUNCTION SCOPE
function addToCart(productName) {
    // Block scope example
    for (let i = 0; i < products.length; i++) {
        if (products[i].name === productName) {
            cart.push(products[i]);
            console.log(`Added to cart: ${productName}`);
            return;
        }
    }
    console.log(`Product not found: ${productName}`);
}

function viewCart() {
    console.log("Viewing cart:");
    cart.forEach(item => {
        console.log(`${item.name} - $${item.price}`);
    });
}

function filterByCategory(category) {
    const filtered = products.filter(product => product.category === category);
    console.log(`Products in category: ${category}`);
    filtered.forEach(item => {
        console.log(`${item.name} - $${item.price}`);
    });
}

// CALLING FUNCTIONS
addToCart("Lavender Wax Melt");
addToCart("Crochet Plushie");
viewCart();
filterByCategory("Home Fragrance");
