const products = [
    {
        id: 1,
        name: "Hazelnut Latte Candle",
        price: 14.99,
        category: "Home Fragrance",
        description: "A warm coffeehouse scent with toasted hazelnut and creamy vanilla notes."
    },
    {
        id: 2,
        name: "Cinnamon Roll Wax Melt",
        price: 6.99,
        category: "Home Fragrance",
        description: "Sweet cinnamon and buttery bakery aromas that make every room feel cozy."
    },
    {
        id: 3,
        name: "Crochet Mug Cozy",
        price: 11.99,
        category: "Handmade",
        description: "A handmade cozy that keeps your favorite drink warm and stylish."
    },
    {
        id: 4,
        name: "Coffee Bean Keychain",
        price: 8.99,
        category: "Handmade",
        description: "A tiny handcrafted keepsake with a playful coffee-inspired look."
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

    document.querySelectorAll(".tab-btn").forEach(button => {
        const isActive = button.dataset.category === category;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
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
    const tabButton = event.target.closest(".tab-btn");
    if (tabButton) {
        filterByCategory(tabButton.dataset.category);
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
addToCart("Hazelnut Latte Candle");
addToCart("Crochet Mug Cozy");
viewCart();
filterByCategory("Home Fragrance");
