// Global Variables
let adminProducts = [];
let adminOrders = [];
let adminLocations = [];
let currentUser = null;
let currentPage = 1;
let itemsPerPage = 10;
let currentOrdersPage = 1;
let ordersPerPage = 10;
let autoSaveInterval;
let sessionStartTime = new Date();
let selectedProducts = [];
let confirmationCallback = null;

// Sample admin data with enhanced structure
const sampleAdminData = {
    products: [
        {
            id: 1,
            name: "Fresh Tomatoes",
            category: "groceries",
            price: 800,
            unit: "kg",
            description: "Fresh, ripe tomatoes perfect for cooking",
            image: "",
            stock: {
                "ikeja": 50,
                "victoria-island": 30,
                "surulere": 45,
                "lekki": 25,
                "ajah": 35,
                "yaba": 40
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 2,
            name: "Whole Milk",
            category: "dairy",
            price: 1200,
            unit: "liter",
            description: "Fresh whole milk, rich in calcium",
            image: "",
            stock: {
                "ikeja": 20,
                "victoria-island": 15,
                "surulere": 25,
                "lekki": 18,
                "ajah": 22,
                "yaba": 30
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 3,
            name: "Chicken Breast",
            category: "meat",
            price: 3500,
            unit: "kg",
            description: "Fresh, boneless chicken breast",
            image: "",
            stock: {
                "ikeja": 15,
                "victoria-island": 10,
                "surulere": 20,
                "lekki": 8,
                "ajah": 12,
                "yaba": 18
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 4,
            name: "Dishwashing Liquid",
            category: "household",
            price: 650,
            unit: "bottle",
            description: "Effective dishwashing liquid for clean dishes",
            image: "",
            stock: {
                "ikeja": 40,
                "victoria-island": 35,
                "surulere": 30,
                "lekki": 25,
                "ajah": 45,
                "yaba": 38
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 5,
            name: "Bluetooth Speaker",
            category: "electronics",
            price: 15000,
            unit: "piece",
            description: "Portable Bluetooth speaker with great sound quality",
            image: "",
            stock: {
                "ikeja": 5,
                "victoria-island": 3,
                "surulere": 7,
                "lekki": 4,
                "ajah": 6,
                "yaba": 8
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 6,
            name: "Portable Gas Grill",
            category: "grills",
            price: 45000,
            unit: "piece",
            description: "Compact portable gas grill perfect for outdoor cooking",
            image: "",
            stock: {
                "ikeja": 2,
                "victoria-island": 1,
                "surulere": 3,
                "lekki": 2,
                "ajah": 1,
                "yaba": 4
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    orders: [
        {
            id: 'ORD001',
            customer: 'John Doe',
            phone: '+2348123456789',
            email: 'john@example.com',
            location: 'ikeja',
            items: [
                { name: 'Fresh Tomatoes', quantity: 2, price: 800 },
                { name: 'Whole Milk', quantity: 1, price: 1200 }
            ],
            total: 2800,
            status: 'pending',
            date: new Date().toISOString(),
            deliveryType: 'pickup',
            deliveryAddress: '',
            notes: 'Customer prefers morning pickup',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'ORD002',
            customer: 'Jane Smith',
            phone: '+2348123456790',
            email: 'jane@example.com',
            location: 'lekki',
            items: [
                { name: 'Chicken Breast', quantity: 1, price: 3500 }
            ],
            total: 5000,
            status: 'confirmed',
            date: new Date(Date.now() - 86400000).toISOString(),
            deliveryType: 'delivery',
            deliveryAddress: '123 Lekki Phase 1, Lagos',
            notes: 'Call before delivery',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'ORD003',
            customer: 'Mike Johnson',
            phone: '+2348123456791',
            email: 'mike@example.com',
            location: 'victoria-island',
            items: [
                { name: 'Bluetooth Speaker', quantity: 1, price: 15000 },
                { name: 'Dishwashing Liquid', quantity: 2, price: 650 }
            ],
            total: 16300,
            status: 'delivered',
            date: new Date(Date.now() - 172800000).toISOString(),
            deliveryType: 'delivery',
            deliveryAddress: '456 Victoria Island, Lagos',
            notes: '',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
    ],
    locations: [
        {
            id: 'ikeja',
            name: 'Ikeja Branch',
            address: '123 Ikeja Way, Lagos State',
            phone: '+2347062793809',
            manager: 'Adebayo Johnson',
            status: 'active',
            hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            totalProducts: 150,
            totalOrders: 45,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'victoria-island',
            name: 'Victoria Island Branch',
            address: '456 Victoria Island, Lagos State',
            phone: '+2348069115577',
            manager: 'Funmi Adebayo',
            status: 'active',
            hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            totalProducts: 120,
            totalOrders: 38,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'surulere',
            name: 'Surulere Branch',
            address: '789 Surulere Road, Lagos State',
            phone: '+2348069115577',
            manager: 'Kemi Okafor',
            status: 'active',
            hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            totalProducts: 135,
            totalOrders: 52,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'lekki',
            name: 'Lekki Branch',
            address: '321 Lekki Phase 1, Lagos State',
            phone: '+2348069115577',
            manager: 'Tunde Bakare',
            status: 'active',
            hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            totalProducts: 110,
            totalOrders: 29,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'ajah',
            name: 'Ajah Branch',
            address: '654 Ajah Express, Lagos State',
            phone: '+2348069115577',
            manager: 'Blessing Okoro',
            status: 'active',
            hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            totalProducts: 125,
            totalOrders: 33,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'yaba',
            name: 'Yaba Branch',
            address: '987 Yaba College Road, Lagos State',
            phone: '+2348069115577',
            manager: 'Chidi Okonkwo',
            status: 'active',
            hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            totalProducts: 140,
            totalOrders: 41,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminData();
    setupEventListeners();
    loadAutoSavedData();
    updateSystemInfo();
});

function initializeAdminData() {
    // Load from localStorage or use sample data
    const savedData = localStorage.getItem('freshmart_admin_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            adminProducts = data.products || [...sampleAdminData.products];
            adminOrders = data.orders || [...sampleAdminData.orders];
            adminLocations = data.locations || [...sampleAdminData.locations];
        } catch (error) {
            console.error('Error loading saved data:', error);
            adminProducts = [...sampleAdminData.products];
            adminOrders = [...sampleAdminData.orders];
            adminLocations = [...sampleAdminData.locations];
        }
    } else {
        adminProducts = [...sampleAdminData.products];
        adminOrders = [...sampleAdminData.orders];
        adminLocations = [...sampleAdminData.locations];
    }
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
    
    // Add location form
    const addLocationForm = document.getElementById('addLocationForm');
    if (addLocationForm) {
        addLocationForm.addEventListener('submit', handleAddLocation);
    }
    
    // Filter events
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', filterInventory);
    }
    
    const categoryFilterInventory = document.getElementById('categoryFilterInventory');
    if (categoryFilterInventory) {
        categoryFilterInventory.addEventListener('change', filterInventory);
    }
    
    const searchInventory = document.getElementById('searchInventory');
    if (searchInventory) {
        searchInventory.addEventListener('input', debounce(filterInventory, 300));
    }
    
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    const orderLocationFilter = document.getElementById('orderLocationFilter');
    if (orderLocationFilter) {
        orderLocationFilter.addEventListener('change', filterOrders);
    }
    
    const orderDateFilter = document.getElementById('orderDateFilter');
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', filterOrders);
    }
    
    const searchOrders = document.getElementById('searchOrders');
    if (searchOrders) {
        searchOrders.addEventListener('input', debounce(filterOrders, 300));
    }
    
    // Select all checkboxes
    const selectAllProducts = document.getElementById('selectAllProducts');
    if (selectAllProducts) {
        selectAllProducts.addEventListener('change', toggleSelectAllProducts);
    }
    
    const selectAllHeader = document.getElementById('selectAllHeader');
    if (selectAllHeader) {
        selectAllHeader.addEventListener('change', toggleSelectAllProducts);
    }
}

// Authentication
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    showLoadingOverlay();
    
    // Simulate authentication delay
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'admin123') {
            currentUser = { 
                username: 'admin', 
                role: 'administrator',
                loginTime: new Date().toISOString()
            };
            sessionStartTime = new Date();
            showAdminDashboard();
            loadDashboardData();
            enableAutoSave();
            showNotification('Login successful', 'success');
        } else {
            showNotification('Invalid credentials. Use admin/admin123', 'error');
        }
    }, 1000);
}

function showAdminDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
}

function logout() {
    showConfirmation(
        'Confirm Logout',
        'Are you sure you want to logout? Any unsaved changes will be lost.',
        () => {
            currentUser = null;
            sessionStartTime = null;
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('adminDashboard').style.display = 'none';
            
            // Reset forms
            document.getElementById('loginForm').reset();
            
            // Clear auto-save
            if (autoSaveInterval) {
                clearInterval(autoSaveInterval);
            }
            
            showNotification('Logged out successfully', 'success');
        }
    );
}

// Dashboard functions
function loadDashboardData() {
    updateDashboardStats();
    loadInventoryTable();
    loadOrdersTable();
    loadLocationsGrid();
    loadTopProducts();
    loadRecentActivity();
    updateLocationOverview();
}

function updateDashboardStats() {
    const totalOrders = adminOrders.length;
    const totalRevenue = adminOrders.reduce((sum, order) => sum + order.total, 0);
    const lowStockItems = adminProducts.filter(product => {
        return Object.values(product.stock).some(stock => stock <= 10);
    }).length;
    
    // Update with animation
    animateNumber('totalOrders', totalOrders);
    animateNumber('totalRevenue', totalRevenue, true);
    animateNumber('lowStockItems', lowStockItems);
    
    // Update today's orders
    const today = new Date().toDateString();
    const todayOrders = adminOrders.filter(order => 
        new Date(order.date).toDateString() === today
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('todayOrders').textContent = todayOrders.length;
    document.getElementById('todayRevenue').textContent = `₦${todayRevenue.toLocaleString()}`;
    
    // Update pending orders
    const pendingOrders = adminOrders.filter(order => order.status === 'pending');
    const pendingValue = pendingOrders.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('pendingOrders').textContent = pendingOrders.length;
    document.getElementById('pendingValue').textContent = `₦${pendingValue.toLocaleString()}`;
}

function animateNumber(elementId, targetValue, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        
        if (isCurrency) {
            element.textContent = `₦${currentValue.toLocaleString()}`;
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function loadTopProducts() {
    const productSales = {};
    
    adminOrders.forEach(order => {
        order.items.forEach(item => {
            if (productSales[item.name]) {
                productSales[item.name].quantity += item.quantity;
                productSales[item.name].revenue += item.quantity * item.price;
            } else {
                productSales[item.name] = {
                    quantity: item.quantity,
                    revenue: item.quantity * item.price
                };
            }
        });
    });
    
    const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b.revenue - a.revenue)
        .slice(0, 5);
    
    const topProductsContainer = document.getElementById('topProducts');
    if (topProductsContainer) {
        topProductsContainer.innerHTML = sortedProducts.map(([name, data], index) => `
            <div class="top-product-item fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="product-rank">${index + 1}</div>
                <div class="product-details">
                    <h4>${name}</h4>
                    <p>${data.quantity} units sold</p>
                </div>
                <div class="product-sales">₦${data.revenue.toLocaleString()}</div>
            </div>
        `).join('');
    }
}

function loadRecentActivity() {
    const activities = [];
    
    // Add recent orders
    adminOrders.slice(0, 5).forEach(order => {
        activities.push({
            type: 'order',
            message: `New order ${order.id} from ${order.customer}`,
            time: order.createdAt,
            icon: 'fa-shopping-cart',
            color: '#3498db'
        });
    });
    
    // Add recent product updates
    adminProducts.slice(0, 3).forEach(product => {
        activities.push({
            type: 'product',
            message: `Product ${product.name} updated`,
            time: product.updatedAt,
            icon: 'fa-box',
            color: '#27ae60'
        });
    });
    
    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    const recentActivityContainer = document.getElementById('recentActivity');
    if (recentActivityContainer) {
        recentActivityContainer.innerHTML = activities.slice(0, 8).map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${activity.color}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <small>${formatTimeAgo(activity.time)}</small>
                </div>
            </div>
        `).join('');
    }
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
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
    }
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'inventory':
            loadInventoryTable();
            updateInventoryStats();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'locations':
            loadLocationsGrid();
            updateLocationOverview();
            break;
        case 'analytics':
            generateAnalytics();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Inventory management
function loadInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) return;
    
    const filteredProducts = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    tableBody.innerHTML = paginatedProducts.map(product => `
        <tr class="fade-in">
            <td>
                <input type="checkbox" class="product-checkbox" data-product-id="${product.id}" 
                       onchange="toggleProductSelection(${product.id})">
            </td>
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
                    ${Object.entries(product.stock).map(([location, stock]) => `
                        <div class="stock-item editable">
                            <span>${location.replace('-', ' ')}:</span>
                            <input type="number" value="${stock}" min="0" 
                                   onchange="updateProductStock(${product.id}, '${location}', this.value)"
                                   style="width: 60px; margin-left: 0.5rem; padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                    `).join('')}
                </div>
            </td>
            <td>
                <strong>${Object.values(product.stock).reduce((sum, stock) => sum + stock, 0)}</strong>
            </td>
            <td>
                <span class="status-badge ${getOverallStockStatus(product.stock)}">
                    ${getOverallStockStatus(product.stock).replace('-', ' ')}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete Product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination(filteredProducts.length);
    updateInventoryStats();
}

function getFilteredProducts() {
    let filtered = [...adminProducts];
    
    // Filter by location
    const locationFilter = document.getElementById('locationFilter')?.value;
    
    // Filter by category
    const categoryFilter = document.getElementById('categoryFilterInventory')?.value;
    if (categoryFilter) {
        filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Filter by search term
    const searchTerm = document.getElementById('searchInventory')?.value?.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function updateInventoryStats() {
    const totalProducts = adminProducts.length;
    const lowStockProducts = adminProducts.filter(product => 
        Object.values(product.stock).some(stock => stock <= 10 && stock > 0)
    ).length;
    const outOfStockProducts = adminProducts.filter(product => 
        Object.values(product.stock).every(stock => stock === 0)
    ).length;
    
    const totalProductsEl = document.getElementById('totalProducts');
    const lowStockCountEl = document.getElementById('lowStockCount');
    const outOfStockCountEl = document.getElementById('outOfStockCount');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (lowStockCountEl) lowStockCountEl.textContent = lowStockProducts;
    if (outOfStockCountEl) outOfStockCountEl.textContent = outOfStockProducts;
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Update pagination info
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    const paginationStart = document.getElementById('paginationStart');
    const paginationEnd = document.getElementById('paginationEnd');
    const paginationTotal = document.getElementById('paginationTotal');
    
    if (paginationStart) paginationStart.textContent = startItem;
    if (paginationEnd) paginationEnd.textContent = endItem;
    if (paginationTotal) paginationTotal.textContent = totalItems;
    
    // Update pagination controls
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    // Update page numbers
    const pageNumbers = document.getElementById('pageNumbers');
    if (pageNumbers) {
        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" 
                        onclick="goToPage(${i})">${i}</button>
            `;
        }
        
        pageNumbers.innerHTML = paginationHTML;
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadInventoryTable();
    }
}

function goToPage(page) {
    currentPage = page;
    loadInventoryTable();
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
    currentPage = 1; // Reset to first page when filtering
    loadInventoryTable();
}

function updateProductStock(productId, location, newStock) {
    const product = adminProducts.find(p => p.id === productId);
    if (product) {
        const stockValue = Math.max(0, parseInt(newStock) || 0);
        product.stock[location] = stockValue;
        product.updatedAt = new Date().toISOString();
        
        saveDataImmediately();
        showNotification(`Stock updated for ${product.name} at ${location.replace('-', ' ')}`, 'success');
        
        // Update the display
        setTimeout(() => {
            loadInventoryTable();
            updateDashboardStats();
        }, 100);
    }
}

function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Show modal and populate with existing data
    showAddProductModal();
    
    // Update modal title
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
    document.getElementById('submitButtonText').textContent = 'Update Product';
    
    // Fill form with existing data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image || '';
    
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
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    showConfirmation(
        'Delete Product',
        `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        () => {
            adminProducts = adminProducts.filter(p => p.id !== productId);
            saveDataImmediately();
            loadInventoryTable();
            updateDashboardStats();
            showNotification('Product deleted successfully', 'success');
        }
    );
}

// Product selection functions
function toggleProductSelection(productId) {
    const checkbox = document.querySelector(`input[data-product-id="${productId}"]`);
    if (checkbox.checked) {
        if (!selectedProducts.includes(productId)) {
            selectedProducts.push(productId);
        }
    } else {
        selectedProducts = selectedProducts.filter(id => id !== productId);
    }
    
    updateBulkActionButtons();
    updateSelectAllCheckbox();
}

function toggleSelectAllProducts() {
    const selectAllCheckbox = document.getElementById('selectAllProducts') || document.getElementById('selectAllHeader');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    
    if (selectAllCheckbox.checked) {
        productCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
            const productId = parseInt(checkbox.dataset.productId);
            if (!selectedProducts.includes(productId)) {
                selectedProducts.push(productId);
            }
        });
    } else {
        productCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        selectedProducts = [];
    }
    
    updateBulkActionButtons();
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllProducts');
    const selectAllHeader = document.getElementById('selectAllHeader');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    
    const allChecked = productCheckboxes.length > 0 && checkedCheckboxes.length === productCheckboxes.length;
    
    if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
    if (selectAllHeader) selectAllHeader.checked = allChecked;
}

function updateBulkActionButtons() {
    const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    const hasSelection = selectedProducts.length > 0;
    
    if (bulkUpdateBtn) bulkUpdateBtn.disabled = !hasSelection;
    if (bulkDeleteBtn) bulkDeleteBtn.disabled = !hasSelection;
}

// Orders management
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    const filteredOrders = getFilteredOrders();
    const startIndex = (currentOrdersPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    tableBody.innerHTML = paginatedOrders.map(order => `
        <tr class="fade-in">
            <td><strong>${order.id}</strong></td>
            <td>
                <div>
                    <strong>${order.customer}</strong>
                    <br>
                    <small style="color: #666;">${order.phone}</small>
                    ${order.email ? `<br><small style="color: #666;">${order.email}</small>` : ''}
                </div>
            </td>
            <td style="text-transform: capitalize;">${order.location.replace('-', ' ')}</td>
            <td>
                <span class="delivery-type ${order.deliveryType}">
                    <i class="fas ${order.deliveryType === 'delivery' ? 'fa-truck' : 'fa-store'}"></i>
                    ${order.deliveryType}
                </span>
            </td>
            <td>
                <div style="max-width: 200px;">
                    ${order.items.map(item => 
                        `<div style="font-size: 0.9rem; margin-bottom: 0.25rem;">
                            ${item.quantity}x ${item.name}
                        </div>`
                    ).join('')}
                    <button class="btn-link" onclick="showOrderDetails('${order.id}')" style="font-size: 0.8rem;">
                        View Details
                    </button>
                </div>
            </td>
            <td><strong>₦${order.total.toLocaleString()}</strong></td>
            <td>
                <span class="status-badge ${order.status}">${order.status}</span>
            </td>
            <td>
                <div>
                    ${new Date(order.date).toLocaleDateString()}
                    <br>
                    <small style="color: #666;">${new Date(order.date).toLocaleTimeString()}</small>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" 
                            style="padding: 0.25rem; border-radius: 4px; border: 1px solid #ddd;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button class="action-btn delete" onclick="deleteOrder('${order.id}')" title="Delete Order">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updateOrdersPagination(filteredOrders.length);
}

function getFilteredOrders() {
    let filtered = [...adminOrders];
    
    // Filter by status
    const statusFilter = document.getElementById('orderStatusFilter')?.value;
    if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by location
    const locationFilter = document.getElementById('orderLocationFilter')?.value;
    if (locationFilter) {
        filtered = filtered.filter(order => order.location === locationFilter);
    }
    
    // Filter by date
    const dateFilter = document.getElementById('orderDateFilter')?.value;
    if (dateFilter) {
        filtered = filtered.filter(order => 
            new Date(order.date).toDateString() === new Date(dateFilter).toDateString()
        );
    }
    
    // Filter by search term
    const searchTerm = document.getElementById('searchOrders')?.value?.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm) ||
            order.phone.includes(searchTerm) ||
            (order.email && order.email.toLowerCase().includes(searchTerm))
        );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
}

function updateOrdersPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ordersPerPage);
    
    // Update pagination info
    const startItem = (currentOrdersPage - 1) * ordersPerPage + 1;
    const endItem = Math.min(currentOrdersPage * ordersPerPage, totalItems);
    
    const paginationStart = document.getElementById('ordersPaginationStart');
    const paginationEnd = document.getElementById('ordersPaginationEnd');
    const paginationTotal = document.getElementById('ordersPaginationTotal');
    
    if (paginationStart) paginationStart.textContent = startItem;
    if (paginationEnd) paginationEnd.textContent = endItem;
    if (paginationTotal) paginationTotal.textContent = totalItems;
    
    // Update pagination controls
    const prevBtn = document.getElementById('prevOrdersPageBtn');
    const nextBtn = document.getElementById('nextOrdersPageBtn');
    
    if (prevBtn) prevBtn.disabled = currentOrdersPage === 1;
    if (nextBtn) nextBtn.disabled = currentOrdersPage === totalPages;
    
    // Update page numbers
    const pageNumbers = document.getElementById('ordersPageNumbers');
    if (pageNumbers) {
        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentOrdersPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === currentOrdersPage ? 'active' : ''}" 
                        onclick="goToOrdersPage(${i})">${i}</button>
            `;
        }
        
        pageNumbers.innerHTML = paginationHTML;
    }
}

function changeOrdersPage(direction) {
    const totalPages = Math.ceil(getFilteredOrders().length / ordersPerPage);
    const newPage = currentOrdersPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentOrdersPage = newPage;
        loadOrdersTable();
    }
}

function goToOrdersPage(page) {
    currentOrdersPage = page;
    loadOrdersTable();
}

function updateOrderStatus(orderId, newStatus) {
    const order = adminOrders.find(o => o.id === orderId);
    if (order) {
        const oldStatus = order.status;
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        
        saveDataImmediately();
        loadOrdersTable();
        updateDashboardStats();
        
        showNotification(`Order ${orderId} status updated from ${oldStatus} to ${newStatus}`, 'success');
        
        // Add to recent activity
        addRecentActivity({
            type: 'order_update',
            message: `Order ${orderId} status changed to ${newStatus}`,
            time: new Date().toISOString(),
            icon: 'fa-edit',
            color: '#f39c12'
        });
    }
}

function deleteOrder(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    showConfirmation(
        'Delete Order',
        `Are you sure you want to delete order ${orderId}? This action cannot be undone.`,
        () => {
            adminOrders = adminOrders.filter(o => o.id !== orderId);
            saveDataImmediately();
            loadOrdersTable();
            updateDashboardStats();
            showNotification('Order deleted successfully', 'success');
        }
    );
}

function showOrderDetails(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    
    content.innerHTML = `
        <div class="order-details-grid">
            <div class="order-section">
                <h4><i class="fas fa-info-circle"></i> Order Information</h4>
                <div class="detail-item">
                    <span>Order ID:</span>
                    <span><strong>${order.id}</strong></span>
                </div>
                <div class="detail-item">
                    <span>Date:</span>
                    <span>${new Date(order.date).toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span>Status:</span>
                    <span><span class="status-badge ${order.status}">${order.status}</span></span>
                </div>
                <div class="detail-item">
                    <span>Type:</span>
                    <span>
                        <i class="fas ${order.deliveryType === 'delivery' ? 'fa-truck' : 'fa-store'}"></i>
                        ${order.deliveryType}
                    </span>
                </div>
                <div class="detail-item">
                    <span>Location:</span>
                    <span>${order.location.replace('-', ' ')}</span>
                </div>
            </div>
            
            <div class="order-section">
                <h4><i class="fas fa-user"></i> Customer Information</h4>
                <div class="detail-item">
                    <span>Name:</span>
                    <span>${order.customer}</span>
                </div>
                <div class="detail-item">
                    <span>Phone:</span>
                    <span><a href="tel:${order.phone}">${order.phone}</a></span>
                </div>
                ${order.email ? `
                    <div class="detail-item">
                        <span>Email:</span>
                        <span><a href="mailto:${order.email}">${order.email}</a></span>
                    </div>
                ` : ''}
                ${order.deliveryType === 'delivery' && order.deliveryAddress ? `
                    <div class="detail-item">
                        <span>Address:</span>
                        <span>${order.deliveryAddress}</span>
                    </div>
                ` : ''}
                ${order.notes ? `
                    <div class="detail-item">
                        <span>Notes:</span>
                        <span>${order.notes}</span>
                    </div>
                ` : ''}
            </div>
            
                       <div class="order-section full-width">
                <h4><i class="fas fa-shopping-cart"></i> Order Items</h4>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>₦${item.price.toLocaleString()}</td>
                                <td>₦${(item.quantity * item.price).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3"><strong>Total Amount:</strong></td>
                            <td><strong>₦${order.total.toLocaleString()}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

function printOrderDetails() {
    window.print();
}

function filterOrders() {
    currentOrdersPage = 1; // Reset to first page when filtering
    loadOrdersTable();
}

// Locations management
function loadLocationsGrid() {
    const locationsGrid = document.getElementById('locationsGrid');
    if (!locationsGrid) return;
    
    locationsGrid.innerHTML = adminLocations.map((location, index) => `
        <div class="location-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="location-header">
                <h3 class="location-name">${location.name}</h3>
                <span class="location-status ${location.status}">${location.status}</span>
            </div>
            <div class="location-info">
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-phone"></i> <a href="tel:${location.phone}">${location.phone}</a></p>
                <p><i class="fas fa-user"></i> Manager: ${location.manager}</p>
                <p><i class="fas fa-clock"></i> ${location.hours}</p>
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
                <button class="action-btn edit" onclick="editLocation('${location.id}')" title="Edit Location">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete" onclick="deleteLocation('${location.id}')" title="Delete Location">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateLocationOverview() {
    const totalLocations = adminLocations.length;
    const activeLocations = adminLocations.filter(loc => loc.status === 'active').length;
    const totalLocationProducts = adminLocations.reduce((sum, loc) => sum + loc.totalProducts, 0);
    const averageStock = Math.round(totalLocationProducts / totalLocations);
    
    const totalLocationsEl = document.getElementById('totalLocations');
    const activeLocationsEl = document.getElementById('activeLocations');
    const totalLocationProductsEl = document.getElementById('totalLocationProducts');
    const averageStockEl = document.getElementById('averageStock');
    
    if (totalLocationsEl) totalLocationsEl.textContent = totalLocations;
    if (activeLocationsEl) activeLocationsEl.textContent = activeLocations;
    if (totalLocationProductsEl) totalLocationProductsEl.textContent = totalLocationProducts;
    if (averageStockEl) averageStockEl.textContent = averageStock;
}

function editLocation(locationId) {
    const location = adminLocations.find(l => l.id === locationId);
    if (!location) return;
    
    showAddLocationModal();
    
    // Fill form with existing data
    document.getElementById('locationName').value = location.name;
    document.getElementById('locationId').value = location.id;
    document.getElementById('locationAddress').value = location.address;
    document.getElementById('locationPhone').value = location.phone;
    document.getElementById('locationManager').value = location.manager;
    document.getElementById('locationHours').value = location.hours;
    document.getElementById('locationStatus').value = location.status;
    
    // Change form submission to update
    const form = document.getElementById('addLocationForm');
    form.onsubmit = (e) => handleUpdateLocation(e, locationId);
}

function deleteLocation(locationId) {
    const location = adminLocations.find(l => l.id === locationId);
    if (!location) return;
    
    showConfirmation(
        'Delete Location',
        `Are you sure you want to delete "${location.name}"? This will also remove all stock data for this location.`,
        () => {
            // Remove location from all products' stock
            adminProducts.forEach(product => {
                delete product.stock[locationId];
            });
            
            // Remove location
            adminLocations = adminLocations.filter(l => l.id !== locationId);
            
            saveDataImmediately();
            loadLocationsGrid();
            updateLocationOverview();
            loadInventoryTable();
            showNotification('Location deleted successfully', 'success');
        }
    );
}

// Product management modals
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Reset form and modal title
    document.getElementById('addProductForm').reset();
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Add New Product';
    document.getElementById('submitButtonText').textContent = 'Add Product';
    
    // Reset form submission handler
    const form = document.getElementById('addProductForm');
    form.onsubmit = handleAddProduct;
}

function showAddLocationModal() {
    const modal = document.getElementById('addLocationModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Reset form
    document.getElementById('addLocationForm').reset();
    
    // Reset form submission handler
    const form = document.getElementById('addLocationForm');
    form.onsubmit = handleAddLocation;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
    // Reset forms
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());
}

function handleAddProduct(event) {
    event.preventDefault();
    
    const newProduct = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value || '',
        stock: {
            'ikeja': parseInt(document.getElementById('stock-ikeja').value) || 0,
            'victoria-island': parseInt(document.getElementById('stock-victoria-island').value) || 0,
            'surulere': parseInt(document.getElementById('stock-surulere').value) || 0,
            'lekki': parseInt(document.getElementById('stock-lekki').value) || 0,
            'ajah': parseInt(document.getElementById('stock-ajah').value) || 0,
            'yaba': parseInt(document.getElementById('stock-yaba').value) || 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    adminProducts.push(newProduct);
    saveDataImmediately();
    loadInventoryTable();
    updateDashboardStats();
    closeModal('addProductModal');
    showNotification('Product added successfully', 'success');
    
    // Add to recent activity
    addRecentActivity({
        type: 'product_add',
        message: `New product "${newProduct.name}" added`,
        time: new Date().toISOString(),
        icon: 'fa-plus',
        color: '#27ae60'
    });
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
        image: document.getElementById('productImage').value || '',
        stock: {
            'ikeja': parseInt(document.getElementById('stock-ikeja').value) || 0,
            'victoria-island': parseInt(document.getElementById('stock-victoria-island').value) || 0,
            'surulere': parseInt(document.getElementById('stock-surulere').value) || 0,
            'lekki': parseInt(document.getElementById('stock-lekki').value) || 0,
            'ajah': parseInt(document.getElementById('stock-ajah').value) || 0,
            'yaba': parseInt(document.getElementById('stock-yaba').value) || 0
        },
        updatedAt: new Date().toISOString()
    };
    
    saveDataImmediately();
    loadInventoryTable();
    updateDashboardStats();
    closeModal('addProductModal');
    showNotification('Product updated successfully', 'success');
}

function handleAddLocation(event) {
    event.preventDefault();
    
    const newLocation = {
        id: document.getElementById('locationId').value,
        name: document.getElementById('locationName').value,
        address: document.getElementById('locationAddress').value,
        phone: document.getElementById('locationPhone').value,
        manager: document.getElementById('locationManager').value,
        hours: document.getElementById('locationHours').value || 'Mon-Sun: 8:00 AM - 10:00 PM',
        status: document.getElementById('locationStatus').value,
        totalProducts: 0,
        totalOrders: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Add location to all existing products' stock
    adminProducts.forEach(product => {
        product.stock[newLocation.id] = 0;
    });
    
    adminLocations.push(newLocation);
    saveDataImmediately();
    loadLocationsGrid();
    updateLocationOverview();
    loadInventoryTable();
    closeModal('addLocationModal');
    showNotification('Location added successfully', 'success');
}

function handleUpdateLocation(event, locationId) {
    event.preventDefault();
    
    const locationIndex = adminLocations.findIndex(l => l.id === locationId);
    if (locationIndex === -1) return;
    
    const oldLocationId = adminLocations[locationIndex].id;
    const newLocationId = document.getElementById('locationId').value;
    
    // Update location data
    adminLocations[locationIndex] = {
        ...adminLocations[locationIndex],
        id: newLocationId,
        name: document.getElementById('locationName').value,
        address: document.getElementById('locationAddress').value,
        phone: document.getElementById('locationPhone').value,
        manager: document.getElementById('locationManager').value,
        hours: document.getElementById('locationHours').value,
        status: document.getElementById('locationStatus').value,
        updatedAt: new Date().toISOString()
    };
    
    // If location ID changed, update all products' stock
    if (oldLocationId !== newLocationId) {
        adminProducts.forEach(product => {
            product.stock[newLocationId] = product.stock[oldLocationId] || 0;
            delete product.stock[oldLocationId];
        });
    }
    
    saveDataImmediately();
    loadLocationsGrid();
    updateLocationOverview();
    loadInventoryTable();
    closeModal('addLocationModal');
    showNotification('Location updated successfully', 'success');
}

// Bulk operations
function bulkUpdateStock() {
    if (selectedProducts.length === 0) {
        showNotification('Please select products to update', 'warning');
        return;
    }
    
    const modal = document.getElementById('bulkUpdateModal');
    const overlay = document.getElementById('modalOverlay');
    
    document.getElementById('selectedProductsCount').textContent = selectedProducts.length;
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

function applyBulkUpdate() {
    const updateType = document.getElementById('bulkUpdateType').value;
    const stockAmount = parseInt(document.getElementById('bulkStockAmount').value) || 0;
    const selectedLocations = Array.from(document.querySelectorAll('#bulkUpdateModal input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (selectedLocations.length === 0) {
        showNotification('Please select at least one location', 'warning');
        return;
    }
    
    selectedProducts.forEach(productId => {
        const product = adminProducts.find(p => p.id === productId);
        if (product) {
            selectedLocations.forEach(location => {
                switch (updateType) {
                    case 'add':
                        product.stock[location] = (product.stock[location] || 0) + stockAmount;
                        break;
                    case 'subtract':
                        product.stock[location] = Math.max(0, (product.stock[location] || 0) - stockAmount);
                        break;
                    case 'set':
                        product.stock[location] = stockAmount;
                        break;
                }
            });
            product.updatedAt = new Date().toISOString();
        }
    });
    
    saveDataImmediately();
    loadInventoryTable();
    updateDashboardStats();
    closeModal('bulkUpdateModal');
    
    // Clear selections
    selectedProducts = [];
    document.querySelectorAll('.product-checkbox').forEach(cb => cb.checked = false);
    updateBulkActionButtons();
    updateSelectAllCheckbox();
    
    showNotification(`Bulk update applied to ${selectedProducts.length} products`, 'success');
}

function bulkDeleteProducts() {
    if (selectedProducts.length === 0) {
        showNotification('Please select products to delete', 'warning');
        return;
    }
    
    showConfirmation(
        'Delete Selected Products',
        `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`,
        () => {
            adminProducts = adminProducts.filter(p => !selectedProducts.includes(p.id));
            selectedProducts = [];
            
            saveDataImmediately();
            loadInventoryTable();
            updateDashboardStats();
            updateBulkActionButtons();
                        showNotification(`${selectedProducts.length} products deleted successfully`, 'success');
        }
    );
}

// Analytics and reporting
function generateAnalytics() {
    const dateFrom = document.getElementById('analyticsDateFrom')?.value;
    const dateTo = document.getElementById('analyticsDateTo')?.value;
    
    if (!dateFrom || !dateTo) {
        showNotification('Please select date range for analytics', 'warning');
        return;
    }
    
    showLoadingOverlay();
    
    setTimeout(() => {
        const report = generateSalesReport(dateFrom, dateTo);
        updateAnalyticsDisplay(report);
        hideLoadingOverlay();
        showNotification('Analytics generated successfully', 'success');
    }, 1500);
}

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
        ordersByType: { delivery: 0, pickup: 0 },
        topProducts: {},
        dailySales: {},
        categoryPerformance: {}
    };
    
    filteredOrders.forEach(order => {
        // Orders by location
        report.ordersByLocation[order.location] = 
            (report.ordersByLocation[order.location] || 0) + 1;
        
        // Orders by status
        report.ordersByStatus[order.status] = 
            (report.ordersByStatus[order.status] || 0) + 1;
        
        // Orders by type
        report.ordersByType[order.deliveryType]++;
        
        // Daily sales
        const orderDay = new Date(order.date).toDateString();
        report.dailySales[orderDay] = (report.dailySales[orderDay] || 0) + order.total;
        
        // Top products and category performance
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
            
            // Find product category
            const product = adminProducts.find(p => p.name === item.name);
            if (product) {
                const category = product.category;
                if (report.categoryPerformance[category]) {
                    report.categoryPerformance[category] += item.quantity * item.price;
                } else {
                    report.categoryPerformance[category] = item.quantity * item.price;
                }
            }
        });
    });
    
    return report;
}

function updateAnalyticsDisplay(report) {
    // Update location performance
    const locationPerformance = document.getElementById('locationPerformance');
    if (locationPerformance) {
        locationPerformance.innerHTML = Object.entries(report.ordersByLocation)
            .sort(([,a], [,b]) => b - a)
            .map(([location, orders]) => `
                <div class="performance-item">
                    <div class="performance-location">${location.replace('-', ' ')}</div>
                    <div class="performance-metric">${orders} orders</div>
                </div>
            `).join('');
    }
    
    // Update inventory turnover
    const turnoverData = document.getElementById('turnoverData');
    if (turnoverData) {
        const topProducts = Object.entries(report.topProducts)
            .sort(([,a], [,b]) => b.quantity - a.quantity)
            .slice(0, 5);
        
        turnoverData.innerHTML = topProducts.map(([name, data]) => `
            <div class="turnover-item">
                <div class="turnover-product">${name}</div>
                <div class="turnover-metric">${data.quantity} sold</div>
            </div>
        `).join('');
    }
    
    // Simulate chart updates (in a real app, you'd use a charting library)
    updateChartPlaceholders(report);
}

function updateChartPlaceholders(report) {
    const salesChart = document.getElementById('salesChart');
    const categoryChart = document.getElementById('categoryChart');
    
    if (salesChart) {
        salesChart.parentElement.innerHTML = `
            <div class="chart-placeholder">
                <div class="chart-data">
                    <h4>Sales Trend</h4>
                    <p>Total Revenue: ₦${report.totalRevenue.toLocaleString()}</p>
                    <p>Average Order: ₦${Math.round(report.averageOrderValue).toLocaleString()}</p>
                    <p>Total Orders: ${report.totalOrders}</p>
                </div>
            </div>
        `;
    }
    
    if (categoryChart) {
        categoryChart.parentElement.innerHTML = `
            <div class="chart-placeholder">
                <div class="chart-data">
                    <h4>Category Performance</h4>
                    ${Object.entries(report.categoryPerformance)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([category, revenue]) => `
                            <p>${category}: ₦${revenue.toLocaleString()}</p>
                        `).join('')}
                </div>
            </div>
        `;
    }
}

function generateReport(reportType) {
    showLoadingOverlay();
    
    setTimeout(() => {
        switch (reportType) {
            case 'sales':
                printReport('sales');
                break;
            case 'inventory':
                printReport('inventory');
                break;
            case 'customers':
                generateCustomerReport();
                break;
            case 'financial':
                generateFinancialReport();
                break;
            case 'summary':
                generateSummaryReport();
                break;
        }
        hideLoadingOverlay();
    }, 1000);
}

function generateCustomerReport() {
    const customerData = {};
    
    adminOrders.forEach(order => {
        if (customerData[order.customer]) {
            customerData[order.customer].orders++;
            customerData[order.customer].totalSpent += order.total;
        } else {
            customerData[order.customer] = {
                orders: 1,
                totalSpent: order.total,
                phone: order.phone,
                email: order.email || 'N/A'
            };
        }
    });
    
    const sortedCustomers = Object.entries(customerData)
        .sort(([,a], [,b]) => b.totalSpent - a.totalSpent);
    
    const reportContent = `
        <h2>Customer Report</h2>
        <table>
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                </tr>
            </thead>
            <tbody>
                ${sortedCustomers.map(([name, data]) => `
                    <tr>
                        <td>${name}</td>
                        <td>${data.phone}</td>
                        <td>${data.email}</td>
                        <td>${data.orders}</td>
                        <td>₦${data.totalSpent.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    openPrintWindow('Customer Report', reportContent);
}

function generateFinancialReport() {
    const today = new Date();
    const thisMonth = adminOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === today.getMonth() && 
               orderDate.getFullYear() === today.getFullYear();
    });
    
    const lastMonth = adminOrders.filter(order => {
        const orderDate = new Date(order.date);
        const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1);
        return orderDate.getMonth() === lastMonthDate.getMonth() && 
               orderDate.getFullYear() === lastMonthDate.getFullYear();
    });
    
    const thisMonthRevenue = thisMonth.reduce((sum, order) => sum + order.total, 0);
    const lastMonthRevenue = lastMonth.reduce((sum, order) => sum + order.total, 0);
    const growth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;
    
    const reportContent = `
        <h2>Financial Report</h2>
        <div class="financial-summary">
            <div class="financial-item">
                <h3>This Month</h3>
                <p>Revenue: ₦${thisMonthRevenue.toLocaleString()}</p>
                <p>Orders: ${thisMonth.length}</p>
            </div>
            <div class="financial-item">
                <h3>Last Month</h3>
                <p>Revenue: ₦${lastMonthRevenue.toLocaleString()}</p>
                <p>Orders: ${lastMonth.length}</p>
            </div>
            <div class="financial-item">
                <h3>Growth</h3>
                <p style="color: ${growth >= 0 ? '#27ae60' : '#e74c3c'}">
                    ${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%
                </p>
            </div>
        </div>
    `;
    
    openPrintWindow('Financial Report', reportContent);
}

