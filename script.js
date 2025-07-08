// Global Variables
let products = [];
let cart = [];
let selectedLocation = '';
let isDeliveryMode = false;
let deliveryFee = 1500;
let freeDeliveryThreshold = 25000;

// Sample product data with location-specific inventory
const sampleProducts = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        category: "groceries",
        price: 800,
        unit: "kg",
        description: "Fresh, ripe tomatoes perfect for cooking",
        stock: {
            "ikeja": 50,
            "victoria-island": 30,
            "surulere": 45,
            "lekki": 25,
            "ajah": 35,
            "yaba": 40
        }
    },
    {
        id: 2,
        name: "Whole Milk",
        category: "dairy",
        price: 1200,
        unit: "liter",
        description: "Fresh whole milk, rich in calcium",
        stock: {
            "ikeja": 20,
            "victoria-island": 15,
            "surulere": 25,
            "lekki": 18,
            "ajah": 22,
            "yaba": 30
        }
    },
    {
        id: 3,
        name: "Chicken Breast",
        category: "meat",
        price: 3500,
        unit: "kg",
        description: "Fresh, boneless chicken breast",
        stock: {
            "ikeja": 15,
            "victoria-island": 10,
            "surulere": 20,
            "lekki": 8,
            "ajah": 12,
            "yaba": 18
        }
    },
    {
        id: 4,
        name: "Dishwashing Liquid",
        category: "household",
        price: 650,
        unit: "bottle",
        description: "Effective dishwashing liquid for clean dishes",
        stock: {
            "ikeja": 40,
            "victoria-island": 35,
            "surulere": 30,
            "lekki": 25,
            "ajah": 45,
            "yaba": 38
        }
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 15000,
        unit: "piece",
        description: "Portable Bluetooth speaker with great sound quality",
        stock: {
            "ikeja": 5,
            "victoria-island": 3,
            "surulere": 7,
            "lekki": 4,
            "ajah": 6,
            "yaba": 8
        }
    },
    {
        id: 6,
        name: "Portable Gas Grill",
        category: "grills",
        price: 45000,
        unit: "piece",
        description: "Compact portable gas grill perfect for outdoor cooking",
        stock: {
            "ikeja": 2,
            "victoria-island": 1,
            "surulere": 3,
            "lekki": 2,
            "ajah": 1,
            "yaba": 4
        }
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    products = [...sampleProducts];
    initializeEventListeners();
    updateCartDisplay();
    displayProducts();
});

