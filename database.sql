-- ============================================================================
-- CORE TABLES
-- Ensure tables are created before they are referenced by foreign keys or policies
-- ============================================================================

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    manager TEXT NOT NULL,
    hours TEXT DEFAULT 'Mon-Sun: 8:00 AM - 10:00 PM',
    status TEXT DEFAULT 'active',
    total_products INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (Moved up as it's referenced by orders and customer_addresses)
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_order_date TIMESTAMP WITH TIME ZONE,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    saved_addresses JSONB DEFAULT '[]'
);

-- Customer Addresses table (Moved up as it references customers)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label TEXT, -- e.g., 'Home', 'Work'
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (Corrected to include location_id and is_active to match frontend queries)
-- Note: Having both 'location_id' directly on the product and 'stock' as JSONB per location
-- implies that 'location_id' might represent a primary store for the product, while 'stock'
-- JSONB could still track availability across other locations or detailed stock.
-- If a product is unique per location, then 'stock JSONB' may only hold one entry (for its own location_id).
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    description TEXT,
    image TEXT,
    stock JSONB DEFAULT '{}', -- Stock levels per location: e.g., {'location_A_id': 10, 'location_B_id': 5}
    is_active BOOLEAN DEFAULT TRUE, -- Added for consistency with frontend
    location_id TEXT REFERENCES locations(id), -- Added for consistency with frontend loadProducts query
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (Corrected column names and reference to customers.id)
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(id), -- Added reference to customers table
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    location_id TEXT NOT NULL REFERENCES locations(id),
    order_status TEXT DEFAULT 'pending',
    order_type TEXT DEFAULT 'delivery',
    delivery_address TEXT,
    delivery_instructions TEXT,
    pickup_time TIMESTAMP WITH TIME ZONE,
    pickup_notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    items JSONB NOT NULL,
    tracking_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items (Useful for normalized historical item data, even if 'items' is in orders JSONB)
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recent Activities table
CREATE TABLE IF NOT EXISTS recent_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'FreshMart',
    contact_email TEXT DEFAULT 'info@freshmart.ng',
    contact_phone TEXT DEFAULT '+234 812 345 6000',
    delivery_charge_per_km DECIMAL(5,2) DEFAULT 50.00,
    min_order_for_delivery DECIMAL(10,2) DEFAULT 1000.00,
    enable_delivery BOOLEAN DEFAULT TRUE,
    data_retention_days INTEGER DEFAULT 365,
    low_stock_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backups Log table
CREATE TABLE IF NOT EXISTS backups (
    id BIGSERIAL PRIMARY KEY,
    backup_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL,
    file_path TEXT,
    notes TEXT
);

-- Error Logging table
CREATE TABLE IF NOT EXISTS error_logs (
    id BIGSERIAL PRIMARY KEY,
    error_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_level TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET
);

