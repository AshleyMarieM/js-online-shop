import { products } from "./products.js";

export let cart = {};

export function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem("cozy-cart");
        if (raw) cart = JSON.parse(raw);
    } catch (e) {
        console.warn("Failed to load cart", e);
    }
}

export function saveCartToStorage() {
    try {
        localStorage.setItem("cozy-cart", JSON.stringify(cart));
    } catch (e) {
        console.warn("Failed to save cart", e);
    }
}

export function addToCart(productName) {
    const product = products.find(p => p.productName === productName);

    if (!product) {
        throw new Error("Product not found.");
    }

    if (!product.inStock) {
        throw new Error(`${productName} is out of stock.`);
    }

    const key = String(product.id);

    if (!cart[key]) {
        cart[key] = { ...product, quantity: 0 };
    }

    cart[key].quantity += 1;
    saveCartToStorage();
}

export function removeFromCart(productId) {
    const key = String(productId);
    if (cart[key]) {
        delete cart[key];
        saveCartToStorage();
    }
}

export function changeQuantity(productId, delta) {
    const key = String(productId);
    if (!cart[key]) return;

    cart[key].quantity += delta;

    if (cart[key].quantity <= 0) {
        removeFromCart(productId);
    }

    saveCartToStorage();
}

export function getCartEntries() {
    return Object.values(cart);
}