function generateSummaryReport() {
    const totalProducts = adminProducts.length;
    const totalOrders = adminOrders.length;
    const totalRevenue = adminOrders.reduce((sum, order) => sum + order.total, 0);
    const totalLocations = adminLocations.length;
    
    const reportContent = `
        <h2>System Summary Report</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <h3>Products</h3>
                <p class="summary-number">${totalProducts}</p>
            </div>
            <div class="summary-item">
                <h3>Orders</h3>
                <p class="summary-number">${totalOrders}</p>
            </div>
            <div class="summary-item">
                <h3>Revenue</h3>
                <p class="summary-number">₦${totalRevenue.toLocaleString()}</p>
            </div>
            <div class="summary-item">
                <h3>Locations</h3>
                <p class="summary-number">${totalLocations}</p>
            </div>
        </div>
        
        <h3>Recent Activity</h3>
        <ul>
            ${adminOrders.slice(0, 10).map(order => `
                <li>Order ${order.id} - ${order.customer} - ₦${order.total.toLocaleString()}</li>
            `).join('')}
        </ul>
    `;
    
    openPrintWindow('Summary Report', reportContent);
}

// Settings management
function showSettingsTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function saveSettings() {
    const settings = {
        // General settings
        storeName: document.getElementById('storeName')?.value,
        storeDescription: document.getElementById('storeDescription')?.value,
        businessHours: document.getElementById('businessHours')?.value,
        currency: document.getElementById('currency')?.value,
        defaultLanguage: document.getElementById('defaultLanguage')?.value,
        timeZone: document.getElementById('timeZone')?.value,
        autoSaveInterval: document.getElementById('autoSaveInterval')?.value,
        
        // Delivery settings
        baseDeliveryFee: document.getElementById('baseDeliveryFee')?.value,
        freeDeliveryThreshold: document.getElementById('freeDeliveryThreshold')?.value,
        deliveryRadius: document.getElementById('deliveryRadius')?.value,
        deliveryTime: document.getElementById('deliveryTime')?.value,
        pickupTime: document.getElementById('pickupTime')?.value,
        scheduledPickup: document.getElementById('scheduledPickup')?.checked,
        pickupSlots: document.getElementById('pickupSlots')?.value,
        
        // Notification settings
        lowStockThreshold: document.getElementById('lowStockThreshold')?.value,
        emailNotifications: document.getElementById('emailNotifications')?.checked,
        smsNotifications: document.getElementById('smsNotifications')?.checked,
        notificationEmail: document.getElementById('notificationEmail')?.value,
        newOrderAlerts: document.getElementById('newOrderAlerts')?.checked,
        orderStatusUpdates: document.getElementById('orderStatusUpdates')?.checked,
        dailySummary: document.getElementById('dailySummary')?.checked,
        
        // Integration settings
        defaultWhatsApp: document.getElementById('defaultWhatsApp')?.value,
        orderTemplate: document.getElementById('orderTemplate')?.value,
        enableWhatsApp: document.getElementById('enableWhatsApp')?.checked,
        paymentGateway: document.getElementById('paymentGateway')?.value,
        paymentApiKey: document.getElementById('paymentApiKey')?.value,
        enableOnlinePayments: document.getElementById('enableOnlinePayments')?.checked,
        bankDetails: document.getElementById('bankDetails')?.value,
        
        // Security settings
        sessionTimeout: document.getElementById('sessionTimeout')?.value,
        autoLogout: document.getElementById('autoLogout')?.checked,
        rememberLogin: document.getElementById('rememberLogin')?.checked,
        backupFrequency: document.getElementById('backupFrequency')?.value,
        dataRetention: document.getElementById('dataRetention')?.value,
        
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('freshmart_admin_settings', JSON.stringify(settings));
    showNotification('Settings saved successfully', 'success');
    
    // Update auto-save interval if changed
    const newInterval = parseInt(settings.autoSaveInterval) * 1000;
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    enableAutoSave(newInterval);
}

function loadSettings() {
    const savedSettings = localStorage.getItem('freshmart_admin_settings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Load general settings
            if (settings.storeName) document.getElementById('storeName').value = settings.storeName;
            if (settings.storeDescription) document.getElementById('storeDescription').value = settings.storeDescription;
            if (settings.businessHours) document.getElementById('businessHours').value = settings.businessHours;
            if (settings.currency) document.getElementById('currency').value = settings.currency;
            if (settings.defaultLanguage) document.getElementById('defaultLanguage').value = settings.defaultLanguage;
            if (settings.timeZone) document.getElementById('timeZone').value = settings.timeZone;
            if (settings.autoSaveInterval) document.getElementById('autoSaveInterval').value = settings.autoSaveInterval;
            
            // Load delivery settings
            if (settings.baseDeliveryFee) document.getElementById('baseDeliveryFee').value = settings.baseDeliveryFee;
            if (settings.freeDeliveryThreshold) document.getElementById('freeDeliveryThreshold').value = settings.freeDeliveryThreshold;
            if (settings.deliveryRadius) document.getElementById('deliveryRadius').value = settings.deliveryRadius;
            if (settings.deliveryTime) document.getElementById('deliveryTime').value = settings.deliveryTime;
            if (settings.pickupTime) document.getElementById('pickupTime').value = settings.pickupTime;
            if (settings.scheduledPickup !== undefined) document.getElementById('scheduledPickup').checked = settings.scheduledPickup;
            if (settings.pickupSlots) document.getElementById('pickupSlots').value = settings.pickupSlots;
            
            // Load notification settings
            if (settings.lowStockThreshold) document.getElementById('lowStockThreshold').value = settings.lowStockThreshold;
            if (settings.emailNotifications !== undefined) document.getElementById('emailNotifications').checked = settings.emailNotifications;
            if (settings.smsNotifications !== undefined) document.getElementById('smsNotifications').checked = settings.smsNotifications;
            if (settings.notificationEmail) document.getElementById('notificationEmail').value = settings.notificationEmail;
            if (settings.newOrderAlerts !== undefined) document.getElementById('newOrderAlerts').checked = settings.newOrderAlerts;
            if (settings.orderStatusUpdates !== undefined) document.getElementById('orderStatusUpdates').checked = settings.orderStatusUpdates;
            if (settings.dailySummary !== undefined) document.getElementById('dailySummary').checked = settings.dailySummary;
            
            // Load integration settings
            if (settings.defaultWhatsApp) document.getElementById('defaultWhatsApp').value = settings.defaultWhatsApp;
            if (settings.orderTemplate) document.getElementById('orderTemplate').value = settings.orderTemplate;
            if (settings.enableWhatsApp !== undefined) document.getElementById('enableWhatsApp').checked = settings.enableWhatsApp;
            if (settings.paymentGateway) document.getElementById('paymentGateway').value = settings.paymentGateway;
            if (settings.paymentApiKey) document.getElementById('paymentApiKey').value = settings.paymentApiKey;
            if (settings.enableOnlinePayments !== undefined) document.getElementById('enableOnlinePayments').checked = settings.enableOnlinePayments;
            if (settings.bankDetails) document.getElementById('bankDetails').value = settings.bankDetails;
            
            // Load security settings
            if (settings.sessionTimeout) document.getElementById('sessionTimeout').value = settings.sessionTimeout;
            if (settings.autoLogout !== undefined) document.getElementById('autoLogout').checked = settings.autoLogout;
            if (settings.rememberLogin !== undefined) document.getElementById('rememberLogin').checked = settings.rememberLogin;
            if (settings.backupFrequency) document.getElementById('backupFrequency').value = settings.backupFrequency;
            if (settings.dataRetention) document.getElementById('dataRetention').value = settings.dataRetention;
            
        } catch (error) {
            console.error('Error loading settings:', error);
            showNotification('Error loading settings', 'error');
        }
    }
}

