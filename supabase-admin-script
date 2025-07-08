// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication Functions
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        await checkAdminRole(data.user.id);
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

async function checkAdminRole(userId) {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        
        if (data.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
        }
        
        return true;
    } catch (error) {
        console.error('Role check error:', error);
        await signOut();
        throw error;
    }
}

// Product Management Functions
async function loadProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        adminProducts = data || [];
        return adminProducts;
    } catch (error) {
        console.error('Load products error:', error);
        return [];
    }
}

async function createProduct(productData) {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: productData.name,
                category: productData.category,
                price: productData.price,
                unit: productData.unit,
                description: productData.description,
                image: productData.image,
                stock: productData.stock,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        adminProducts.unshift(data);
        return { success: true, product: data };
    } catch (error) {
        console.error('Create product error:', error);
        return { success: false, error: error.message };
    }
}

async function updateProduct(productId, updates) {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single();
        
        if (error) throw error;
        
        const index = adminProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            adminProducts[index] = data;
        }
        
        return { success: true, product: data };
    } catch (error) {
        console.error('Update product error:', error);
        return { success: false, error: error.message };
    }
}

async function deleteProduct(productId) {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) throw error;
        
        adminProducts = adminProducts.filter(p => p.id !== productId);
        return { success: true };
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: error.message };
    }
}

async function bulkDeleteProducts(productIds) {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .in('id', productIds);
        
        if (error) throw error;
        
        adminProducts = adminProducts.filter(p => !productIds.includes(p.id));
        selectedProducts = [];
        return { success: true };
    } catch (error) {
        console.error('Bulk delete error:', error);
        return { success: false, error: error.message };
    }
}

// Order Management Functions
async function loadOrders() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    product:products (*)
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        adminOrders = data || [];
        return adminOrders;
    } catch (error) {
        console.error('Load orders error:', error);
        return [];
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .select()
            .single();
        
        if (error) throw error;
        
        const index = adminOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            adminOrders[index] = { ...adminOrders[index], ...data };
        }
        
        return { success: true, order: data };
    } catch (error) {
        console.error('Update order status error:', error);
        return { success: false, error: error.message };
    }
}

// Location Management Functions
async function loadLocations() {
    try {
        const { data, error } = await supabase
            .from('locations')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        adminLocations = data || [];
        return adminLocations;
    } catch (error) {
        console.error('Load locations error:', error);
        return [];
    }
}

async function createLocation(locationData) {
    try {
        const { data, error } = await supabase
            .from('locations')
            .insert([locationData])
            .select()
            .single();
        
        if (error) throw error;
        
        adminLocations.push(data);
        return { success: true, location: data };
    } catch (error) {
        console.error('Create location error:', error);
        return { success: false, error: error.message };
    }
}

// Stock Management Functions
async function updateProductStock(productId, locationId, quantity) {
    try {
        // First get the current product
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single();
        
        if (fetchError) throw fetchError;
        
        // Update the stock for the specific location
        const updatedStock = {
            ...product.stock,
            [locationId]: quantity
        };
        
        // Save the updated stock
        const { data, error } = await supabase
            .from('products')
            .update({
                stock: updatedStock,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single();
        
        if (error) throw error;
        
        // Update local data
        const index = adminProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            adminProducts[index] = data;
        }
        
        return { success: true, product: data };
    } catch (error) {
        console.error('Update stock error:', error);
        return { success: false, error: error.message };
    }
}

// Real-time Subscriptions
function subscribeToOrders() {
    const subscription = supabase
        .channel('orders-channel')
        .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'orders' 
            }, 
            async (payload) => {
                console.log('Order change received:', payload);
                
                if (payload.eventType === 'INSERT') {
                    // Fetch the complete order with items
                    const { data } = await supabase
                        .from('orders')
                        .select(`
                            *,
                            order_items (
                                *,
                                product:products (*)
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single();
                    
                    if (data) {
                        adminOrders.unshift(data);
                        showNotification('New order received!', 'info');
                        updateOrdersDisplay();
                    }
                } else if (payload.eventType === 'UPDATE') {
                    const index = adminOrders.findIndex(o => o.id === payload.new.id);
                    if (index !== -1) {
                        adminOrders[index] = { ...adminOrders[index], ...payload.new };
                        updateOrdersDisplay();
                    }
                }
            }
        )
        .subscribe();
    
    return subscription;
}

// Analytics Functions
async function getAnalyticsData(startDate, endDate) {
    try {
        // Get orders within date range
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        
        if (ordersError) throw ordersError;
        
        // Calculate analytics
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Get top products
        const { data: topProducts, error: productsError } = await supabase
            .from('order_items')
            .select('product_id, quantity, products(name, price)')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        
        if (productsError) throw productsError;
        
        // Process top products data
        const productSales = {};
        topProducts.forEach(item => {
            if (!productSales[item.product_id]) {
                productSales[item.product_id] = {
                    name: item.products.name,
                    quantity: 0,
                    revenue: 0
                };
            }
            productSales[item.product_id].quantity += item.quantity;
            productSales[item.product_id].revenue += item.quantity * item.products.price;
        });
        
        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topProducts: Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
        };
    } catch (error) {
        console.error('Analytics error:', error);
        return null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        try {
            await checkAdminRole(session.user.id);
            await initializeAdminDashboard();
        } catch (error) {
            // Redirect to login if not admin
            window.location.href = '/login.html';
        }
    } else {
        // Redirect to login
        window.location.href = '/login.html';
    }
});

// Initialize admin dashboard
async function initializeAdminDashboard() {
    // Load all data
    await Promise.all([
        loadProducts(),
        loadOrders(),
        loadLocations()
    ]);
    
    // Set up real-time subscriptions
    subscribeToOrders();
    
    // Update UI
    updateProductsDisplay();
    updateOrdersDisplay();
    updateDashboardStats();
    
    // Set up auto-save if needed
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    autoSaveInterval = setInterval(autoSaveChanges, 30000); // Auto-save every 30 seconds
}

// Auto-save function
async function autoSaveChanges() {
    // Implement any pending changes that need to be saved
    console.log('Auto-saving changes...');
}

// Utility function to show notifications
function showNotification(message, type = 'success') {
    // Implement your notification system here
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    supabase.removeAllChannels();
});