-- Notification Log table
CREATE TABLE IF NOT EXISTS notification_logs (
    id BIGSERIAL PRIMARY KEY,
    notification_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recipient TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    details JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Health Check Log table
CREATE TABLE IF NOT EXISTS health_logs (
    id BIGSERIAL PRIMARY KEY,
    check_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    service_name TEXT NOT NULL,
    status TEXT NOT NULL,
    response_time_ms INTEGER,
    details JSONB
);

-- User Activity Log (for detailed user actions)
CREATE TABLE IF NOT EXISTS user_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences (for theme, notifications, etc.)
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'light',
    receive_notifications BOOLEAN DEFAULT TRUE,
    preferred_location TEXT REFERENCES locations(id),
    settings_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Alerts (for admin/monitoring)
CREATE TABLE IF NOT EXISTS system_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    source TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ===========================================================================
-- ADDITIONAL TABLES FOR FRONTEND
-- These tables are now created BEFORE their RLS policies and other references
-- ===========================================================================

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- Product Reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Notifications table (for in-app notifications)
CREATE TABLE IF NOT EXISTS user_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Logs table (for tracking app performance metrics)
CREATE TABLE IF NOT EXISTS performance_logs (
    id BIGSERIAL PRIMARY KEY,
    log_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metric_name TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit TEXT,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extending auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    billing_address TEXT,
    shipping_address TEXT,
    phone_number TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ===========================================================================
-- INDEXES FOR PERFORMANCE
-- These should come after table creation
-- ===========================================================================

-- Indexes for core tables
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_location_id ON products(location_id); -- Index for the new location_id column
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_location_id ON orders(location_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_recent_activities_user_id ON recent_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_time ON error_logs(error_time);
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON notification_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_system_alerts_time ON system_alerts(alert_time);

-- New Indexes for added tables
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_logs_time ON performance_logs(log_time);
CREATE INDEX IF NOT EXISTS idx_customers_phone_number ON customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- ===========================================================================
-- FUNCTIONS
-- These can come after tables and indexes, before triggers/RLS
-- ===========================================================================

-- Function to get top selling products
CREATE OR REPLACE FUNCTION get_top_selling_products(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT '2023-01-01',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    total_quantity_sold BIGINT,
    total_revenue NUMERIC
) AS $$
SELECT
    oi.product_id,
    oi.product_name,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.quantity * oi.price_at_order) AS total_revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at BETWEEN start_date AND end_date
GROUP BY oi.product_id, oi.product_name
ORDER BY total_revenue DESC
LIMIT limit_count;
$$ LANGUAGE sql STABLE;

-- Function to get top products (by sales count)
CREATE OR REPLACE FUNCTION get_top_products(
    p_limit INTEGER DEFAULT 10,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    total_sales_count BIGINT
) AS $$
SELECT
    p.id AS product_id,
    p.name AS product_name,
    COUNT(oi.id) AS total_sales_count
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE (p_start_date IS NULL OR o.created_at >= p_start_date)
  AND (p_end_date IS NULL OR o.created_at <= p_end_date)
GROUP BY p.id, p.name
ORDER BY total_sales_count DESC
LIMIT p_limit;
$$ LANGUAGE sql STABLE;

-- Function to safely update JSONB stock for a product at a specific location
CREATE OR REPLACE FUNCTION update_product_stock_safe(
    p_product_id BIGINT,
    p_location_id TEXT,
    p_change INTEGER
)
RETURNS JSONB AS $$
DECLARE
    current_stock INTEGER;
    new_stock JSONB;
BEGIN
    SELECT COALESCE((stock->>p_location_id)::INTEGER, 0) INTO current_stock FROM products WHERE id = p_product_id;

    IF current_stock + p_change < 0 THEN
        RAISE EXCEPTION 'Not enough stock for product % at location %.', p_product_id, p_location_id;
    END IF;

    UPDATE products
    SET stock = jsonb_set(stock, ARRAY[p_location_id], TO_JSONB(current_stock + p_change)::JSONB, TRUE)
    WHERE id = p_product_id
    RETURNING stock INTO new_stock;

    RETURN new_stock;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function to get low stock products for all locations (based on global threshold)
CREATE OR REPLACE FUNCTION get_low_stock_products(
    threshold INTEGER DEFAULT 10
)
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    location_id TEXT,
    current_stock INTEGER,
    category TEXT
) AS $$
SELECT
    p.id AS product_id,
    p.name AS product_name,
    l.id AS location_id,
    COALESCE((p.stock->>l.id)::INTEGER, 0) AS current_stock,
    p.category
FROM products p
CROSS JOIN locations l -- Cross join to check stock for each product in each location
WHERE p.is_active = TRUE
  AND (p.stock->>l.id)::INTEGER > 0 -- Ensure it's not zero or null (out of stock)
  AND (p.stock->>l.id)::INTEGER <= threshold;
$$ LANGUAGE sql STABLE;

-- Function to get out of stock products for all locations
CREATE OR REPLACE FUNCTION get_out_of_stock_products()
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    location_id TEXT,
    category TEXT
) AS $$
SELECT
    p.id AS product_id,
    p.name AS product_name,
    l.id AS location_id,
    p.category
FROM products p
CROSS JOIN locations l
WHERE p.is_active = TRUE
  AND COALESCE((p.stock->>l.id)::INTEGER, 0) = 0; -- Stock is 0 or null
$$ LANGUAGE sql STABLE;


-- Function to get daily sales summary
CREATE OR REPLACE FUNCTION get_daily_sales_summary(
    p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '7 days'),
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    sale_date DATE,
    total_revenue NUMERIC,
    total_orders BIGINT,
    avg_order_value NUMERIC
) AS $$
SELECT
    DATE(created_at) AS sale_date,
    SUM(total_amount) AS total_revenue,
    COUNT(id) AS total_orders,
    COALESCE(SUM(total_amount) / COUNT(id), 0) AS avg_order_value