// Event Listeners
function initializeEventListeners() {
    // Location selector
    const locationSelect = document.getElementById('locationSelect');
    locationSelect.addEventListener('change', handleLocationChange);
    
    // Delivery toggle
    const deliveryToggle = document.getElementById('deliveryToggle');
    deliveryToggle.addEventListener('change', handleDeliveryToggle);
    
    // Search and filters
    document.getElementById('searchFilter').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('availabilityFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
}

// Location handling
function handleLocationChange(event) {
    selectedLocation = event.target.value;
    const locationStatus = document.getElementById('locationStatus');
    
    if (selectedLocation) {
        const locationName = event.target.options[event.target.selectedIndex].text;
        locationStatus.textContent = `Showing products available at ${locationName}`;
        locationStatus.style.color = '#27ae60';
    } else {
        locationStatus.textContent = 'Please select a location to view products';
        locationStatus.style.color = '#666';
    }
    
    displayProducts();
    updateDeliveryInfo();
}

// Delivery mode handling
function handleDeliveryToggle(event) {
    isDeliveryMode = event.target.checked;
    updateDeliveryInfo();
    updateCartSummary();
}

function updateDeliveryInfo() {
    const deliveryInfo = document.getElementById('deliveryInfo');
    const deliveryOption = deliveryInfo.querySelector('.delivery-option');
    
    if (isDeliveryMode && selectedLocation) {
        deliveryOption.innerHTML = `
            <i class="fas fa-truck"></i>
            <span>Delivery - ₦${deliveryFee.toLocaleString()}</span>
        `;
    } else {
        deliveryOption.innerHTML = `
            <i class="fas fa-store"></i>
            <span>Pickup - FREE</span>
        `;
    }
}

// Product display functions
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    const filteredProducts = getFilteredProducts();
    
    if (!selectedLocation) {
        productGrid.innerHTML = `
            <div class="no-location-message">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Select a Location</h3>
                <p>Please choose a store location to view available products and their stock levels.</p>
            </div>
        `;
        return;
    }
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products-message">
                <i class="fas fa-search"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const stock = product.stock[selectedLocation] || 0;
    const stockStatus = getStockStatus(stock);
    const isInCart = cart.find(item => item.id === product.id);
    const cartQuantity = isInCart ? isInCart.quantity : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <i class="fas ${getProductIcon(product.category)}"></i>
                <div class="stock-badge ${stockStatus.class}">${stockStatus.text}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-price">₦${product.price.toLocaleString()}/${product.unit}</div>
                <div class="product-stock">Stock: ${stock} ${product.unit}${stock !== 1 ? 's' : ''}</div>
                
                ${stock > 0 ? `
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)" ${cartQuantity <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${cartQuantity}" min="0" max="${stock}" 
                               onchange="setQuantity(${product.id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)" ${cartQuantity >= stock ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                ` : `
                    <button class="add-to-cart-btn" disabled>
                        <i class="fas fa-times"></i>
                        Out of Stock
                    </button>
                `}
            </div>
        </div>
    `;
}

function getProductIcon(category) {
    const icons = {
        groceries: 'fa-apple-alt',
        dairy: 'fa-glass-whiskey',
        meat: 'fa-drumstick-bite',
        household: 'fa-home',
        electronics: 'fa-mobile-alt',
        grills: 'fa-fire'
    };
    return icons[category] || 'fa-box';
}

function getStockStatus(stock) {
    if (stock === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (stock <= 10) {
        return { class: 'low-stock', text: 'Low Stock' };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

// Filtering and sorting
function getFilteredProducts() {
    let filtered = [...products];
    
    // Filter by search term
    const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by category
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter) {
        filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Filter by availability
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    if (availabilityFilter && selectedLocation) {
        filtered = filtered.filter(product => {
            const stock = product.stock[selectedLocation] || 0;
            switch (availabilityFilter) {
                case 'in-stock':
                    return stock > 10;
                case 'low-stock':
                    return stock > 0 && stock <= 10;
                case 'out-of-stock':
                    return stock === 0;
                default:
                    return true;
            }
        });
    }
    
    // Sort products
    const sortFilter = document.getElementById('sortFilter').value;
    filtered.sort((a, b) => {
        switch (sortFilter) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'stock':
                const stockA = selectedLocation ? (a.stock[selectedLocation] || 0) : 0;
                const stockB = selectedLocation ? (b.stock[selectedLocation] || 0) : 0;
                return stockB - stockA;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
    
    return filtered;
}

function applyFilters() {
    displayProducts();
}

// Cart functionality
function addToCart(productId) {
    if (!selectedLocation) {
        showNotification('Please select a location first', 'error');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const availableStock = product.stock[selectedLocation] || 0;
    if (availableStock <= 0) {
        showNotification('Product is out of stock', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity < availableStock) {
            existingItem.quantity += 1;
            showNotification(`Added ${product.name} to cart`, 'success');
        } else {
            showNotification('Cannot add more items than available stock', 'warning');
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity: 1,
            location: selectedLocation
        });
        showNotification(`Added ${product.name} to cart`, 'success');
    }
    
    updateCartDisplay();
    displayProducts(); // Refresh to update quantity controls
}

function updateQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    const availableStock = product.stock[selectedLocation] || 0;
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + change;
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= availableStock) {
            existingItem.quantity = newQuantity;
            updateCartDisplay();
            displayProducts();
        } else {
            showNotification('Cannot exceed available stock', 'warning');
        }
    } else if (change > 0) {
        addToCart(productId);
    }
}

function setQuantity(productId, quantity) {
    const product = products.find(p => p.id === productId);
    const availableStock = product.stock[selectedLocation] || 0;
    const newQuantity = parseInt(quantity) || 0;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else if (newQuantity <= availableStock) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                unit: product.unit,
                quantity: newQuantity,
                location: selectedLocation
            });
        }
        updateCartDisplay();
        displayProducts();
    } else {
        showNotification('Cannot exceed available stock', 'warning');
        displayProducts(); // Reset the input value
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        showNotification(`Removed ${item.name} from cart`, 'success');
        updateCartDisplay();
        displayProducts();
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <small>Add items to get started</small>
            </div>
        `;
        cartSummary.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${getProductIcon(products.find(p => p.id === item.id)?.category)}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₦${item.price.toLocaleString()}/${item.unit}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="setQuantity(${item.id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        cartSummary.style.display = 'block';
        updateCartSummary();
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDeliveryFee = isDeliveryMode && subtotal < freeDeliveryThreshold ? deliveryFee : 0;
    const total = subtotal + currentDeliveryFee;
    
    document.getElementById('subtotal').textContent = `₦${subtotal.toLocaleString()}`;
    document.getElementById('deliveryFee').textContent = `₦${currentDeliveryFee.toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `₦${total.toLocaleString()}`;
    
    // Update delivery fee display
    const deliveryFeeRow = document.querySelector('.summary-row:nth-child(2) span:last-child');
    if (isDeliveryMode && subtotal >= freeDeliveryThreshold) {
        deliveryFeeRow.innerHTML = '<span style="text-decoration: line-through;">₦' + deliveryFee.toLocaleString() + '</span> FREE';
    }
}

// Cart sidebar toggle
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
}

// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});

function handleCheckout() {
    if (!selectedLocation) {
        showNotification('Please select a location first', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const locationSelect = document.getElementById('locationSelect');
    const selectedOption = locationSelect.options[locationSelect.selectedIndex];
    const whatsappNumber = selectedOption.dataset.phone || '2348123456000';
    const locationName = selectedOption.text;
    
    const orderDetails = cart.map(item => 
        `• ${item.name} - ${item.quantity} ${item.unit}${item.quantity !== 1 ? 's' : ''} @ ₦${item.price.toLocaleString()} each`
    ).join('\n');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDeliveryFee = isDeliveryMode && subtotal < freeDeliveryThreshold ? deliveryFee : 0;
    const total = subtotal + currentDeliveryFee;
    
    const deliveryType = isDeliveryMode ? `Delivery (₦${currentDeliveryFee.toLocaleString()})` : 'Pickup (FREE)';
    
    const message = `Hello! I'd like to place an order:

${orderDetails}

Subtotal: ₦${subtotal.toLocaleString()}
${deliveryType}
Total: ₦${total.toLocaleString()}

Location: ${locationName}
Order Date: ${new Date().toLocaleDateString()}

Please confirm availability and processing time. Thank you!`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after successful order
    cart = [];
    updateCartDisplay();
    displayProducts();
    toggleCart();
    showNotification('Order sent via WhatsApp!', 'success');
}

// Notification system
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Utility functions
function formatCurrency(amount) {
    return `₦${amount.toLocaleString()}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounced search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
});