function resetSettings() {
    showConfirmation(
        'Reset Settings',
        'Are you sure you want to reset all settings to default values?',
        () => {
            localStorage.removeItem('freshmart_admin_settings');
            
            // Reset all form fields to default values
            document.getElementById('storeName').value = 'FreshMart';
            document.getElementById('storeDescription').value = 'Your trusted supermarket with multiple locations across Lagos.';
            document.getElementById('businessHours').value = 'Mon-Sun: 8:00 AM - 10:00 PM';
            document.getElementById('currency').value = 'NGN';
            document.getElementById('defaultLanguage').value = 'en';
            document.getElementById('timeZone').value = 'Africa/Lagos';
            document.getElementById('autoSaveInterval').value = '30';
            
            document.getElementById('baseDeliveryFee').value = '1500';
            document.getElementById('freeDeliveryThreshold').value = '25000';
            document.getElementById('deliveryRadius').value = '15';
            document.getElementById('deliveryTime').value = '30-60 minutes';
            document.getElementById('pickupTime').value = '15-30 minutes';
            document.getElementById('scheduledPickup').checked = true;
            
            document.getElementById('lowStockThreshold').value = '10';
            document.getElementById('emailNotifications').checked = true;
            document.getElementById('smsNotifications').checked = false;
            document.getElementById('notificationEmail').value = 'admin@freshmart.ng';
            document.getElementById('newOrderAlerts').checked = true;
            document.getElementById('orderStatusUpdates').checked = true;
            document.getElementById('dailySummary').checked = true;
            
            document.getElementById('defaultWhatsApp').value = '+2348123456000';
            document.getElementById('enableWhatsApp').checked = true;
            document.getElementById('paymentGateway').value = 'none';
            document.getElementById('enableOnlinePayments').checked = false;
            
            document.getElementById('sessionTimeout').value = '60';
            document.getElementById('autoLogout').checked = true;
            document.getElementById('rememberLogin').checked = false;
            document.getElementById('backupFrequency').value = 'daily';
            document.getElementById('dataRetention').value = '365';
            
            showNotification('Settings reset to defaults', 'success');
        }
    );
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all password fields', 'warning');
        return;
    }
    
    if (currentPassword !== 'admin123') {
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('New password must be at least 6 characters long', 'error');
        return;
    }
    
    // In a real application, you would hash and store the password securely
    showNotification('Password changed successfully. Please login again.', 'success');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Auto logout after password change
    setTimeout(() => {
        logout();
    }, 2000);
}