FROM orders
WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date
GROUP BY DATE(created_at)
ORDER BY DATE(created_at);
$$ LANGUAGE sql STABLE;

-- Function to get orders by status
CREATE OR REPLACE FUNCTION get_orders_by_status(
    p_status TEXT DEFAULT NULL,
    p_location_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id BIGINT,
    customer_name TEXT,
    total_amount NUMERIC,
    order_status TEXT,
    order_date TIMESTAMP WITH TIME ZONE
) AS $$
SELECT
    id,
    customer_name,
    total_amount,
    order_status,
    created_at AS order_date
FROM orders
WHERE (p_status IS NULL OR order_status = p_status)
  AND (p_location_id IS NULL OR location_id = p_location_id)
ORDER BY created_at DESC;
$$ LANGUAGE sql STABLE;

-- Global search function
CREATE OR REPLACE FUNCTION global_search(search_term TEXT)
RETURNS TABLE (
    result_type TEXT,
    item_id TEXT,
    item_name TEXT,
    item_description TEXT,
    item_url TEXT
) AS $$
BEGIN
    -- Search products
    RETURN QUERY
    SELECT
        'product' AS result_type,
        p.id::TEXT AS item_id,
        p.name AS item_name,
        p.description AS item_description,
        ('/products/' || p.id)::TEXT AS item_url
    FROM products p
    WHERE p.name ILIKE '%' || search_term || '%'
       OR p.description ILIKE '%' || search_term || '%'
       OR p.category ILIKE '%' || search_term || '%';

    -- Search locations
    RETURN QUERY
    SELECT
        'location' AS result_type,
        l.id::TEXT AS item_id,
        l.name AS item_name,
        l.address AS item_description,
        ('/locations/' || l.id)::TEXT AS item_url
    FROM locations l
    WHERE l.name ILIKE '%' || search_term || '%'
       OR l.address ILIKE '%' || search_term || '%';

    -- Search orders (by customer name or phone)
    RETURN QUERY
    SELECT
        'order' AS result_type,
        o.id::TEXT AS item_id,
        o.customer_name AS item_name,
        ('Order by ' || o.customer_name || ' for ' || o.total_amount)::TEXT AS item_description,
        ('/orders/' || o.id)::TEXT AS item_url
    FROM orders o
    WHERE o.customer_name ILIKE '%' || search_term || '%'
       OR o.customer_phone ILIKE '%' || search_term || '%';

    -- Search customers
    RETURN QUERY
    SELECT
        'customer' AS result_type,
        c.id::TEXT AS item_id,
        c.full_name AS item_name,
        c.phone_number AS item_description,
        ('/customers/' || c.id)::TEXT AS item_url
    FROM customers c
    WHERE c.full_name ILIKE '%' || search_term || '%'
       OR c.phone_number ILIKE '%' || search_term || '%'
       OR c.email ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get inventory summary by location
CREATE OR REPLACE FUNCTION get_inventory_summary_by_location(
    p_location_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    location_id TEXT,
    location_name TEXT,
    total_products BIGINT,
    total_stock BIGINT,
    in_stock_count BIGINT,
    low_stock_count BIGINT,
    out_of_stock_count BIGINT
) AS $$
DECLARE
    low_stock_thresh INTEGER;
BEGIN
    SELECT low_stock_threshold INTO low_stock_thresh FROM settings WHERE id = 1;

    RETURN QUERY
    SELECT
        l.id AS location_id,
        l.name AS location_name,
        COUNT(p.id) AS total_products,
        SUM(COALESCE((p.stock->>l.id)::INTEGER, 0)) AS total_stock,
        COUNT(CASE WHEN COALESCE((p.stock->>l.id)::INTEGER, 0) > low_stock_thresh THEN 1 END) AS in_stock_count,
        COUNT(CASE WHEN COALESCE((p.stock->>l.id)::INTEGER, 0) > 0 AND COALESCE((p.stock->>l.id)::INTEGER, 0) <= low_stock_thresh THEN 1 END) AS low_stock_count,
        COUNT(CASE WHEN COALESCE((p.stock->>l.id)::INTEGER, 0) = 0 THEN 1 END) AS out_of_stock_count
    FROM locations l
    LEFT JOIN products p ON (p.stock ? l.id) -- Join products that have stock data for this location
    WHERE (p_location_id IS NULL OR l.id = p_location_id)
    GROUP BY l.id, l.name
    ORDER BY l.name;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get recent orders with item details
