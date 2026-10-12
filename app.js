const products = [
    {
        id: 1,
        name: "Lavender Wax Melt",
        price: 4.99,
        category: "Home Fragrance",
        description: "A calming lavender scent that freshens the room and relaxes the mind."
    },
    {
        id: 2,
        name: "Vanilla Candle",
        price: 12.99,
        category: "Home Fragrance",
        description: "Warm vanilla notes create a cozy, comforting atmosphere at home."
    },
    {
        id: 3,
        name: "Crochet Plushie",
        price: 19.99,
        category: "Handmade",
        description: "A soft handmade plushie made with careful stitching and cozy texture."
    },
    {
        id: 4,
        name: "Crochet Keychain",
        price: 7.99,
        category: "Handmade",
        description: "A charming keychain that adds a personal handmade touch to everyday items."
    }
];

let cart = [];
let currentFilter = "All";

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const productList = document.getElementById("product-list");

function getFilteredProducts() {
    if (currentFilter === "All") {
        return products;
    }

    return products.filter(product => product.category === currentFilter);
}

function renderProducts() {
    const filteredProducts = getFilteredProducts();

    productList.innerHTML = filteredProducts.map(product => {
        const icon = product.category === "Home Fragrance" ? "🕯️" : "🧶";

        return `
            <article class="product-card">
                <div class="product-icon">${icon}</div>
                <h3>${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <p>${product.description}</p>
                <div class="product-row">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" data-name="${product.name}">Add to Cart</button>
                </div>
            </article>
        `;
    }).join("");
}

function addToCart(productName) {
    const selectedProduct = products.find(product => product.name === productName);

    if (!selectedProduct) {
        console.log(`Product not found: ${productName}`);
        return;
    }

    cart.push(selectedProduct);
    updateCart();
    console.log(`Added to cart: ${productName}`);
}

function viewCart() {
    console.log("Viewing cart:");
    cart.forEach(item => {
        console.log(`${item.name} - $${item.price.toFixed(2)}`);
    });

    return cart;
}

function filterByCategory(category) {
    currentFilter = category;

    document.querySelectorAll(".filter-btn").forEach(button => {
        const isActive = button.dataset.category === category;
        button.classList.toggle("active", isActive);
    });

    renderProducts();

    console.log(`Products in category: ${category}`);
    const filtered = getFilteredProducts();
    filtered.forEach(item => {
        console.log(`${item.name} - $${item.price.toFixed(2)}`);
    });
}

function updateCart() {
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
        cartTotal.textContent = "$0.00";
        return;
    }

    const groupedItems = cart.reduce((items, product) => {
        const itemKey = product.name;

        if (!items[itemKey]) {
            items[itemKey] = {
                name: product.name,
                price: product.price,
                quantity: 0
            };
        }

        items[itemKey].quantity += 1;
        return items;
    }, {});

    const cartEntries = Object.values(groupedItems);

    cartItems.innerHTML = cartEntries.map(item => {
        const lineTotal = item.price * item.quantity;
        return `
            <li class="cart-item">
                <span>${item.name} x${item.quantity}</span>
                <span>$${lineTotal.toFixed(2)}</span>
            </li>
        `;
    }).join("");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("click", (event) => {
    const filterButton = event.target.closest(".filter-btn");
    if (filterButton) {
        filterByCategory(filterButton.dataset.category);
        return;
    }

    const addButton = event.target.closest(".add-btn");
    if (addButton) {
        addToCart(addButton.dataset.name);
    }
});

renderProducts();
updateCart();

console.log("Shop loaded");
addToCart("Lavender Wax Melt");
addToCart("Crochet Plushie");
viewCart();
filterByCategory("Home Fragrance");