// Data management functions
function exportData(type) {
    let data, filename;
    
    switch(type) {
        case 'products':
            data = adminProducts;
            filename = 'freshmart-products.json';
            break;
        case 'orders':
            data = adminOrders;
            filename = 'freshmart-orders.json';
            break;
        case 'locations':
            data = adminLocations;
            filename = 'freshmart-locations.json';
            break;
        case 'all':
            data = {
                products: adminProducts,
                orders: adminOrders,
                locations: adminLocations,
                exportDate: new Date().toISOString()
            };
            filename = 'freshmart-complete-backup.json';
            break;
        case 'dashboard':
            const report = generateSalesReport(
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                new Date().toISOString().split('T')[0]
            );
            data = report;
            filename = 'freshmart-dashboard-report.json';
            break;
        case 'top-products':
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
            data = Object.entries(productSales).sort(([,a], [,b]) => b - a);
            filename = 'freshmart-top-products.json';
            break;
        default:
            showNotification('Invalid export type', 'error');
            return;
    }
    
    try {
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
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting data', 'error');
    }
}

function exportAllData() {
    exportData('all');
}

function clearOldData() {
    const retentionDays = parseInt(document.getElementById('dataRetention')?.value) || 365;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    
    showConfirmation(
        'Clear Old Data',
        `This will permanently delete all orders older than ${retentionDays} days. Are you sure?`,
        () => {
            const oldOrderCount = adminOrders.length;
            adminOrders = adminOrders.filter(order => new Date(order.date) > cutoffDate);
            const deletedCount = oldOrderCount - adminOrders.length;
            
            saveDataImmediately();
            loadOrdersTable();
            updateDashboardStats();
            
            showNotification(`Deleted ${deletedCount} old orders`, 'success');
        }
    );
}