// Local storage for cart persistence
function saveCartToStorage() {
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
    localStorage.setItem('freshmart_location', selectedLocation);
    localStorage.setItem('freshmart_delivery', isDeliveryMode);
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('freshmart_cart');
    const savedLocation = localStorage.getItem('freshmart_location');
    const savedDelivery = localStorage.getItem('freshmart_delivery');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedLocation) {
        selectedLocation = savedLocation;
        document.getElementById('locationSelect').value = savedLocation;
        handleLocationChange({ target: { value: savedLocation, options: document.getElementById('locationSelect').options } });
    }
    
    if (savedDelivery) {
        isDeliveryMode = savedDelivery === 'true';
        document.getElementById('deliveryToggle').checked = isDeliveryMode;
        updateDeliveryInfo();
    }
}

// Update storage whenever cart changes
const originalUpdateCartDisplay = updateCartDisplay;
updateCartDisplay = function() {
    originalUpdateCartDisplay();
    saveCartToStorage();
};

// Load saved data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
});

// Add CSS for no-location and no-products messages
const additionalStyles = `
<style>
.no-location-message,
.no-products-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.no-location-message i,
.no-products-message i {
    font-size: 4rem;
    color: #bdc3c7;
    margin-bottom: 1rem;
}

.no-location-message h3,
.no-products-message h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.no-location-message p,
.no-products-message p {
    color: #666;
    font-size: 1.1rem;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Store location data
const locationData = {
    'ikeja': {
        name: 'Ikeja Branch',
        address: '123 Ikeja Way, Lagos State',
        phone: '+2348123456001'
    },
    'victoria-island': {
        name: 'Victoria Island Branch',
        address: '456 Victoria Island, Lagos State',
        phone: '+2348123456002'
    },
    'surulere': {
        name: 'Surulere Branch',
        address: '789 Surulere Road, Lagos State',
        phone: '+2348123456003'
    },
    'lekki': {
        name: 'Lekki Branch',
        address: '321 Lekki Phase 1, Lagos State',
        phone: '+2348123456004'
    },
    'ajah': {
        name: 'Ajah Branch',
        address: '654 Ajah Express, Lagos State',
        phone: '+2348123456005'
    },
    'yaba': {
        name: 'Yaba Branch',
        address: '987 Yaba College Road, Lagos State',
        phone: '+2348123456006'
    }
};

// Show checkout form
function showCheckoutForm() {
    if (!selectedLocation) {
        showNotification('Please select a location first', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('active');
    
    // Update delivery/pickup sections
    updateCheckoutSections();
    
    // Populate order summary
    updateCheckoutOrderSummary();
    
    // Setup form submission
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.onsubmit = handleCheckoutSubmission;
}

function closeCheckoutForm() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('active');
    
    // Reset form
    document.getElementById('checkoutForm').reset();
}

function updateCheckoutSections() {
    const deliverySection = document.getElementById('deliverySection');
    const pickupSection = document.getElementById('pickupSection');
    const deliveryAddress = document.getElementById('deliveryAddress');
    
    if (isDeliveryMode) {
        deliverySection.style.display = 'block';
        pickupSection.style.display = 'none';
        deliveryAddress.required = true;
    } else {
        deliverySection.style.display = 'none';
        pickupSection.style.display = 'block';
        deliveryAddress.required = false;
        
        // Update pickup location info
        const locationInfo = locationData[selectedLocation];
        document.getElementById('pickupLocationName').textContent = locationInfo.name;
        document.getElementById('pickupLocationAddress').textContent = locationInfo.address;
    }
}

function updateCheckoutOrderSummary() {
    const summaryContainer = document.getElementById('checkoutOrderSummary');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDeliveryFee = isDeliveryMode && subtotal < freeDeliveryThreshold ? deliveryFee : 0;
    const total = subtotal + currentDeliveryFee;
    
    summaryContainer.innerHTML = `
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>₦${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₦${subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
                <span>${isDeliveryMode ? 'Delivery Fee:' : 'Pickup:'}</span>
                <span>${isDeliveryMode ? '₦' + currentDeliveryFee.toLocaleString() : 'FREE'}</span>
            </div>
            <div class="total-row final-total">
                <span><strong>Total:</strong></span>
                <span><strong>₦${total.toLocaleString()}</strong></span>
            </div>
        </div>
    `;
}

function handleCheckoutSubmission(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    
    let orderMessage = `Hello! I'd like to place an order:\n\n`;
    orderMessage += `*Customer Information:*\n`;
    orderMessage += `Name: ${customerName}\n`;
    orderMessage += `Phone: ${customerPhone}\n`;
    if (customerEmail) orderMessage += `Email: ${customerEmail}\n`;
    
    if (isDeliveryMode) {
        const deliveryAddress = document.getElementById('deliveryAddress').value;
        const deliveryInstructions = document.getElementById('deliveryInstructions').value;
        
        orderMessage += `\n*Delivery Details:*\n`;
        orderMessage += `Address: ${deliveryAddress}\n`;
        if (deliveryInstructions) orderMessage += `Instructions: ${deliveryInstructions}\n`;
    } else {
        const pickupTime = document.getElementById('pickupTime').value;
        const locationInfo = locationData[selectedLocation];
        
        orderMessage += `\n*Pickup Details:*\n`;
        orderMessage += `Location: ${locationInfo.name}\n`;
        orderMessage += `Address: ${locationInfo.address}\n`;
        if (pickupTime) orderMessage += `Preferred Time: ${pickupTime}\n`;
    }
    
    // Add order items
    orderMessage += `\n*Order Items:*\n`;
    cart.forEach(item => {
        orderMessage += `• ${item.name} - ${item.quantity} ${item.unit}${item.quantity !== 1 ? 's' : ''} @ ₦${item.price.toLocaleString()} each\n`;
    });
    
    // Add totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDeliveryFee = isDeliveryMode && subtotal < freeDeliveryThreshold ? deliveryFee : 0;
    const total = subtotal + currentDeliveryFee;
    
    orderMessage += `\n*Order Summary:*\n`;
    orderMessage += `Subtotal: ₦${subtotal.toLocaleString()}\n`;
    orderMessage += `${isDeliveryMode ? 'Delivery Fee' : 'Pickup'}: ${isDeliveryMode ? '₦' + currentDeliveryFee.toLocaleString() : 'FREE'}\n`;
    orderMessage += `*Total: ₦${total.toLocaleString()}*\n\n`;
    orderMessage += `Order Date: ${new Date().toLocaleDateString()}\n`;
    orderMessage += `Please confirm availability and processing time. Thank you!`;
    
    // Get WhatsApp number for selected location
    const locationInfo = locationData[selectedLocation];
    const whatsappNumber = locationInfo.phone.replace('+', '');
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and close modals
    cart = [];
    updateCartDisplay();
    displayProducts();
    closeCheckoutForm();
    toggleCart();
    showNotification('Order sent via WhatsApp!', 'success');
}

// Update delivery toggle to refresh checkout form
const originalHandleDeliveryToggle = handleDeliveryToggle;
handleDeliveryToggle = function(event) {
    originalHandleDeliveryToggle(event);
    
    // Update checkout form if it's open
    if (document.getElementById('checkoutModal').classList.contains('active')) {
        updateCheckoutSections();
        updateCheckoutOrderSummary();
    }
};

// Data synchronization functions
function syncDataWithAdmin() {
    // Check for admin data updates every 5 seconds
    setInterval(() => {
        const adminData = localStorage.getItem('freshmart_admin_data');
        if (adminData) {
            try {
                const data = JSON.parse(adminData);
                if (data.products && data.lastSaved) {
                    const lastSync = localStorage.getItem('freshmart_last_sync');
                    if (!lastSync || new Date(data.lastSaved) > new Date(lastSync)) {
                        // Update products with admin changes
                        products = [...data.products];
                        displayProducts();
                        localStorage.setItem('freshmart_last_sync', data.lastSaved);
                        showNotification('Product data updated', 'info');
                    }
                }
            } catch (error) {
                console.error('Error syncing data:', error);
            }
        }
    }, 5000);
}

// Initialize data sync on page load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    syncDataWithAdmin();
});

// Function to manually refresh data
function refreshProductData() {
    const adminData = localStorage.getItem('freshmart_admin_data');
    if (adminData) {
        try {
            const data = JSON.parse(adminData);
            if (data.products) {
                products = [...data.products];
                displayProducts();
                showNotification('Product data refreshed', 'success');
            }
        } catch (error) {
            showNotification('Error refreshing data', 'error');
        }
    }
}
