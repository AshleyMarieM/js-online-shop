// api.js
export async function fetchProducts() {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) {
        throw new Error("Failed to fetch products.");
    }

    const data = await response.json();

    // Map DummyJSON products into your shop format
    return data.products.map(p => ({
        id: p.id,
        productName: p.title,
        price: p.price,
        category: p.category,
        inStock: p.stock > 0
    }));
}