// Auto-save functionality
function enableAutoSave(interval = 30000) {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    autoSaveInterval = setInterval(() => {
        const adminData = {
            products: adminProducts,
            orders: adminOrders,
            locations: adminLocations,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('freshmart_admin_data', JSON.stringify(adminData));
        localStorage.setItem('freshmart_data_updated', 'true');
        
        // Update sync status
        updateSyncStatus();
    }, interval);
}

function saveDataImmediately() {
    const adminData = {
        products: adminProducts,
        orders: adminOrders,
        locations: adminLocations,
        lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('freshmart_admin_data', JSON.stringify(adminData));
    localStorage.setItem('freshmart_data_updated', 'true');
    updateSyncStatus();
}

function loadAutoSavedData() {
    const savedData = localStorage.getItem('freshmart_admin_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.products) adminProducts = data.products;
            if (data.orders) adminOrders = data.orders;
            if (data.locations) adminLocations = data.locations;
            
            if (data.lastSaved) {
                console.log(`Data restored from ${new Date(data.lastSaved).toLocaleString()}`);
            }
        } catch (error) {
            console.error('Error loading auto-saved data:', error);
        }
    }
}

// Real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate new orders (5% chance every interval)
        if (Math.random() < 0.05) {
            const newOrder = generateRandomOrder();
            adminOrders.unshift(newOrder);
            
            if (document.getElementById('orders').classList.contains('active')) {
                loadOrdersTable();
            }
            
            updateDashboardStats();
            showNotification(`New order received: ${newOrder.id}`, 'info');
            
            addRecentActivity({
                type: 'new_order',
                message: `New order ${newOrder.id} from ${newOrder.customer}`,
                time: new Date().toISOString(),
                icon: 'fa-shopping-cart',
                color: '#3498db'
            });
        }
        
        // Simulate stock changes (3% chance every interval)
        if (Math.random() < 0.03) {
            const randomProduct = adminProducts[Math.floor(Math.random() * adminProducts.length)];
            const randomLocation = Object.keys(randomProduct.stock)[Math.floor(Math.random() * 6)];
            const stockChange = Math.floor(Math.random() * 10) - 5; // -5 to +5
            
            randomProduct.stock[randomLocation] = Math.max(0, randomProduct.stock[randomLocation] + stockChange);
            randomProduct.updatedAt = new Date().toISOString();
            
            if (document.getElementById('inventory').classList.contains('active')) {
                loadInventoryTable();
            }
            
            if (stockChange < 0) {
                addRecentActivity({
                    type: 'stock_change',
                    message: `Stock decreased for ${randomProduct.name} at ${randomLocation.replace('-', ' ')}`,
                    time: new Date().toISOString(),
                    icon: 'fa-arrow-down',
                    color: '#e74c3c'
                });
            }
        }
    }, 15000); // Every 15 seconds
}

function generateRandomOrder() {
    const customers = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Davis', 'Frank Wilson'];
    const locations = ['ikeja', 'victoria-island', 'surulere', 'lekki', 'ajah', 'yaba'];
    const statuses = ['pending', 'confirmed'];
    const deliveryTypes = ['pickup', 'delivery'];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDeliveryType = deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)];
    
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
    
    // Add delivery fee if applicable
    if (randomDeliveryType === 'delivery' && total < 25000) {
        total += 1500;
    }
    
    return {
        id: 'ORD' + Date.now().toString().slice(-6),
        customer: randomCustomer,
        phone: '+234812345' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        email: randomCustomer.toLowerCase().replace(' ', '.') + '@example.com',
        location: randomLocation,
        items: items,
        total: total,
        status: randomStatus,
        date: new Date().toISOString(),
        deliveryType: randomDeliveryType,
        deliveryAddress: randomDeliveryType === 'delivery' ? 
            `${Math.floor(Math.random() * 999) + 1} Random Street, Lagos` : '',
        notes: Math.random() > 0.7 ? 'Please call before delivery' : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
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

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
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

function addRecentActivity(activity) {
    // Add to a global activities array (you might want to persist this)
    if (!window.recentActivities) {
        window.recentActivities = [];
    }
    
    window.recentActivities.unshift(activity);
    
    // Keep only last 20 activities
    if (window.recentActivities.length > 20) {
        window.recentActivities = window.recentActivities.slice(0, 20);
    }
    
    // Update display if on dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
        loadRecentActivity();
    }
}

// UI Helper functions
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showConfirmation(title, message, callback) {
    const dialog = document.getElementById('confirmationDialog');
    const titleEl = document.getElementById('confirmationTitle');
    const messageEl = document.getElementById('confirmationMessage');
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    confirmationCallback = callback;
    
    if (dialog) {
        dialog.style.display = 'flex';
    }
}

function closeConfirmation() {
    const dialog = document.getElementById('confirmationDialog');
    if (dialog) {
        dialog.style.display = 'none';
    }
    confirmationCallback = null;
}

function confirmAction() {
    if (confirmationCallback) {
        confirmationCallback();
    }
    closeConfirmation();
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to notification container
    const container = document.getElementById('notificationContainer');
    if (container) {
        container.appendChild(notification);
    } else {
        // Fallback: add to body
        document.body.appendChild(notification);
    }
    
    // Position notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : 
                     type === 'error' ? '#f8d7da' : 
                     type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : 
                 type === 'error' ? '#721c24' : 
                 type === 'warning' ? '#856404' : '#0c5460'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : 
                           type === 'error' ? '#f5c6cb' : 
                           type === 'warning' ? '#ffeaa7' : '#bee5eb'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Quick actions
function toggleQuickActions() {
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        quickActions.classList.toggle('open');
    }
}

// Keyboard shortcuts
function toggleShortcutsHelp() {
    const shortcutsHelp = document.getElementById('shortcutsHelp');
    if (shortcutsHelp) {
        const isVisible = shortcutsHelp.style.display !== 'none';
        shortcutsHelp.style.display = isVisible ? 'none' : 'block';
    }
}

// System information
function showSystemInfo() {
    updateSystemInfo();
    const modal = document.getElementById('systemInfoModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
    }
}

