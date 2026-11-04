// app.js
import { fetchProducts } from "./api.js";
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

let products = []; // Week 5: products come from API

function renderProducts() {
    productList.innerHTML = products.map(product => {
        return `
            <article class="product-card">
                <h3>${product.productName}</h3>
                <span>${product.category}</span>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-btn" data-id="${product.id}">
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
                <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </li>
        `;
    }).join("");

    const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-btn");
    const qtyButton = event.target.closest(".qty-btn");
    const removeButton = event.target.closest(".remove-btn");

    // ⭐ ADD TO CART
    if (addButton) {
        const id = Number(addButton.dataset.id);
        const product = products.find(p => p.id === id);

        try {
            addToCart(product);
            errorMessage.textContent = "";
        } catch (error) {
            errorMessage.textContent = error.message;
        } finally {
            updateCartDisplay();
        }
    }

    // ⭐ UPDATE QUANTITY
    if (qtyButton) {
        const id = Number(qtyButton.dataset.id);
        const delta = Number(qtyButton.dataset.delta);
        changeQuantity(id, delta);
        updateCartDisplay();
    }

    // ⭐ DELETE ITEM
    if (removeButton) {
        const id = Number(removeButton.dataset.id);
        removeFromCart(id);
        updateCartDisplay();
    }
});

// ⭐ FETCH PRODUCTS FROM API
async function boot() {
    try {
        products = await fetchProducts();
        renderProducts();
        errorMessage.textContent = "";
    } catch (error) {
        errorMessage.textContent = "Failed to load products.";
        productList.innerHTML = "";
    }

    loadCartFromStorage();
    updateCartDisplay();
}

boot();
