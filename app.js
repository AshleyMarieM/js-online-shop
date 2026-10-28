import { products } from "./products.js";
import {
    addToCart,
    changeQuantity,
    removeFromCart,
    loadCartFromStorage,
    getCartEntries
} from "./cart.js";

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const productList = document.getElementById("product-list");
const errorMessage = document.getElementById("error-message");

function renderProducts() {
    productList.innerHTML = products.map(product => {
        return `
            <article class="product-card">
                <h3>${product.productName}</h3>
                <span>${product.category}</span>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-btn" data-name="${product.productName}">
                    Add to Cart
                </button>
            </article>
        `;
    }).join("");
}

function updateCartDisplay() {
    const entries = getCartEntries();

    cartCount.textContent = entries.reduce((s, it) => s + it.quantity, 0);

    if (entries.length === 0) {
        cartItems.innerHTML = "<li>Your cart is empty.</li>";
        cartTotal.textContent = "$0.00";
        return;
    }

    cartItems.innerHTML = entries.map(item => {
        const lineTotal = item.price * item.quantity;
        return `
            <li>
                ${item.productName} — ${item.quantity} — $${lineTotal.toFixed(2)}
            </li>
        `;
    }).join("");

    const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-btn");

    if (addButton) {
        const name = addButton.dataset.name;

        try {
            addToCart(name);
            errorMessage.textContent = "";
        } catch (error) {
            errorMessage.textContent = error.message;
        } finally {
            updateCartDisplay();
        }
    }
});

loadCartFromStorage();
renderProducts();
updateCartDisplay();