function updateSystemInfo() {
    // Update database counts
    const dbProductCount = document.getElementById('dbProductCount');
    const dbOrderCount = document.getElementById('dbOrderCount');
    const dbLocationCount = document.getElementById('dbLocationCount');
    
    if (dbProductCount) dbProductCount.textContent = adminProducts.length;
    if (dbOrderCount) dbOrderCount.textContent = adminOrders.length;
    if (dbLocationCount) dbLocationCount.textContent = adminLocations.length;
    
    // Update last sync time
    const lastSyncTime = document.getElementById('lastSyncTime');
    const savedData = localStorage.getItem('freshmart_admin_data');
    if (lastSyncTime && savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.lastSaved) {
                lastSyncTime.textContent = new Date(data.lastSaved).toLocaleString();
            }
        } catch (error) {
            lastSyncTime.textContent = 'Error reading sync time';
        }
    }
    
    // Update data size
    const dataSize = document.getElementById('dataSize');
    if (dataSize) {
        const totalSize = JSON.stringify({
            products: adminProducts,
            orders: adminOrders,
            locations: adminLocations
        }).length;
        dataSize.textContent = `${Math.round(totalSize / 1024)} KB`;
    }
    
    // Update session duration
    const sessionDuration = document.getElementById('sessionDuration');
    if (sessionDuration && sessionStartTime) {
        const duration = Math.floor((new Date() - sessionStartTime) / (1000 * 60));
        sessionDuration.textContent = `${duration} minutes`;
    }
    
    // Update browser info
    const userAgent = document.getElementById('userAgent');
    const screenResolution = document.getElementById('screenResolution');
    const timezone = document.getElementById('timezone');
    
    if (userAgent) userAgent.textContent = navigator.userAgent.substring(0, 50) + '...';
    if (screenResolution) screenResolution.textContent = `${screen.width}x${screen.height}`;
    if (timezone) timezone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function clearCache() {
    showConfirmation(
        'Clear Cache',
        'This will clear all cached data and settings. Are you sure?',
        () => {
            localStorage.removeItem('freshmart_admin_data');
            localStorage.removeItem('freshmart_admin_settings');
            localStorage.removeItem('freshmart_data_updated');
            localStorage.removeItem('freshmart_last_sync');
            
            showNotification('Cache cleared successfully', 'success');
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    );
}

function downloadLogs() {
    const logs = {
        systemInfo: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        dataStats: {
            products: adminProducts.length,
            orders: adminOrders.length,
            locations: adminLocations.length
        },
        recentActivities: window.recentActivities || [],
        sessionInfo: {
            startTime: sessionStartTime?.toISOString(),
            duration: sessionStartTime ? Math.floor((new Date() - sessionStartTime) / (1000 * 60)) : 0,
            user: currentUser?.username
        }
    };
    
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshmart-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Logs downloaded successfully', 'success');
}

function resetSystem() {
    showConfirmation(
        'Reset System',
        'This will delete ALL data and reset the system to default state. This action cannot be undone!',
        () => {
            // Clear all data
            localStorage.clear();
            
            // Reset to sample data
            adminProducts = [...sampleAdminData.products];
            adminOrders = [...sampleAdminData.orders];
            adminLocations = [...sampleAdminData.locations];
            
            // Save initial data
            saveDataImmediately();
            
            showNotification('System reset successfully', 'success');
            
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    );
}

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
    
    openPrintWindow(`FreshMart ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, content);
}

function openPrintWindow(title, content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    color: #333;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0; 
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px; 
                    text-align: left; 
                }
                th { 
                    background-color: #f2f2f2; 
                    font-weight: bold;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                .date { 
                    color: #666; 
                    font-size: 0.9em;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                .summary-item {
                    text-align: center;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .summary-number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .financial-summary {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                }
                .financial-item {
                    text-align: center;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    flex: 1;
                    margin: 0 10px;
                }
                .order-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }
                .order-section {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 5px;
                }
                .order-section.full-width {
                    grid-column: 1 / -1;
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    padding: 5px 0;
                    border-bottom: 1px dotted #ccc;
                }
                .order-items-table {
                    width: 100%;
                    margin-top: 10px;
                }
                .order-items-table tfoot td {
                    font-weight: bold;
                    background-color: #f8f9fa;
                }
                @media print { 
                    .no-print { display: none; } 
                    body { margin: 0; }
                    .header { page-break-after: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${title}</h1>
                <p class="date">Generated on ${new Date().toLocaleString()}</p>
                <p>FreshMart Admin System</p>
            </div>
            ${content}
            <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Print Report
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    Close
                </button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function generateInventoryReport() {
    return `
        <h2>Inventory Report</h2>
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Total Stock</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                </tr>
            </thead>
            <tbody>
                ${adminProducts.map(product => {
                    const totalStock = Object.values(product.stock).reduce((sum, stock) => sum + stock, 0);
                    return `
                        <tr>
                            <td>${product.name}</td>
                            <td style="text-transform: capitalize;">${product.category}</td>
                            <td>₦${product.price.toLocaleString()}</td>
                            <td>${totalStock}</td>
                            <td>${getOverallStockStatus(product.stock).replace('-', ' ')}</td>
                            <td>${new Date(product.updatedAt).toLocaleDateString()}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <h3>Stock by Location</h3>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    ${adminLocations.map(location => `<th>${location.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${adminProducts.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        ${adminLocations.map(location => 
                            `<td>${product.stock[location.id] || 0}</td>`
                        ).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateOrdersReport() {
    return `
        <h2>Orders Report</h2>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${adminOrders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer}<br><small>${order.phone}</small></td>
                        <td style="text-transform: capitalize;">${order.location.replace('-', ' ')}</td>
                        <td style="text-transform: capitalize;">${order.deliveryType}</td>
                        <td>₦${order.total.toLocaleString()}</td>
                        <td style="text-transform: capitalize;">${order.status}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <h3>Order Summary</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <h4>Total Orders</h4>
                <div class="summary-number">${adminOrders.length}</div>
            </div>
            <div class="summary-item">
                <h4>Total Revenue</h4>
                <div class="summary-number">₦${adminOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <h4>Average Order</h4>
                <div class="summary-number">₦${Math.round(adminOrders.reduce((sum, order) => sum + order.total, 0) / adminOrders.length).toLocaleString()}</div>
            </div>
        </div>
    `;
}

function generateSalesReportHTML() {
    const report = generateSalesReport(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
    );
    
    return `
        <h2>Sales Report (Last 30 Days)</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <h4>Total Orders</h4>
                <div class="summary-number">${report.totalOrders}</div>
            </div>
            <div class="summary-item">
                <h4>Total Revenue</h4>
                <div class="summary-number">₦${report.totalRevenue.toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <h4>Average Order Value</h4>
                <div class="summary-number">₦${Math.round(report.averageOrderValue).toLocaleString()}</div>
            </div>
        </div>
        
        <h3>Sales by Location</h3>
        <table>
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Orders</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report.ordersByLocation)
                    .sort(([,a], [,b]) => b - a)
                    .map(([location, orders]) => `
                        <tr>
                            <td style="text-transform: capitalize;">${location.replace('-', ' ')}</td>
                            <td>${orders}</td>
                            <td>${((orders / report.totalOrders) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
            </tbody>
        </table>
        
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
        
        <h3>Order Status Distribution</h3>
        <table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report.ordersByStatus)
                    .map(([status, count]) => `
                        <tr>
                            <td style="text-transform: capitalize;">${status}</td>
                            <td>${count}</td>
                            <td>${((count / report.totalOrders) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
            </tbody>
        </table>
    `;
}

// Dashboard filter function
function filterDashboardData() {
    const dateFrom = document.getElementById('dateFrom')?.value;
    const dateTo = document.getElementById('dateTo')?.value;
    
    if (dateFrom && dateTo) {
        // Filter data based on date range and update dashboard
        const filteredOrders = adminOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= new Date(dateFrom) && orderDate <= new Date(dateTo);
        });
        
        // Update stats with filtered data
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalRevenue').textContent = `₦${totalRevenue.toLocaleString()}`;
        
        showNotification(`Dashboard filtered for ${dateFrom} to ${dateTo}`, 'info');
    } else {
        showNotification('Please select both start and end dates', 'warning');
    }
}

// Initialize real-time updates and auto-save when dashboard loads
document.addEventListener('DOMContentLoaded', function() {
    // Load settings on startup
    setTimeout(() => {
        loadSettings();
    }, 500);
    
    // Start real-time updates simulation after a delay
    setTimeout(() => {
        simulateRealTimeUpdates();
    }, 5000);
    
    // Update system info periodically
    setInterval(() => {
        updateSystemInfo();
    }, 60000); // Every minute
    
    // Session timeout handling
    let sessionTimeoutId;
    
    function resetSessionTimeout() {
        clearTimeout(sessionTimeoutId);
        const timeoutMinutes = parseInt(document.getElementById('sessionTimeout')?.value) || 60;
        const autoLogoutEnabled = document.getElementById('autoLogout')?.checked !== false;
        
        if (autoLogoutEnabled && currentUser) {
            sessionTimeoutId = setTimeout(() => {
                showNotification('Session expired. Please login again.', 'warning');
                setTimeout(logout, 2000);
            }, timeoutMinutes * 60 * 1000);
        }
    }
    
    // Reset timeout on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimeout, true);
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', function(e) {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // Save data one final time
    if (currentUser) {
        saveDataImmediately();
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An error occurred while processing data.', 'error');
});

// Export global functions for HTML onclick handlers
window.showSection = showSection;
window.logout = logout;
window.showAddProductModal = showAddProductModal;
window.showAddLocationModal = showAddLocationModal;
window.closeModal = closeModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editLocation = editLocation;
window.deleteLocation = deleteLocation;
window.updateProductStock = updateProductStock;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;
window.showOrderDetails = showOrderDetails;
window.printOrderDetails = printOrderDetails;
window.toggleProductSelection = toggleProductSelection;
window.toggleSelectAllProducts = toggleSelectAllProducts;
window.bulkUpdateStock = bulkUpdateStock;
window.bulkDeleteProducts = bulkDeleteProducts;
window.applyBulkUpdate = applyBulkUpdate;
window.changePage = changePage;
window.goToPage = goToPage;
window.changeOrdersPage = changeOrdersPage;
window.goToOrdersPage = goToOrdersPage;
window.generateAnalytics = generateAnalytics;
window.generateReport = generateReport;
window.showSettingsTab = showSettingsTab;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.changePassword = changePassword;
window.exportData = exportData;
window.exportAllData = exportAllData;
window.clearOldData = clearOldData;
window.toggleQuickActions = toggleQuickActions;
window.toggleShortcutsHelp = toggleShortcutsHelp;
window.showSystemInfo = showSystemInfo;
window.clearCache = clearCache;
window.downloadLogs = downloadLogs;
window.resetSystem = resetSystem;
window.printReport = printReport;
window.filterDashboardData = filterDashboardData;
window.closeConfirmation = closeConfirmation;
window.confirmAction = confirmAction;

// Additional utility functions for enhanced functionality

// Advanced search functionality
function performAdvancedSearch(searchTerm, searchType = 'all') {
    const results = {
        products: [],
        orders: [],
        customers: []
    };
    
    const term = searchTerm.toLowerCase();
    
    if (searchType === 'all' || searchType === 'products') {
        results.products = adminProducts.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    }
    
    if (searchType === 'all' || searchType === 'orders') {
        results.orders = adminOrders.filter(order =>
            order.id.toLowerCase().includes(term) ||
            order.customer.toLowerCase().includes(term) ||
            order.phone.includes(term) ||
            (order.email && order.email.toLowerCase().includes(term))
        );
    }
    
    if (searchType === 'all' || searchType === 'customers') {
        const customers = {};
        adminOrders.forEach(order => {
            const key = order.customer.toLowerCase();
            if (key.includes(term) || order.phone.includes(term) || 
                (order.email && order.email.toLowerCase().includes(term))) {
                if (!customers[order.customer]) {
                    customers[order.customer] = {
                        name: order.customer,
                        phone: order.phone,
                        email: order.email,
                        orders: 0,
                        totalSpent: 0
                    };
                }
                customers[order.customer].orders++;
                customers[order.customer].totalSpent += order.total;
            }
        });
        results.customers = Object.values(customers);
    }
    
    return results;
}

// Data validation functions
function validateProductData(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.trim().length < 2) {
        errors.push('Product name must be at least 2 characters long');
    }
    
    if (!productData.category) {
        errors.push('Product category is required');
    }
    
    if (!productData.price || productData.price <= 0) {
        errors.push('Product price must be greater than 0');
    }
    
    if (!productData.unit || productData.unit.trim().length < 1) {
        errors.push('Product unit is required');
    }
    
    // Validate stock values
    Object.entries(productData.stock).forEach(([location, stock]) => {
        if (stock < 0) {
            errors.push(`Stock for ${location} cannot be negative`);
        }
    });
    
    return errors;
}

function validateOrderData(orderData) {
    const errors = [];
    
    if (!orderData.customer || orderData.customer.trim().length < 2) {
        errors.push('Customer name must be at least 2 characters long');
    }
    
    if (!orderData.phone || !/^\+?[\d\s\-\(\)]{10,}$/.test(orderData.phone)) {
        errors.push('Valid phone number is required');
    }
    
    if (orderData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
        errors.push('Valid email address is required');
    }
    
    if (!orderData.location) {
        errors.push('Location is required');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
        errors.push('At least one item is required');
    }
    
    if (orderData.deliveryType === 'delivery' && !orderData.deliveryAddress) {
        errors.push('Delivery address is required for delivery orders');
    }
    
    return errors;
}

// Data import functionality
function importData(type, file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate imported data structure
                const validationResult = validateImportedData(type, importedData);
                if (!validationResult.isValid) {
                    reject(new Error(validationResult.errors.join(', ')));
                    return;
                }
                
                switch(type) {
                    case 'products':
                        // Merge with existing products, avoiding duplicates
                        const existingIds = adminProducts.map(p => p.id);
                        const newProducts = importedData.filter(p => !existingIds.includes(p.id));
                        adminProducts.push(...newProducts);
                        loadInventoryTable();
                        break;
                        
                    case 'orders':
                        const existingOrderIds = adminOrders.map(o => o.id);
                        const newOrders = importedData.filter(o => !existingOrderIds.includes(o.id));
                        adminOrders.push(...newOrders);
                        loadOrdersTable();
                        break;
                        
                    case 'locations':
                        const existingLocationIds = adminLocations.map(l => l.id);
                        const newLocations = importedData.filter(l => !existingLocationIds.includes(l.id));
                        adminLocations.push(...newLocations);
                        loadLocationsGrid();
                        break;
                        
                    case 'complete':
                        if (importedData.products) adminProducts = importedData.products;
                        if (importedData.orders) adminOrders = importedData.orders;
                        if (importedData.locations) adminLocations = importedData.locations;
                        loadDashboardData();
                        break;
                }
                
                saveDataImmediately();
                resolve(`${type} data imported successfully`);
                
            } catch (error) {
                reject(new Error('Invalid file format: ' + error.message));
            }
        };
        reader.readAsText(file);
    });
}

function validateImportedData(type, data) {
    const result = { isValid: true, errors: [] };
    
    if (!Array.isArray(data) && type !== 'complete') {
        result.isValid = false;
        result.errors.push('Data must be an array');
        return result;
    }
    
    switch(type) {
        case 'products':
            data.forEach((item, index) => {
                if (!item.id || !item.name || !item.category || !item.price || !item.stock) {
                    result.errors.push(`Product at index ${index} is missing required fields`);
                }
            });
            break;
            
        case 'orders':
            data.forEach((item, index) => {
                if (!item.id || !item.customer || !item.phone || !item.location || !item.items) {
                    result.errors.push(`Order at index ${index} is missing required fields`);
                }
            });
            break;
            
        case 'locations':
            data.forEach((item, index) => {
                if (!item.id || !item.name || !item.address || !item.phone) {
                    result.errors.push(`Location at index ${index} is missing required fields`);
                }
            });
            break;
            
        case 'complete':
            if (!data.products && !data.orders && !data.locations) {
                result.errors.push('Complete backup must contain at least one data type');
            }
            break;
    }
    
    if (result.errors.length > 0) {
        result.isValid = false;
    }
    
    return result;
}

// Advanced analytics functions
function generateAdvancedAnalytics(dateRange) {
    const { startDate, endDate } = dateRange;
    const filteredOrders = adminOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
    
    return {
        salesTrends: calculateSalesTrends(filteredOrders),
        customerSegmentation: analyzeCustomerSegmentation(filteredOrders),
        productPerformance: analyzeProductPerformance(filteredOrders),
        locationAnalysis: analyzeLocationPerformance(filteredOrders),
        seasonalPatterns: analyzeSeasonalPatterns(filteredOrders),
        profitabilityAnalysis: analyzeProfitability(filteredOrders)
    };
}

function calculateSalesTrends(orders) {
    const dailySales = {};
    const weeklySales = {};
    const monthlySales = {};
    
    orders.forEach(order => {
        const date = new Date(order.date);
        const dayKey = date.toDateString();
        const weekKey = getWeekKey(date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        dailySales[dayKey] = (dailySales[dayKey] || 0) + order.total;
        weeklySales[weekKey] = (weeklySales[weekKey] || 0) + order.total;
        monthlySales[monthKey] = (monthlySales[monthKey] || 0) + order.total;
    });
    
    return { dailySales, weeklySales, monthlySales };
}

function analyzeCustomerSegmentation(orders) {
    const customers = {};
    
    orders.forEach(order => {
        if (!customers[order.customer]) {
            customers[order.customer] = {
                name: order.customer,
                orders: 0,
                totalSpent: 0,
                averageOrderValue: 0,
                lastOrderDate: order.date,
                preferredLocation: {},
                preferredDeliveryType: {}
            };
        }
        
        const customer = customers[order.customer];
        customer.orders++;
        customer.totalSpent += order.total;
        customer.averageOrderValue = customer.totalSpent / customer.orders;
        
        if (new Date(order.date) > new Date(customer.lastOrderDate)) {
            customer.lastOrderDate = order.date;
        }
        
        customer.preferredLocation[order.location] = (customer.preferredLocation[order.location] || 0) + 1;
        customer.preferredDeliveryType[order.deliveryType] = (customer.preferredDeliveryType[order.deliveryType] || 0) + 1;
    });
    
    // Segment customers
    const customerArray = Object.values(customers);
    const segments = {
        vip: customerArray.filter(c => c.totalSpent > 50000),
        regular: customerArray.filter(c => c.totalSpent > 10000 && c.totalSpent <= 50000),
        occasional: customerArray.filter(c => c.totalSpent <= 10000)
    };
    
    return segments;
}

function analyzeProductPerformance(orders) {
    const productStats = {};
    
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productStats[item.name]) {
                productStats[item.name] = {
                    name: item.name,
                    totalQuantity: 0,
                    totalRevenue: 0,
                    orderCount: 0,
                    averageQuantityPerOrder: 0
                };
            }
            
            const stats = productStats[item.name];
            stats.totalQuantity += item.quantity;
            stats.totalRevenue += item.quantity * item.price;
            stats.orderCount++;
            stats.averageQuantityPerOrder = stats.totalQuantity / stats.orderCount;
        });
    });
    
    return Object.values(productStats).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

function analyzeLocationPerformance(orders) {
    const locationStats = {};
    
    orders.forEach(order => {
        if (!locationStats[order.location]) {
            locationStats[order.location] = {
                location: order.location,
                orderCount: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                deliveryOrders: 0,
                pickupOrders: 0
            };
        }
        
        const stats = locationStats[order.location];
        stats.orderCount++;
        stats.totalRevenue += order.total;
        stats.averageOrderValue = stats.totalRevenue / stats.orderCount;
        
        if (order.deliveryType === 'delivery') {
            stats.deliveryOrders++;
        } else {
            stats.pickupOrders++;
        }
    });
    
    return Object.values(locationStats).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

function analyzeSeasonalPatterns(orders) {
    const patterns = {
        hourly: {},
        daily: {},
        monthly: {}
    };
    
    orders.forEach(order => {
        const date = new Date(order.date);
        const hour = date.getHours();
        const day = date.getDay(); // 0 = Sunday
        const month = date.getMonth(); // 0 = January
        
        patterns.hourly[hour] = (patterns.hourly[hour] || 0) + order.total;
        patterns.daily[day] = (patterns.daily[day] || 0) + order.total;
        patterns.monthly[month] = (patterns.monthly[month] || 0) + order.total;
    });
    
    return patterns;
}

function analyzeProfitability(orders) {
    // Simplified profitability analysis
    // In a real system, you'd have cost data for products
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const estimatedCosts = totalRevenue * 0.7; // Assume 70% cost ratio
    const estimatedProfit = totalRevenue - estimatedCosts;
    const profitMargin = (estimatedProfit / totalRevenue) * 100;
    
    return {
        totalRevenue,
        estimatedCosts,
        estimatedProfit,
        profitMargin
    };
}

function getWeekKey(date) {
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return `${year}-W${week}`;
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Inventory optimization functions
function analyzeInventoryOptimization() {
    const analysis = {
        overstockedItems: [],
        understockedItems: [],
        optimalStockLevels: {},
        reorderRecommendations: []
    };
    
    adminProducts.forEach(product => {
        const totalStock = Object.values(product.stock).reduce((sum, stock) => sum + stock, 0);
        const salesVelocity = calculateSalesVelocity(product.name);
        const daysOfStock = salesVelocity > 0 ? totalStock / salesVelocity : Infinity;
        
        // Determine if overstocked (more than 60 days of stock)
        if (daysOfStock > 60) {
            analysis.overstockedItems.push({
                product: product.name,
                currentStock: totalStock,
                daysOfStock: Math.round(daysOfStock),
                recommendation: 'Reduce ordering or run promotion'
            });
        }
        
        // Determine if understocked (less than 7 days of stock)
        if (daysOfStock < 7 && daysOfStock > 0) {
            analysis.understockedItems.push({
                product: product.name,
                currentStock: totalStock,
                daysOfStock: Math.round(daysOfStock),
                recommendation: 'Increase stock immediately'
            });
        }
        
        // Calculate optimal stock level (30 days of stock)
        const optimalStock = Math.ceil(salesVelocity * 30);
        analysis.optimalStockLevels[product.name] = optimalStock;
        
        // Generate reorder recommendations
        if (totalStock < optimalStock * 0.5) {
            analysis.reorderRecommendations.push({
                product: product.name,
                currentStock: totalStock,
                recommendedOrder: optimalStock - totalStock,
                priority: daysOfStock < 7 ? 'High' : 'Medium'
            });
        }
    });
    
    return analysis;
}

function calculateSalesVelocity(productName) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = adminOrders.filter(order => new Date(order.date) >= thirtyDaysAgo);
    
    let totalSold = 0;
    recentOrders.forEach(order => {
        order.items.forEach(item => {
            if (item.name === productName) {
                totalSold += item.quantity;
            }
        });
    });
    
    return totalSold / 30; // Average daily sales
}

// Advanced reporting functions
function generateExecutiveSummary(dateRange) {
    const { startDate, endDate } = dateRange;
    const filteredOrders = adminOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
    
    const summary = {
        period: `${startDate} to ${endDate}`,
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: 0,
        topPerformingLocation: null,
        topSellingProduct: null,
        customerGrowth: 0,
        revenueGrowth: 0,
        keyInsights: []
    };
    
    // Calculate average order value
    summary.averageOrderValue = summary.totalOrders > 0 ? summary.totalRevenue / summary.totalOrders : 0;
    
    // Find top performing location
    const locationPerformance = {};
    filteredOrders.forEach(order => {
        locationPerformance[order.location] = (locationPerformance[order.location] || 0) + order.total;
    });
    summary.topPerformingLocation = Object.entries(locationPerformance)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    // Find top selling product
    const productSales = {};
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            productSales[item.name] = (productSales[item.name] || 0) + (item.quantity * item.price);
        });
    });
    summary.topSellingProduct = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    // Calculate growth metrics (compare with previous period)
    const periodLength = new Date(endDate) - new Date(startDate);
    const previousStartDate = new Date(new Date(startDate) - periodLength);
    const previousEndDate = new Date(startDate);
    
    const previousOrders = adminOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= previousStartDate && orderDate < previousEndDate;
    });
    
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const previousCustomers = new Set(previousOrders.map(order => order.customer)).size;
    const currentCustomers = new Set(filteredOrders.map(order => order.customer)).size;
    
    summary.revenueGrowth = previousRevenue > 0 ? 
        ((summary.totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    summary.customerGrowth = previousCustomers > 0 ? 
        ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0;
    
    // Generate key insights
    if (summary.revenueGrowth > 10) {
        summary.keyInsights.push('Strong revenue growth indicates successful business expansion');
    } else if (summary.revenueGrowth < -5) {
        summary.keyInsights.push('Revenue decline requires immediate attention and strategy review');
    }
    
    if (summary.averageOrderValue > 15000) {
        summary.keyInsights.push('High average order value suggests effective upselling strategies');
    }
    
    if (currentCustomers > previousCustomers * 1.2) {
        summary.keyInsights.push('Significant customer acquisition growth');
    }
    
    return summary;
}

// Data backup and restore functions
function createSystemBackup() {
    const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
            products: adminProducts,
            orders: adminOrders,
            locations: adminLocations
        },
        settings: JSON.parse(localStorage.getItem('freshmart_admin_settings') || '{}'),
        metadata: {
            totalProducts: adminProducts.length,
            totalOrders: adminOrders.length,
            totalLocations: adminLocations.length,
            backupSize: JSON.stringify({
                products: adminProducts,
                orders: adminOrders,
                locations: adminLocations
            }).length
        }
    };
    
    return backup;
}

