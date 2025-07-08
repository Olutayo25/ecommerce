// Admin Panel JavaScript
let adminProducts = [];
let adminOrders = [];
let adminLocations = [];
let currentUser = null;

// Sample admin data
const sampleAdminData = {
    products: [
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
        }
    ],
    orders: [
        {
            id: 'ORD001',
            customer: 'John Doe',
            phone: '+2348123456789',
            location: 'ikeja',
            items: [
                { name: 'Fresh Tomatoes', quantity: 2, price: 800 },
                { name: 'Whole Milk', quantity: 1, price: 1200 }
            ],
            total: 2800,
            status: 'pending',
            date: new Date().toISOString(),
            deliveryType: 'pickup'
        },
        {
            id: 'ORD002',
            customer: 'Jane Smith',
            phone: '+2348123456790',
            location: 'lekki',
            items: [
                { name: 'Chicken Breast', quantity: 1, price: 3500 }
            ],
            total: 5000,
            status: 'confirmed',
            date: new Date(Date.now() - 86400000).toISOString(),
            deliveryType: 'delivery'
        }
    ],
    locations: [
        {
            id: 'ikeja',
            name: 'Ikeja Branch',
            address: '123 Ikeja Way, Lagos',
            phone: '+2348123456001',
            manager: 'Adebayo Johnson',
            status: 'active',
            totalProducts: 150,
            totalOrders: 45
        },
        {
            id: 'victoria-island',
            name: 'Victoria Island Branch',
            address: '456 Victoria Island, Lagos',
            phone: '+2348123456002',
            manager: 'Funmi Adebayo',
            status: 'active',
            totalProducts: 120,
            totalOrders: 38
        }
    ]
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminData();
    setupEventListeners();
});

function initializeAdminData() {
    adminProducts = [...sampleAdminData.products];
    adminOrders = [...sampleAdminData.orders];
    adminLocations = [...sampleAdminData.locations];
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    // Filter events
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', filterInventory);
    }
    
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    const orderDateFilter = document.getElementById('orderDateFilter');
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', filterOrders);
    }
}

// Authentication
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
        currentUser = { username: 'admin', role: 'administrator' };
        showAdminDashboard();
        loadDashboardData();
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

function showAdminDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
}

function logout() {
    currentUser = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    
    // Reset forms
    document.getElementById('loginForm').reset();
}

// Dashboard functions
function loadDashboardData() {
    updateDashboardStats();
    loadInventoryTable();
    loadOrdersTable();
    loadLocationsGrid();
    loadTopProducts();
}

function updateDashboardStats() {
    const totalOrders = adminOrders.length;
    const totalRevenue = adminOrders.reduce((sum, order) => sum + order.total, 0);
    const lowStockItems = adminProducts.filter(product => {
        return Object.values(product.stock).some(stock => stock <= 10);
    }).length;
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `₦${totalRevenue.toLocaleString()}`;
    document.getElementById('lowStockItems').textContent = lowStockItems;
}

function loadTopProducts() {
    const productSales = {};
    
    adminOrders.forEach(order => {
        order.items.forEach(item => {
            if (productSales[item.name]) {
                productSales[item.name] += item.quantity;
            } else {
                productSales[item.name] = item.quantity;
            }
        });
    });
    
    const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const topProductsContainer = document.getElementById('topProducts');
    topProductsContainer.innerHTML = sortedProducts.map(([name, sales], index) => `
        <div class="top-product-item">
            <div class="product-rank">${index + 1}</div>
            <div class="product-details">
                <h4>${name}</h4>
                <p>${sales} units sold</p>
            </div>
            <div class="product-sales">₦${(sales * 1000).toLocaleString()}</div>
        </div>
    `).join('');
}

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'inventory':
            loadInventoryTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'locations':
            loadLocationsGrid();
            break;
    }
}

