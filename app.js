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

// cart will be an object keyed by product id for easy quantity management
let cart = {};
let currentFilter = "All";

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const productList = document.getElementById("product-list");
const TOAST_TIME = 2000;

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem('cozy-cart');
        if (raw) cart = JSON.parse(raw);
    } catch (e) {
        console.warn('Failed to load cart from localStorage', e);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('cozy-cart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Failed to save cart to localStorage', e);
    }
}

// Filter products by category
function getFilteredProducts() {
    if (currentFilter === "All") return products;
    return products.filter(product => product.category === currentFilter);
}

// WEEK 3: Render product cards dynamically
function renderProducts() {
    const filteredProducts = getFilteredProducts();

    productList.innerHTML = filteredProducts.map(product => {
        const icon = product.category === "Home Fragrance" ? "🕯️" : "🧶";

        return `
            <article class="product-card" data-id="${product.id}">
                <div class="product-icon">${icon}</div>
                <h3>${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <p>${product.description}</p>
                <div class="product-row">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </article>
        `;
    }).join("");
}

// Toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), TOAST_TIME);
}

// Add item to cart
function addToCart(productId, qty = 1) {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    const key = String(product.id);
    if (!cart[key]) cart[key] = { ...product, quantity: 0 };
    cart[key].quantity += qty;

    animateAddButton(productId);
    saveCartToStorage();
    updateCart();
    showToast(`${product.name} added to cart`);
}

// Button animation
function animateAddButton(productId) {
    const btn = document.querySelector(`.add-btn[data-id="${productId}"]`);
    if (!btn) return;
    btn.classList.add('popped');
    setTimeout(() => btn.classList.remove('popped'), 350);
}

// Remove item from cart
function removeFromCart(productId) {
    const key = String(productId);
    if (cart[key]) {
        const name = cart[key].name;
        delete cart[key];
        saveCartToStorage();
        updateCart();
        showToast(`${name} removed`);
    }
}

// Change quantity
function changeQuantity(productId, delta) {
    const key = String(productId);
    if (!cart[key]) return;
    cart[key].quantity += delta;
    if (cart[key].quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    saveCartToStorage();
    updateCart();
}

// Update cart display + badge
function updateCart() {
    const entries = Object.values(cart);
    const totalCount = entries.reduce((s, it) => s + it.quantity, 0);
    cartCount.textContent = totalCount;

    if (entries.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
        cartTotal.textContent = "$0.00";
        return;
    }

    cartItems.innerHTML = entries.map(item => {
        const lineTotal = item.price * item.quantity;
        return `
            <li class="cart-item" data-id="${item.id}">
                <div style="display:flex;flex-direction:column">
                  <strong>${item.name}</strong>
                  <small class="product-category">$${item.price.toFixed(2)} each</small>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                  <span aria-live="polite">${item.quantity}</span>
                  <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                  <button class="remove-btn" data-id="${item.id}" aria-label="Remove ${item.name}">Remove</button>
                  <span style="min-width:64px;text-align:right">$${lineTotal.toFixed(2)}</span>
                </div>
            </li>
        `;
    }).join('');

    const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Category filter
function filterByCategory(category) {
    currentFilter = category;

    document.querySelectorAll('.tab-btn').forEach(button => {
        const isActive = button.dataset.category === category;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    renderProducts();
}

// Delegated click handling
document.addEventListener('click', (event) => {
    const tabButton = event.target.closest('.tab-btn');
    if (tabButton) {
        filterByCategory(tabButton.dataset.category);
        return;
    }

    const addButton = event.target.closest('.add-btn');
    if (addButton) {
        addToCart(addButton.dataset.id, 1);
        return;
    }

    const qtyButton = event.target.closest('.qty-btn');
    if (qtyButton) {
        changeQuantity(qtyButton.dataset.id, Number(qtyButton.dataset.delta));
        return;
    }

    const removeButton = event.target.closest('.remove-btn');
    if (removeButton) {
        removeFromCart(removeButton.dataset.id);
        return;
    }
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement) {
        const btn = document.activeElement;
        if (btn.classList.contains('add-btn')) {
            addToCart(btn.dataset.id, 1);
        }
        if (btn.classList.contains('qty-btn')) {
            changeQuantity(btn.dataset.id, Number(btn.dataset.delta));
        }
        if (btn.classList.contains('remove-btn')) {
            removeFromCart(btn.dataset.id);
        }
    }
});

// Initial boot
loadCartFromStorage();
renderProducts();
updateCart();

console.log('Shop loaded with enhanced cart controls');
function validateLogin() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorBox = document.getElementById("login-error");
    const submitBtn = document.getElementById("login-btn");

    submitBtn.disabled = true;

    try {
        if (usernameInput.value.trim() === "") {
            throw new Error("Username cannot be empty.");
        }

        if (passwordInput.value.trim() === "") {
            throw new Error("Password cannot be empty.");
        }

        errorBox.textContent = "";
        errorBox.classList.remove("visible");

        console.log("Login successful!");

    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.add("visible");

    } finally {
        submitBtn.disabled = false;
    }
}