function restoreSystemBackup(backupData) {
    return new Promise((resolve, reject) => {
        try {
            // Validate backup structure
            if (!backupData.data || !backupData.data.products || !backupData.data.orders || !backupData.data.locations) {
                throw new Error('Invalid backup file structure');
            }
            
            // Restore data
            adminProducts = backupData.data.products;
            adminOrders = backupData.data.orders;
            adminLocations = backupData.data.locations;
            
            // Restore settings if available
            if (backupData.settings) {
                localStorage.setItem('freshmart_admin_settings', JSON.stringify(backupData.settings));
            }
            
            // Save restored data
            saveDataImmediately();
            
            // Refresh all displays
            loadDashboardData();
            
            resolve('System backup restored successfully');
        } catch (error) {
            reject(error);
        }
    });
}

// Performance monitoring functions
function monitorSystemPerformance() {
    const performance = {
        dataSize: calculateDataSize(),
        loadTimes: measureLoadTimes(),
        memoryUsage: estimateMemoryUsage(),
        recommendations: []
    };
    
    // Generate performance recommendations
    if (performance.dataSize > 5000000) { // 5MB
        performance.recommendations.push('Consider implementing data archiving for old orders');
    }
    
    if (adminProducts.length > 1000) {
        performance.recommendations.push('Large product catalog may benefit from pagination optimization');
    }
    
    if (adminOrders.length > 5000) {
        performance.recommendations.push('Consider archiving orders older than 1 year');
    }
    
    return performance;
}

function calculateDataSize() {
    const data = {
        products: adminProducts,
        orders: adminOrders,
        locations: adminLocations
    };
    return JSON.stringify(data).length;
}

function measureLoadTimes() {
    const start = performance.now();
    
    // Simulate data processing
    getFilteredProducts();
    getFilteredOrders();
    
    const end = performance.now();
    return {
        dataProcessing: Math.round(end - start),
        lastMeasurement: new Date().toISOString()
    };
}

function estimateMemoryUsage() {
    // Rough estimation of memory usage
    const productMemory = adminProducts.length * 1000; // ~1KB per product
    const orderMemory = adminOrders.length * 500; // ~500B per order
    const locationMemory = adminLocations.length * 200; // ~200B per location
    
    return {
        products: productMemory,
        orders: orderMemory,
        locations: locationMemory,
        total: productMemory + orderMemory + locationMemory,
        unit: 'bytes'
    };
}

// Automated alerts system
function checkSystemAlerts() {
    const alerts = [];
    
    // Check for low stock items
    const lowStockThreshold = parseInt(document.getElementById('lowStockThreshold')?.value) || 10;
    adminProducts.forEach(product => {
        Object.entries(product.stock).forEach(([location, stock]) => {
            if (stock <= lowStockThreshold && stock > 0) {
                alerts.push({
                    type: 'low_stock',
                    severity: 'warning',
                    message: `Low stock alert: ${product.name} at ${location.replace('-', ' ')} (${stock} remaining)`,
                    product: product.name,
                    location: location,
                    stock: stock
                });
            } else if (stock === 0) {
                alerts.push({
                    type: 'out_of_stock',
                    severity: 'critical',
                    message: `Out of stock: ${product.name} at ${location.replace('-', ' ')}`,
                    product: product.name,
                    location: location,
                    stock: stock
                });
            }
        });
    });
    
    // Check for pending orders older than 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oldPendingOrders = adminOrders.filter(order => 
        order.status === 'pending' && new Date(order.date) < oneDayAgo
    );
    
    oldPendingOrders.forEach(order => {
        alerts.push({
            type: 'old_pending_order',
            severity: 'warning',
            message: `Order ${order.id} has been pending for over 24 hours`,
            orderId: order.id,
            customer: order.customer,
            age: Math.floor((new Date() - new Date(order.date)) / (1000 * 60 * 60))
        });
    });
    
    // Check for system performance issues
    const dataSize = calculateDataSize();
    if (dataSize > 10000000) { // 10MB
        alerts.push({
            type: 'performance',
            severity: 'info',
            message: 'Large data size detected. Consider archiving old data.',
            dataSize: Math.round(dataSize / 1000000) + 'MB'
        });
    }
    
    return alerts;
}

function displaySystemAlerts() {
    const alerts = checkSystemAlerts();
    
    alerts.forEach(alert => {
        if (alert.severity === 'critical') {
            showNotification(alert.message, 'error');
        } else if (alert.severity === 'warning') {
            showNotification(alert.message, 'warning');
        }
    });
    
    return alerts;
}

// Initialize alert checking
setInterval(() => {
    if (currentUser && document.getElementById('dashboard').classList.contains('active')) {
        displaySystemAlerts();
    }
}, 300000); // Check every 5 minutes