// Inventory management
function loadInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    const locationFilter = document.getElementById('locationFilter').value;
    
    let filteredProducts = [...adminProducts];
    
    tableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas ${getProductIcon(product.category)}" style="font-size: 1.5rem; color: #3498db;"></i>
                    <div>
                        <strong>${product.name}</strong>
                        <br>
                        <small style="color: #666;">${product.description}</small>
                    </div>
                </div>
            </td>
            <td style="text-transform: capitalize;">${product.category}</td>
            <td>₦${product.price.toLocaleString()}/${product.unit}</td>
            <td>
                <div class="stock-levels">
                    ${Object.entries(product.stock).map(([location, stock]) => 
                        !locationFilter || locationFilter === location ? 
                        `<div class="stock-item">${location}: ${stock}</div>` : ''
                    ).join('')}
                </div>
            </td>
            <td>
                <span class="status-badge ${getOverallStockStatus(product.stock)}">
                    ${getOverallStockStatus(product.stock).replace('-', ' ')}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getOverallStockStatus(stockObj) {
    const totalStock = Object.values(stockObj).reduce((sum, stock) => sum + stock, 0);
    const lowStockCount = Object.values(stockObj).filter(stock => stock <= 10 && stock > 0).length;
    const outOfStockCount = Object.values(stockObj).filter(stock => stock === 0).length;
    
    if (totalStock === 0) return 'out-of-stock';
    if (outOfStockCount > 0 || lowStockCount > Object.keys(stockObj).length / 2) return 'low-stock';
    return 'in-stock';
}

function filterInventory() {
    loadInventoryTable();
}

function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Populate edit form (you can create a separate edit modal)
    showAddProductModal();
    
    // Fill form with existing data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productDescription').value = product.description;
    
    // Fill stock levels
    Object.entries(product.stock).forEach(([location, stock]) => {
        const stockInput = document.getElementById(`stock-${location}`);
        if (stockInput) stockInput.value = stock;
    });
    
    // Change form submission to update instead of add
    const form = document.getElementById('addProductForm');
    form.onsubmit = (e) => handleUpdateProduct(e, productId);
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        loadInventoryTable();
        showNotification('Product deleted successfully', 'success');
    }
}

// Orders management
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const dateFilter = document.getElementById('orderDateFilter').value;
    
    let filteredOrders = [...adminOrders];
    
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    if (dateFilter) {
        filteredOrders = filteredOrders.filter(order => 
            new Date(order.date).toDateString() === new Date(dateFilter).toDateString()
        );
    }
    
    tableBody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>
                <div>${order.customer}</div>
                <small style="color: #666;">${order.phone}</small>
            </td>
            <td style="text-transform: capitalize;">${order.location.replace('-', ' ')}</td>
            <td>
                <div style="max-width: 200px;">
                    ${order.items.map(item => 
                        `<div style="font-size: 0.9rem;">${item.quantity}x ${item.name}</div>`
                    ).join('')}
                </div>
            </td>
            <td><strong>₦${order.total.toLocaleString()}</strong></td>
            <td>
                <span class="status-badge ${order.status}">${order.status}</span>
            </td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 0.25rem; border-radius: 4px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const order = adminOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        loadOrdersTable();
        showNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
    }
}

function filterOrders() {
    loadOrdersTable();
}