CREATE OR REPLACE FUNCTION get_recent_orders(
    p_limit INTEGER DEFAULT 10,
    p_location_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id BIGINT,
    customer_name TEXT,
    customer_phone TEXT,
    location_name TEXT,
    total_amount NUMERIC,
    order_status TEXT,
    order_type TEXT,
    order_date TIMESTAMP WITH TIME ZONE,
    items JSONB
) AS $$
SELECT
    o.id AS order_id,
    o.customer_name,
    o.customer_phone,
    l.name AS location_name,
    o.total_amount,
    o.order_status,
    o.order_type,
    o.created_at AS order_date,
    o.items
FROM orders o
JOIN locations l ON o.location_id = l.id
WHERE (p_location_id IS NULL OR o.location_id = p_location_id)
ORDER BY o.created_at DESC
LIMIT p_limit;
$$ LANGUAGE sql STABLE;

-- Function to search customers and get their order stats
CREATE OR REPLACE FUNCTION search_customers(
    search_term TEXT DEFAULT '',
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    customer_id BIGINT,
    full_name TEXT,
    phone_number TEXT,
    email TEXT,
    total_orders BIGINT,
    total_spent NUMERIC,
    last_order_date TIMESTAMP WITH TIME ZONE
) AS $$
SELECT
    c.id,
    c.full_name,
    c.phone_number,
    c.email,
    COALESCE(c.total_orders, 0) AS total_orders,
    COALESCE(c.total_spent, 0) AS total_spent,
    c.last_order_date
FROM customers c
WHERE c.full_name ILIKE '%' || search_term || '%'
   OR c.phone_number ILIKE '%' || search_term || '%'
   OR c.email ILIKE '%' || search_term || '%'
ORDER BY c.last_order_date DESC NULLS LAST, c.full_name
LIMIT p_limit;
$$ LANGUAGE sql STABLE;

-- Function to analyze customer segments (e.g., by total spent)
CREATE OR REPLACE FUNCTION analyze_customer_segments()
RETURNS JSONB AS $$
SELECT jsonb_agg(segment_data)
FROM (
    SELECT
        CASE
            WHEN total_spent >= 100000 THEN 'High Value'
            WHEN total_spent >= 20000 THEN 'Medium Value'
            ELSE 'Low Value'
        END AS segment,
        COUNT(id) AS customer_count,
        SUM(total_spent) AS total_segment_spent,
        AVG(total_orders) AS avg_orders_per_customer
    FROM customers
    GROUP BY segment
    ORDER BY segment
) AS segment_data;
$$ LANGUAGE sql STABLE;

-- Function to analyze product performance
CREATE OR REPLACE FUNCTION analyze_product_performance(
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    category TEXT,
    total_quantity_sold BIGINT,
    total_revenue NUMERIC,
    avg_price_at_sale NUMERIC
) AS $$
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.category,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.quantity * oi.price_at_order) AS total_revenue,
    AVG(oi.price_at_order) AS avg_price_at_sale
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at BETWEEN start_date AND end_date
GROUP BY p.id, p.name, p.category
ORDER BY total_revenue DESC;
$$ LANGUAGE sql STABLE;

-- Function to analyze location performance
CREATE OR REPLACE FUNCTION analyze_location_performance(
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    location_id TEXT,
    location_name TEXT,
    total_orders BIGINT,
    total_revenue NUMERIC,
    avg_order_value NUMERIC,
    total_products_sold BIGINT
) AS $$
SELECT
    l.id AS location_id,
    l.name AS location_name,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS total_revenue,
    COALESCE(SUM(o.total_amount) / COUNT(o.id), 0) AS avg_order_value,
    SUM(oi.quantity) AS total_products_sold
FROM locations l
JOIN orders o ON l.id = o.location_id
JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at BETWEEN start_date AND end_date
GROUP BY l.id, l.name
ORDER BY total_revenue DESC;
$$ LANGUAGE sql STABLE;


-- Function to calculate product velocity (sales per day)
CREATE OR REPLACE FUNCTION calculate_product_velocity(
    p_product_id BIGINT,
    days_period INTEGER DEFAULT 30
)
RETURNS NUMERIC AS $$
DECLARE
    total_qty INTEGER;
    days_count INTEGER;
    velocity NUMERIC;