// Final initialization and cleanup
console.log('FreshMart Admin System initialized successfully');

// Export additional functions for potential external use
window.performAdvancedSearch = performAdvancedSearch;
window.importData = importData;
window.generateAdvancedAnalytics = generateAdvancedAnalytics;
window.analyzeInventoryOptimization = analyzeInventoryOptimization;
window.generateExecutiveSummary = generateExecutiveSummary;
window.createSystemBackup = createSystemBackup;
window.restoreSystemBackup = restoreSystemBackup;
window.monitorSystemPerformance = monitorSystemPerformance;
window.checkSystemAlerts = checkSystemAlerts;
window.displaySystemAlerts = displaySystemAlerts;

// Add final event listeners for file uploads (if needed)
document.addEventListener('DOMContentLoaded', function() {
    // Add drag and drop functionality for file imports
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                const dataType = zone.dataset.type;
                
                if (file.type === 'application/json') {
                    importData(dataType, file)
                        .then(message => showNotification(message, 'success'))
                        .catch(error => showNotification(error.message, 'error'));
                } else {
                    showNotification('Please upload a JSON file', 'error');
                }
            }
        });
    });
});

// Performance optimization: Lazy loading for large datasets
function implementLazyLoading() {
    // This would be implemented for very large datasets
    // For now, we use pagination which is sufficient
    console.log('Lazy loading optimization ready');
}

// Final system status
console.log(`
🎉 FreshMart Admin System Ready!
📊 Products: ${adminProducts.length}
📦 Orders: ${adminOrders.length}
🏪 Locations: ${adminLocations.length}
💾 Data Size: ${Math.round(calculateDataSize() / 1024)}KB
⚡ Performance: Optimized
🔒 Security: Basic Authentication
🔄 Auto-save: ${autoSaveInterval ? 'Enabled' : 'Disabled'}
`);

// Service Worker registration for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Progressive Web App (PWA) functionality
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button/banner
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: #3498db; color: white; padding: 1rem; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <p style="margin: 0 0 0.5rem 0;">Install FreshMart Admin as an app?</p>
            <button onclick="installPWA()" style="background: white; color: #3498db; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">Install</button>
            <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Later</button>
        </div>
    `;
    document.body.appendChild(installBanner);
});

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                showNotification('App installed successfully!', 'success');
            }
            deferredPrompt = null;
        });
    }
}

// Advanced error handling and logging
class ErrorLogger {
    static log(error, context = '') {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            user: currentUser?.username || 'anonymous'
        };
        
        // Store in localStorage for later analysis
        const existingLogs = JSON.parse(localStorage.getItem('freshmart_error_logs') || '[]');
        existingLogs.push(errorLog);
        
        // Keep only last 50 errors
        if (existingLogs.length > 50) {
            existingLogs.splice(0, existingLogs.length - 50);
        }
        
        localStorage.setItem('freshmart_error_logs', JSON.stringify(existingLogs));
        
        console.error('Error logged:', errorLog);
    }
    
    static getLogs() {
        return JSON.parse(localStorage.getItem('freshmart_error_logs') || '[]');
    }
    
    static clearLogs() {
        localStorage.removeItem('freshmart_error_logs');
    }
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    ErrorLogger.log(e.error, 'Global error handler');
});

window.addEventListener('unhandledrejection', function(e) {
    ErrorLogger.log(new Error(e.reason), 'Unhandled promise rejection');
});

// Data synchronization with external APIs (placeholder for future implementation)
class DataSync {
    static async syncWithServer() {
        // Placeholder for server synchronization
        console.log('Server sync would be implemented here');
        return Promise.resolve();
    }
    
    static async backupToCloud() {
        // Placeholder for cloud backup
        console.log('Cloud backup would be implemented here');
        return Promise.resolve();
    }
    
    static async restoreFromCloud() {
        // Placeholder for cloud restore
        console.log('Cloud restore would be implemented here');
        return Promise.resolve();
    }
}

// Advanced search with fuzzy matching
function fuzzySearch(query, items, keys) {
    const fuse = new Fuse(items, {
        keys: keys,
        threshold: 0.3,
        includeScore: true
    });
    
    return fuse.search(query);
}

// Real-time collaboration features (placeholder)
class Collaboration {
    static init() {
        // Placeholder for real-time collaboration features
        console.log('Collaboration features would be initialized here');
    }
    
    static broadcastChange(changeType, data) {
        // Placeholder for broadcasting changes to other users
        console.log('Broadcasting change:', changeType, data);
    }
    
    static onRemoteChange(callback) {
        // Placeholder for handling remote changes
        console.log('Remote change handler registered');
    }
}

// Mobile-specific optimizations
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Reduce auto-save frequency on mobile to save battery
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            enableAutoSave(60000); // 1 minute instead of 30 seconds
        }
        
        // Reduce real-time update frequency
        console.log('Mobile optimizations applied');
    }
}

// Battery API optimization (if supported)
if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        function updateBatteryOptimizations() {
            if (battery.level < 0.2) { // Less than 20% battery
                // Reduce background operations
                if (autoSaveInterval) {
                    clearInterval(autoSaveInterval);
                    enableAutoSave(120000); // 2 minutes
                }
                showNotification('Battery saver mode activated', 'info');
            }
        }
        
        battery.addEventListener('levelchange', updateBatteryOptimizations);
        updateBatteryOptimizations();
    });
}

// Accessibility enhancements
function enhanceAccessibility() {
    // Add ARIA labels to dynamic content
    document.querySelectorAll('.stat-card h3').forEach(element => {
        element.setAttribute('aria-live', 'polite');
    });
    
    // Add keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                const focusableElements = activeModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });
    
    console.log('Accessibility enhancements applied');
}

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Theme management
class ThemeManager {
    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('freshmart_theme', theme);
    }
    
    static getTheme() {
        return localStorage.getItem('freshmart_theme') || 'light';
    }
    
    static toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }
    
    static init() {
        const savedTheme = this.getTheme();
        this.setTheme(savedTheme);
        
        // Add theme toggle button to header
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.onclick = () => {
            const newTheme = this.toggleTheme();
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            showNotification(`Switched to ${newTheme} theme`, 'info');
        };
        
        const adminControls = document.querySelector('.admin-controls');
        if (adminControls) {
            adminControls.insertBefore(themeToggle, adminControls.firstChild);
        }
    }
}

// Initialize theme management
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        ThemeManager.init();
    }, 1000);
});

// Data validation and sanitization
class DataValidator {
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .trim()
            .substring(0, 1000); // Limit length
    }
    
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static validatePhone(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    static validatePrice(price) {
        return !isNaN(price) && price > 0 && price < 10000000; // Max 10M
    }
    
    static validateStock(stock) {
        return Number.isInteger(stock) && stock >= 0 && stock < 100000; // Max 100k
    }
}

// Rate limiting for API calls (if implemented)
class RateLimiter {
    constructor(maxRequests = 100, timeWindow = 60000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }
    
    canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        if (this.requests.length >= this.maxRequests) {
            return false;
        }
        
        this.requests.push(now);
        return true;
    }
}

// Initialize rate limiter
const rateLimiter = new RateLimiter();

// Final system health check
function performSystemHealthCheck() {
    const health = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        checks: {
            dataIntegrity: checkDataIntegrity(),
            performance: checkPerformance(),
            storage: checkStorageHealth(),
            features: checkFeatureAvailability()
        },
        recommendations: []
    };
    
    // Determine overall health
    const failedChecks = Object.values(health.checks).filter(check => !check.passed);
    if (failedChecks.length > 0) {
        health.status = failedChecks.some(check => check.severity === 'critical') ? 'critical' : 'warning';
    }
    
    return health;
}

function checkDataIntegrity() {
    try {
        // Check if data structures are valid
        const hasValidProducts = Array.isArray(adminProducts) && adminProducts.length >= 0;
        const hasValidOrders = Array.isArray(adminOrders) && adminOrders.length >= 0;
        const hasValidLocations = Array.isArray(adminLocations) && adminLocations.length > 0;
        
        return {
            passed: hasValidProducts && hasValidOrders && hasValidLocations,
            message: 'Data structures are valid',
            severity: 'critical'
        };
    } catch (error) {
        return {
            passed: false,
            message: 'Data integrity check failed: ' + error.message,
            severity: 'critical'
        };
    }
}

function checkPerformance() {
    const dataSize = calculateDataSize();
    const isPerformant = dataSize < 50000000; // 50MB limit
    
    return {
        passed: isPerformant,
        message: isPerformant ? 'Performance is optimal' : 'Large data size may impact performance',
        severity: 'warning',
        dataSize: dataSize
    };
}

function checkStorageHealth() {
    try {
        // Test localStorage availability
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        
        return {
            passed: true,
            message: 'Storage is available',
            severity: 'critical'
        };
    } catch (error) {
        return {
            passed: false,
            message: 'Storage is not available: ' + error.message,
            severity: 'critical'
        };
    }
}

function checkFeatureAvailability() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        notifications: 'Notification' in window,
        geolocation: 'geolocation' in navigator
    };
    
    const availableFeatures = Object.values(features).filter(Boolean).length;
    const totalFeatures = Object.keys(features).length;
    
    return {
        passed: availableFeatures >= totalFeatures * 0.75, // 75% of features should be available
        message: `${availableFeatures}/${totalFeatures} features available`,
        severity: 'info',
        features: features
    };
}

// Run health check on startup
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const health = performSystemHealthCheck();
        console.log('System Health Check:', health);
        
        if (health.status !== 'healthy') {
            console.warn('System health issues detected:', health);
        }
    }, 2000);
});

// Export health check for manual testing
window.performSystemHealthCheck = performSystemHealthCheck;

// Final cleanup and optimization
function cleanup() {
    // Clear any remaining intervals
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // Clear any timeouts
    // (Add timeout IDs to clear if needed)
    
    console.log('Admin system cleanup completed');
}

// Register cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// System ready notification
console.log('🚀 FreshMart Admin System fully loaded and ready for use!');

// Optional: Show system ready notification to user
setTimeout(() => {
    if (currentUser) {
        showNotification('Admin system ready!', 'success');
    }
}, 1000);

// Security: Show/Hide Quick Actions based on login status
function showQuickActions() {
    const quickActions = document.getElementById('quickActions');
    if (quickActions && currentUser) {
        quickActions.style.display = 'block';
    }
}

function hideQuickActions() {
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        quickActions.style.display = 'none';
    }
}

// Update the login function
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    showLoadingOverlay();
    
    // Simulate authentication delay
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'admin123') {
            currentUser = { 
                username: 'admin', 
                role: 'administrator',
                loginTime: new Date().toISOString()
            };
            sessionStartTime = new Date();
            showAdminDashboard();
            loadDashboardData();
            enableAutoSave();
            
            // Security: Show quick actions only after successful login
            showQuickActions();
            
            showNotification('Login successful', 'success');
        } else {
            showNotification('Invalid credentials. Use admin/admin123', 'error');
        }
    }, 1000);
}

// Update the logout function
function logout() {
    showConfirmation(
        'Confirm Logout',
        'Are you sure you want to logout? Any unsaved changes will be lost.',
        () => {
            currentUser = null;
            sessionStartTime = null;
            
            // Security: Hide quick actions on logout
            hideQuickActions();
            
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('adminDashboard').style.display = 'none';
            
            // Reset forms
            document.getElementById('loginForm').reset();
            
            // Clear auto-save
            if (autoSaveInterval) {
                clearInterval(autoSaveInterval);
            }
            
            showNotification('Logged out successfully', 'success');
        }
    );
}

// Additional security: Hide admin elements when not authenticated
function hideAdminElements() {
    const elementsToHide = [
        'quickActions',
        'adminDashboard'
    ];
    
    elementsToHide.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Security check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure admin elements are hidden by default
    hideAdminElements();
    
    // Check for any existing session (optional - for remember me functionality)
    const rememberedSession = localStorage.getItem('admin_session');
    if (rememberedSession) {
        try {
            const session = JSON.parse(rememberedSession);
            const sessionAge = Date.now() - new Date(session.timestamp).getTime();
            
            // Session expires after 24 hours
            if (sessionAge < 24 * 60 * 60 * 1000) {
                currentUser = session.user;
                showAdminDashboard();
                loadDashboardData();
                enableAutoSave();
                showQuickActions();
                showNotification('Session restored', 'info');
            } else {
                localStorage.removeItem('admin_session');
            }
        } catch (error) {
            localStorage.removeItem('admin_session');
        }
    }
});

// Optional: Remember session functionality
function rememberSession() {
    const rememberLogin = document.getElementById('rememberLogin')?.checked;
    if (rememberLogin && currentUser) {
        const sessionData = {
            user: currentUser,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('admin_session', JSON.stringify(sessionData));
    }
}

// Update the successful login to optionally remember session
// Add this to the end of successful login in handleLogin function:
// rememberSession();

// End of admin-script.js