// Locations management
function loadLocationsGrid() {
    const locationsGrid = document.getElementById('locationsGrid');
    
    locationsGrid.innerHTML = adminLocations.map(location => `
        <div class="location-card">
            <div class="location-header">
                <h3 class="location-name">${location.name}</h3>
                <span class="location-status">${location.status}</span>
            </div>
            <div class="location-info">
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-phone"></i> ${location.phone}</p>
                <p><i class="fas fa-user"></i> Manager: ${location.manager}</p>
            </div>
            <div class="location-stats">
                <div class="location-stat">
                    <h4>${location.totalProducts}</h4>
                    <p>Products</p>
                </div>
                <div class="location-stat">
                    <h4>${location.totalOrders}</h4>
                    <p>Orders</p>
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn edit" onclick="editLocation('${location.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete" onclick="deleteLocation('${location.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function editLocation(locationId) {
    const location = adminLocations.find(l => l.id === locationId);
    if (!location) return;
    
    // Create and show edit location modal
    showNotification('Edit location functionality would be implemented here', 'info');
}

function deleteLocation(locationId) {
    if (confirm('Are you sure you want to delete this location?')) {
        adminLocations = adminLocations.filter(l => l.id !== locationId);
        loadLocationsGrid();
        showNotification('Location deleted successfully', 'success');
    }
}

// Product management
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Reset form submission handler
    const form = document.getElementById('addProductForm');
    form.onsubmit = handleAddProduct;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function handleAddProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newProduct = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value,
        stock: {
            'ikeja': parseInt(document.getElementById('stock-ikeja').value) || 0,
            'victoria-island': parseInt(document.getElementById('stock-victoria-island').value) || 0,
            'surulere': parseInt(document.getElementById('stock-surulere').value) || 0,
            'lekki': parseInt(document.getElementById('stock-lekki').value) || 0,
            'ajah': parseInt(document.getElementById('stock-ajah').value) || 0,
            'yaba': parseInt(document.getElementById('stock-yaba').value) || 0
        }
    };
    
    adminProducts.push(newProduct);
    loadInventoryTable();
    closeModal('addProductModal');
    showNotification('Product added successfully', 'success');
}

function handleUpdateProduct(event, productId) {
    event.preventDefault();
    
    const productIndex = adminProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    adminProducts[productIndex] = {
        ...adminProducts[productIndex],
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value,
        stock: {
            'ikeja': parseInt(document.getElementById('stock-ikeja').value) || 0,
            'victoria-island': parseInt(document.getElementById('stock-victoria-island').value) || 0,
            'surulere': parseInt(document.getElementById('stock-surulere').value) || 0,
            'lekki': parseInt(document.getElementById('stock-lekki').value) || 0,
            'ajah': parseInt(document.getElementById('stock-ajah').value) || 0,
            'yaba': parseInt(document.getElementById('stock-yaba').value) || 0
        }
    };
    
    loadInventoryTable();
    closeModal('addProductModal');
    showNotification('Product updated successfully', 'success');
}

// Settings management
function saveSettings() {
    const settings = {
        baseDeliveryFee: document.getElementById('baseDeliveryFee').value,
        freeDeliveryThreshold: document.getElementById('freeDeliveryThreshold').value,
        deliveryRadius: document.getElementById('deliveryRadius').value,
        lowStockThreshold: document.getElementById('lowStockThreshold').value,
        emailNotifications: document.getElementById('emailNotifications').checked,
        defaultWhatsApp: document.getElementById('defaultWhatsApp').value,
        orderTemplate: document.getElementById('orderTemplate').value
    };
    
    // Save to localStorage (in production, save to backend)
    localStorage.setItem('freshmart_admin_settings', JSON.stringify(settings));
    showNotification('Settings saved successfully', 'success');
}

function loadSettings() {
    const savedSettings = localStorage.getItem('freshmart_admin_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.getElementById('baseDeliveryFee').value = settings.baseDeliveryFee || 1500;
        document.getElementById('freeDeliveryThreshold').value = settings.freeDeliveryThreshold || 25000;
        document.getElementById('deliveryRadius').value = settings.deliveryRadius || 15;
        document.getElementById('lowStockThreshold').value = settings.lowStockThreshold || 10;
        document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
        document.getElementById('defaultWhatsApp').value = settings.defaultWhatsApp || '+2348123456000';
        document.getElementById('orderTemplate').value = settings.orderTemplate || 'Hello! I\'d like to place an order:\n\n{orderDetails}\n\nTotal: {total}\nDelivery: {deliveryType}\nLocation: {location}';
    }
}

// Utility functions
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

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Position notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = `
<style>
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Load settings on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadSettings, 100); // Small delay to ensure elements are loaded
});