BEGIN
    SELECT
        SUM(oi.quantity),
        COUNT(DISTINCT DATE(o.created_at))
    INTO
        total_qty,
        days_count
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = p_product_id
      AND o.created_at >= NOW() - (days_period || ' day')::INTERVAL;

    IF days_count > 0 THEN
        velocity := total_qty::NUMERIC / days_count::NUMERIC;
    ELSE
        velocity := 0;
    END IF;

    RETURN velocity;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to calculate database size
CREATE OR REPLACE FUNCTION calculate_database_size()
RETURNS TEXT AS $$
SELECT pg_size_pretty(pg_database_size(current_database()));
$$ LANGUAGE sql STABLE;


-- Stock Management Functions

-- Function to remove a location from product stock JSONB
CREATE OR REPLACE FUNCTION remove_location_from_stock(
    p_location_id TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET stock = stock - p_location_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function to add a new location key with 0 stock to all products
CREATE OR REPLACE FUNCTION add_location_to_all_products(
    p_location_id TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET stock = jsonb_set(stock, ARRAY[p_location_id], '0'::JSONB, FALSE);
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function to update (rename) a location ID within product stock JSONB
CREATE OR REPLACE FUNCTION update_location_id_in_stock(
    old_location_id TEXT,
    new_location_id TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET
        stock = CASE
            WHEN stock ? old_location_id THEN
                jsonb_set(stock - old_location_id, ARRAY[new_location_id], stock->old_location_id)
            ELSE stock
        END;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function for bulk stock updates
CREATE OR REPLACE FUNCTION bulk_update_stock(
    updates JSONB[] -- Array of JSONB objects like {"product_id": 1, "location_id": "loc1", "quantity": 5, "type": "add"}
)
RETURNS VOID AS $$
DECLARE
    update_item JSONB;
    p_product_id BIGINT;
    p_location_id TEXT;
    p_quantity INTEGER;
    update_type TEXT;
    current_stock INTEGER;
BEGIN
    FOR update_item IN SELECT * FROM unnest(updates)
    LOOP
        p_product_id := (update_item->>'product_id')::BIGINT;
        p_location_id := update_item->>'location_id';
        p_quantity := (update_item->>'quantity')::INTEGER;
        update_type := update_item->>'type';

        SELECT COALESCE((stock->>p_location_id)::INTEGER, 0) INTO current_stock FROM products WHERE id = p_product_id;

        IF update_type = 'add' THEN
            PERFORM update_product_stock_safe(p_product_id, p_location_id, p_quantity);
        ELSIF update_type = 'subtract' THEN
            PERFORM update_product_stock_safe(p_product_id, p_location_id, -p_quantity);
        ELSIF update_type = 'set' THEN
            UPDATE products
            SET stock = jsonb_set(stock, ARRAY[p_location_id], TO_JSONB(GREATEST(0, p_quantity))::JSONB, TRUE)
            WHERE id = p_product_id;
        ELSE
            RAISE WARNING 'Unknown update type: % for product %', update_type, p_product_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Utility Functions
-- Function to get stock alerts based on settings
CREATE OR REPLACE FUNCTION get_stock_alerts()
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    location_id TEXT,
    current_stock INTEGER,
    threshold INTEGER
) AS $$
DECLARE
    low_stock_thresh INTEGER;
BEGIN
    SELECT low_stock_threshold INTO low_stock_thresh FROM settings WHERE id = 1;

    RETURN QUERY
    SELECT
        p.id AS product_id,
        p.name AS product_name,
        l.id AS location_id,
        COALESCE((p.stock->>l.id)::INTEGER, 0) AS current_stock,
        low_stock_thresh AS threshold
    FROM products p
    CROSS JOIN locations l
    WHERE p.is_active = TRUE
      AND COALESCE((p.stock->>l.id)::INTEGER, 0) <= low_stock_thresh
      AND COALESCE((p.stock->>l.id)::INTEGER, 0) > 0; -- Only low stock, not out of stock unless threshold is 0
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get sales trends over a period
CREATE OR REPLACE FUNCTION get_sales_trends(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    sale_date DATE,
    daily_revenue NUMERIC,
    cumulative_revenue NUMERIC,
    daily_orders BIGINT,
    cumulative_orders BIGINT
) AS $$
WITH daily_stats AS (
    SELECT
        DATE(created_at) AS sale_date,
        SUM(total_amount) AS daily_revenue,
        COUNT(id) AS daily_orders
    FROM orders
    WHERE created_at >= CURRENT_DATE - (days_back || ' day')::INTERVAL -- Corrected INTERVAL syntax
    GROUP BY DATE(created_at)
)
SELECT
    ds.sale_date,
    ds.daily_revenue,
    SUM(ds.daily_revenue) OVER (ORDER BY ds.sale_date) AS cumulative_revenue,
    ds.daily_orders,
    SUM(ds.daily_orders) OVER (ORDER BY ds.sale_date) AS cumulative_orders
FROM daily_stats ds
ORDER BY ds.sale_date;
$$ LANGUAGE sql STABLE;

-- Function to get customer insights
CREATE OR REPLACE FUNCTION get_customer_insights(
    p_customer_id BIGINT DEFAULT NULL
)
RETURNS TABLE (
    customer_id BIGINT,
    full_name TEXT,
    total_orders BIGINT,
    total_spent NUMERIC,
    average_order_value NUMERIC,
    favorite_category TEXT,
    favorite_location TEXT,
    last_order_date TIMESTAMP WITH TIME ZONE
) AS $$
SELECT
    c.id AS customer_id,
    c.full_name,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COALESCE(AVG(o.total_amount), 0) AS average_order_value,
    (SELECT category FROM (
        SELECT oi.product_name, p.category, COUNT(*) AS count_cat
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (SELECT id FROM orders WHERE customer_id = c.id)
        GROUP BY p.category, oi.product_name
        ORDER BY count_cat DESC LIMIT 1
    ) AS fav_cat_subquery) AS favorite_category,
    (SELECT l.name FROM (
        SELECT o.location_id, COUNT(*) AS count_loc
        FROM orders o
        WHERE o.customer_id = c.id
        GROUP BY o.location_id
        ORDER BY count_loc DESC LIMIT 1
    ) AS fav_loc_subquery JOIN locations l ON fav_loc_subquery.location_id = l.id) AS favorite_location,
    MAX(o.created_at) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE (p_customer_id IS NULL OR c.id = p_customer_id)
GROUP BY c.id, c.full_name
ORDER BY c.full_name;
$$ LANGUAGE sql STABLE;

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS TEXT AS $$
DECLARE
    retention_days INTEGER;
    deleted_count_orders INTEGER := 0;
    deleted_count_order_items INTEGER := 0; -- order_items will cascade
    deleted_count_health_logs INTEGER := 0;
    deleted_count_user_activities INTEGER := 0;
    result_message TEXT;
BEGIN
    SELECT COALESCE(data_retention_days, 365)
    INTO retention_days
    FROM settings
    WHERE id = 1;

    -- Clean up old orders (and their items via cascade)
    DELETE FROM orders
    WHERE created_at < NOW() - (retention_days || ' day')::INTERVAL; -- Corrected INTERVAL syntax
    GET DIAGNOSTICS deleted_count_orders = ROW_COUNT;

    -- Clean up old health logs (e.g., keep last 90 days)
    DELETE FROM health_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count_health_logs = ROW_COUNT;

    -- Clean up old user activities (e.g., keep last 180 days)
    DELETE FROM user_activities
    WHERE created_at < NOW() - INTERVAL '180 days';
    GET DIAGNOSTICS deleted_count_user_activities = ROW_COUNT;

    result_message := 'Cleanup complete: ' ||
                      deleted_count_orders || ' orders deleted, ' ||
                      deleted_count_health_logs || ' health logs deleted, ' ||
                      deleted_count_user_activities || ' user activities deleted.';

    RETURN result_message;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function to get customer stats
CREATE OR REPLACE FUNCTION get_customer_stats(
    p_customer_phone TEXT
)
RETURNS TABLE (
    total_orders BIGINT,
    total_spent NUMERIC,
    average_order NUMERIC,
    last_order_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS total_spent,
        COALESCE(AVG(o.total_amount), 0) AS average_order,
        MAX(o.created_at) AS last_order_date
    FROM orders o
    WHERE o.customer_phone = p_customer_phone;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===========================================================================
-- TRIGGERS
-- These come after functions, tables, and indexes
-- ===========================================================================

-- Generic function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at_column trigger to relevant tables
CREATE TRIGGER trigger_update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_product_reviews_updated_at
BEFORE UPDATE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_customer_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_customer_addresses_updated_at
BEFORE UPDATE ON customer_addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Trigger to update total products count for each location
-- Note: This trigger recalculates for ALL locations. For very large datasets,
-- consider optimizing or running this less frequently if performance is an issue.
CREATE OR REPLACE FUNCTION update_location_product_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE locations l
    SET total_products = (
        SELECT COUNT(p.id)
        FROM products p
        WHERE p.location_id = l.id
          AND p.is_active = TRUE
          AND COALESCE((p.stock->>l.id)::INTEGER, 0) > 0 -- Count only products with stock in this location
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_product_count
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH STATEMENT
EXECUTE FUNCTION update_location_product_count();

-- Trigger to update total orders count for each location
CREATE OR REPLACE FUNCTION update_location_order_count()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT
    IF TG_OP = 'INSERT' THEN
        UPDATE locations
        SET total_orders = total_orders + 1
        WHERE id = NEW.location_id;
    -- For DELETE
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE locations
        SET total_orders = total_orders - 1
        WHERE id = OLD.location_id;
    -- For UPDATE (if location_id changes)
    ELSIF TG_OP = 'UPDATE' AND NEW.location_id IS DISTINCT FROM OLD.location_id THEN
        UPDATE locations
        SET total_orders = total_orders - 1
        WHERE id = OLD.location_id;
        UPDATE locations
        SET total_orders = total_orders + 1
        WHERE id = NEW.location_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_order_count
AFTER INSERT OR DELETE OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_location_order_count();

-- Trigger to update customer last_order_date and totals when new order is created
CREATE OR REPLACE FUNCTION update_customer_order_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers
    SET
        last_order_date = NEW.created_at,
        total_orders = COALESCE(total_orders, 0) + 1,
        total_spent = COALESCE(total_spent, 0) + NEW.total_amount,
        updated_at = NOW()
    WHERE id = NEW.customer_id OR phone_number = NEW.customer_phone; -- Use ID if available, fallback to phone
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_order_stats
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION update_customer_order_stats();


-- ===========================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS for tables, then define policies.
-- `IF NOT EXISTS` is removed from `CREATE POLICY` as it's not supported.
-- ===========================================================================

-- Enable RLS on core tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on additional tables
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;


-- RLS policies for core tables
CREATE POLICY "Allow authenticated users to read products" ON products
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert products" ON products
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update products" ON products
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to delete products" ON products
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage orders" ON orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage order_items" ON order_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read locations" ON locations
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update locations" ON locations
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert locations" ON locations
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage settings" ON settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert activities" ON recent_activities
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to read activities" ON recent_activities
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage backups" ON backups
    FOR ALL TO authenticated USING (true) WITH CHECK (true); -- Assuming backups are admin-only
CREATE POLICY "Allow authenticated users to manage error_logs" ON error_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage notification_logs" ON notification_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage health_logs" ON health_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage system_alerts" ON system_alerts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- RLS policies for user-specific data
CREATE POLICY "Users can insert their own activity" ON user_activities
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own activities" ON user_activities
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences" ON user_preferences
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlists" ON wishlists
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow read public wishlists if applicable" ON wishlists
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create reviews" ON product_reviews
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow all users to read reviews" ON product_reviews
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update their own reviews" ON product_reviews
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own reviews" ON product_reviews
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON user_notifications
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert performance logs" ON performance_logs
    FOR INSERT TO authenticated WITH CHECK (true); -- Typically admin or app-generated

CREATE POLICY "Users can manage their own profile" ON profiles
    FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policies for customers table (public facing for phone-based lookup/upsert)
CREATE POLICY "Allow public customer lookup" ON customers
    FOR SELECT USING (true);
CREATE POLICY "Allow public customer upsert" ON customers
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public customer update" ON customers
    FOR UPDATE USING (true) WITH CHECK (true); -- This allows any authenticated user to update any customer. Refine if needed.

CREATE POLICY "Allow customer_addresses to be managed by customer_id" ON customer_addresses
    FOR ALL TO authenticated USING (customer_id = (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone_number')) WITH CHECK (customer_id = (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone_number'));
-- Note: The above policy for customer_addresses uses auth.jwt() ->> 'phone_number'. This assumes phone number is in JWT claims.
-- If not, you'd need to link via auth.uid() if customers are also auth.users, or use a custom function.
-- For simpler public access, "FOR ALL USING (true) WITH CHECK (true)" might be used temporarily until more complex linking is implemented.
-- Given the customer lookup by phone, a direct link from customer_addresses to auth.uid() might be needed if they are supposed to be truly 'owned' by a logged-in user.
-- For the public model (customer by phone), a simpler policy might be:
-- CREATE POLICY "Allow all to manage customer addresses" ON customer_addresses
--     FOR ALL USING (true) WITH CHECK (true);

-- ===========================================================================
-- CONSTRAINTS AND VALIDATIONS
-- These can come after table creation
-- ===========================================================================

-- Products table constraints
ALTER TABLE products ADD CONSTRAINT check_price_positive CHECK (price >= 0);
ALTER TABLE products ADD CONSTRAINT check_name_not_empty CHECK (name <> '');

-- Orders table constraints
ALTER TABLE orders ADD CONSTRAINT check_total_amount_positive CHECK (total_amount >= 0);
ALTER TABLE orders ADD CONSTRAINT check_customer_name_not_empty CHECK (customer_name <> '');
ALTER TABLE orders ADD CONSTRAINT check_valid_order_status CHECK (order_status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded'));
ALTER TABLE orders ADD CONSTRAINT check_valid_order_type CHECK (order_type IN ('delivery', 'pickup'));

-- Order Items table constraints
ALTER TABLE order_items ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT check_item_price_positive CHECK (price_at_order >= 0);

-- Locations table constraints
ALTER TABLE locations ADD CONSTRAINT check_location_name_not_empty CHECK (name <> '');
ALTER TABLE locations ADD CONSTRAINT check_valid_location_status CHECK (status IN ('active', 'inactive', 'maintenance'));

-- Product Reviews constraints
ALTER TABLE product_reviews ADD CONSTRAINT check_rating_range CHECK (rating >= 1 AND rating <= 5);

-- ===========================================================================
-- INITIAL DATA SETUP
-- These come after tables are created
-- ===========================================================================

-- Insert a default settings row if it doesn't exist
INSERT INTO settings (id, site_name)
SELECT 1, 'FreshMart'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

-- ===========================================================================
-- UTILITY VIEWS
-- These come after tables are created
-- ===========================================================================

-- View for product stock summary
CREATE OR REPLACE VIEW product_stock_summary AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.category,
    p.price,
    p.image,
    p.is_active,
    p.location_id,
    l.name AS primary_location_name,
    p.stock AS stock_by_location,
    (SELECT SUM((value::text)::integer) FROM jsonb_each_text(p.stock)) AS total_stock_across_locations
FROM products p
LEFT JOIN locations l ON p.location_id = l.id;


-- View for simplified order summary
CREATE OR REPLACE VIEW order_summary AS
SELECT
    o.id AS order_id,
    o.customer_name,
    o.customer_phone,
    o.total_amount,
    o.order_status,
    o.order_type,
    l.name AS location_name,
    o.created_at AS order_date,
    o.items
FROM orders o
JOIN locations l ON o.location_id = l.id;

-- View for location performance metrics
CREATE OR REPLACE VIEW location_performance_metrics AS
SELECT
    l.id AS location_id,
    l.name AS location_name,
    COUNT(o.id) AS total_orders_handled,
    SUM(o.total_amount) AS total_revenue_generated,
    AVG(o.total_amount) AS average_order_value_at_location,
    MAX(o.created_at) AS last_order_date
FROM locations l
LEFT JOIN orders o ON l.id = o.location_id
GROUP BY l.id, l.name
ORDER BY total_revenue_generated DESC;

-- View for daily sales metrics
CREATE OR REPLACE VIEW daily_sales_metrics AS
SELECT
    DATE(created_at) AS sale_date,
    SUM(total_amount) AS daily_gross_sales,
    COUNT(id) AS total_orders,
    AVG(total_amount) AS average_order_value
FROM orders
GROUP BY DATE(created_at)
ORDER BY DATE(created_at);

-- ===========================================================================
-- SCHEDULED MAINTENANCE (Illustrative, requires pg_cron extension)
-- ===========================================================================
-- To schedule `cleanup_old_data` daily at 2 AM UTC:
-- SELECT cron.schedule('daily-data-cleanup', '0 2 * * *', 'SELECT cleanup_old_data();');
-- To unschedule:
-- SELECT cron.unschedule('daily-data-cleanup');

-- To schedule database backup (example, requires pg_cron and a backup script/function):
-- SELECT cron.schedule('daily-db-backup', '30 3 * * *', 'SELECT perform_database_backup();');


-- ===========================================================================
-- Final Confirmation
-- ===========================================================================
DO $$
BEGIN
    RAISE NOTICE 'FreshMart database schema setup completed successfully! 🎉';
END$$;
