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
        locationStatus.textContent =