// Export data functionality
function exportData(type) {
    let data, filename;
    
    switch(type) {
        case 'products':
            data = adminProducts;
            filename = 'products.json';
            break;
        case 'orders':
            data = adminOrders;
            filename = 'orders.json';
            break;
        case 'locations':
            data = adminLocations;
            filename = 'locations.json';
            break;
        default:
            return;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${type} data exported successfully`, 'success');
}

// Import data functionality
function importData(type, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            switch(type) {
                case 'products':
                    adminProducts = importedData;
                    loadInventoryTable();
                    break;
                case 'orders':
                    adminOrders = importedData;
                    loadOrdersTable();
                    break;
                case 'locations':
                    adminLocations = importedData;
                    loadLocationsGrid();
                    break;
            }
            
            showNotification(`${type} data imported successfully`, 'success');
        } catch (error) {
            showNotification('Error importing data: Invalid file format', 'error');
        }
    };
    reader.readAsText(file);
}

// Bulk operations
function bulkUpdateStock() {
    const selectedProducts = document.querySelectorAll('.product-checkbox:checked');
    if (selectedProducts.length === 0) {
        showNotification('Please select products to update', 'warning');
        return;
    }
    
    const stockChange = prompt('Enter stock change (positive to add, negative to subtract):');
    if (stockChange === null) return;
    
    const change = parseInt(stockChange);
    if (isNaN(change)) {
        showNotification('Please enter a valid number', 'error');
        return;
    }
    
    selectedProducts.forEach(checkbox => {
        const productId = parseInt(checkbox.dataset.productId);
        const product = adminProducts.find(p => p.id === productId);
        if (product) {
            Object.keys(product.stock).forEach(location => {
                product.stock[location] = Math.max(0, product.stock[location] + change);
            });
        }
    });
    
    loadInventoryTable();
    showNotification(`Stock updated for ${selectedProducts.length} products`, 'success');
}

// Analytics functions
function generateSalesReport(startDate, endDate) {
    const filteredOrders = adminOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
    
    const report = {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: filteredOrders.length > 0 ? 
            filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length : 0,
        ordersByLocation: {},
        ordersByStatus: {},
        topProducts: {}
    };
    
    filteredOrders.forEach(order => {
        // Orders by location
        report.ordersByLocation[order.location] = 
            (report.ordersByLocation[order.location] || 0) + 1;
        
        // Orders by status
        report.ordersByStatus[order.status] = 
            (report.ordersByStatus[order.status] || 0) + 1;
        
        // Top products
        order.items.forEach(item => {
            if (report.topProducts[item.name]) {
                report.topProducts[item.name].quantity += item.quantity;
                report.topProducts[item.name].revenue += item.quantity * item.price;
            } else {
                report.topProducts[item.name] = {
                    quantity: item.quantity,
                    revenue: item.quantity * item.price
                };
            }
        });
    });
    
    return report;
}

// Real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate new orders
        if (Math.random() < 0.1) { // 10% chance every interval
            const newOrder = generateRandomOrder();
            adminOrders.unshift(newOrder);
            
            if (document.getElementById('orders').classList.contains('active')) {
                loadOrdersTable();
            }
            
            updateDashboardStats();
            showNotification(`New order received: ${newOrder.id}`, 'info');
        }
        
        // Simulate stock changes
        if (Math.random() < 0.05) { // 5% chance every interval
            const randomProduct = adminProducts[Math.floor(Math.random() * adminProducts.length)];
            const randomLocation = Object.keys(randomProduct.stock)[Math.floor(Math.random() * 6)];
            const stockChange = Math.floor(Math.random() * 10) - 5; // -5 to +5
            
            randomProduct.stock[randomLocation] = Math.max(0, randomProduct.stock[randomLocation] + stockChange);
            
            if (document.getElementById('inventory').classList.contains('active')) {
                loadInventoryTable();
            }
        }
    }, 10000); // Every 10 seconds
}

function generateRandomOrder() {
    const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const locations = ['ikeja', 'victoria-island', 'surulere', 'lekki', 'ajah', 'yaba'];
    const statuses = ['pending', 'confirmed'];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let i = 0; i < numItems; i++) {
        const randomProduct = adminProducts[Math.floor(Math.random() * adminProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = quantity * randomProduct.price;
        
        items.push({
            name: randomProduct.name,
            quantity: quantity,
            price: randomProduct.price
        });
        
        total += itemTotal;
    }
    
    return {
        id: 'ORD' + Date.now().toString().slice(-6),
        customer: randomCustomer,
        phone: '+234812345' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        location: randomLocation,
        items: items,
        total: total,
        status: randomStatus,
        date: new Date().toISOString(),
        deliveryType: Math.random() > 0.5 ? 'delivery' : 'pickup'
    };
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save settings
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (document.getElementById('settings').classList.contains('active')) {
            saveSettings();
        }
    }
    
    // Ctrl/Cmd + N to add new product
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (document.getElementById('inventory').classList.contains('active')) {
            showAddProductModal();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Auto-save functionality
let autoSaveInterval;

function enableAutoSave() {
    autoSaveInterval = setInterval(() => {
        const adminData = {
            products: adminProducts,
            orders: adminOrders,
            locations: adminLocations,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('freshmart_admin_data', JSON.stringify(adminData));
    }, 30000); // Auto-save every 30 seconds
}

function loadAutoSavedData() {
    const savedData = localStorage.getItem('freshmart_admin_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            adminProducts = data.products || adminProducts;
            adminOrders = data.orders || adminOrders;
            adminLocations = data.locations || adminLocations;
            
            if (data.lastSaved) {
                showNotification(`Data restored from ${new Date(data.lastSaved).toLocaleString()}`, 'info');
            }
        } catch (error) {
            console.error('Error loading auto-saved data:', error);
        }
    }
}

// Initialize auto-save and real-time updates
document.addEventListener('DOMContentLoaded', function() {
    loadAutoSavedData();
    enableAutoSave();
    
    // Start real-time updates simulation after a delay
    setTimeout(simulateRealTimeUpdates, 5000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
});

// Print functionality
function printReport(reportType) {
    const printWindow = window.open('', '_blank');
    let content = '';
    
    switch(reportType) {
        case 'inventory':
            content = generateInventoryReport();
            break;
        case 'orders':
            content = generateOrdersReport();
            break;
        case 'sales':
            content = generateSalesReportHTML();
            break;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FreshMart ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { text-align: center; margin-bottom: 30px; }
                .date { color: #666; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>FreshMart ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
                <p class="date">Generated on ${new Date().toLocaleString()}</p>
            </div>
            ${content}
            <button class="no-print" onclick="window.print()">Print Report</button>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function generateInventoryReport() {
    return `
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Total Stock</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${adminProducts.map(product => {
                    const totalStock = Object.values(product.stock).reduce((sum, stock) => sum + stock, 0);
                    return `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.category}</td>
                            <td>₦${product.price.toLocaleString()}</td>
                            <td>${totalStock}</td>
                            <td>${getOverallStockStatus(product.stock).replace('-', ' ')}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function generateOrdersReport() {
    return `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${adminOrders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.location.replace('-', ' ')}</td>
                        <td>₦${order.total.toLocaleString()}</td>
                        <td>${order.status}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateSalesReportHTML() {
    const report = generateSalesReport(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
    );
    
    return `
        <div style="margin-bottom: 30px;">
            <h3>Sales Summary (Last 30 Days)</h3>
            <p><strong>Total Orders:</strong> ${report.totalOrders}</p>
            <p><strong>Total Revenue:</strong> ₦${report.totalRevenue.toLocaleString()}</p>
            <p><strong>Average Order Value:</strong> ₦${Math.round(report.averageOrderValue).toLocaleString()}</p>
        </div>
        
        <h3>Top Products</h3>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report.topProducts)
                    .sort(([,a], [,b]) => b.revenue - a.revenue)
                    .slice(0, 10)
                    .map(([product, data]) => `
                        <tr>
                            <td>${product}</td>
                            <td>${data.quantity}</td>
                            <td>₦${data.revenue.toLocaleString()}</td>
                        </tr>
                    `).join('')}
            </tbody>
        </table>
    `;
}

// Enhanced auto-save with frontend notification
function enableAutoSave() {
    autoSaveInterval = setInterval(() => {
        const adminData = {
            products: adminProducts,
            orders: adminOrders,
            locations: adminLocations,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('freshmart_admin_data', JSON.stringify(adminData));
        
        // Trigger frontend update notification
        localStorage.setItem('freshmart_data_updated', 'true');
    }, 30000); // Auto-save every 30 seconds
}

// Immediate save function for critical updates
function saveDataImmediately() {
    const adminData = {
        products: adminProducts,
        orders: adminOrders,
        locations: adminLocations,
        lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('freshmart_admin_data', JSON.stringify(adminData));
    localStorage.setItem('freshmart_data_updated', 'true');
}

// Update all functions that modify data to trigger immediate save
const originalHandleAddProduct = handleAddProduct;
handleAddProduct = function(event) {
    originalHandleAddProduct(event);
    saveDataImmediately();
};

const originalHandleUpdateProduct = handleUpdateProduct;
handleUpdateProduct = function(event, productId) {
    originalHandleUpdateProduct(event, productId);
    saveDataImmediately();
};

const originalDeleteProduct = deleteProduct;
deleteProduct = function(productId) {
    originalDeleteProduct(productId);
    saveDataImmediately();
};

// Update stock changes to trigger immediate save
function updateProductStock(productId, location, newStock) {
    const product = adminProducts.find(p => p.id === productId);
    if (product) {
        product.stock[location] = Math.max(0, newStock);
        loadInventoryTable();
        saveDataImmediately();
        showNotification(`Stock updated for ${product.name}`, 'success');
    }
}
