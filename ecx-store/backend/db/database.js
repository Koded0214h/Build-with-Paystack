const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecxstore.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database error:", err);
    } else {
        console.log("Connected to the database");
    }
})

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price INTEGER NOT NULL,
            image_url TEXT,
            category TEXT,
            created_at DATATIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATATIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Orders table (for later)
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT UNIQUE NOT NULL,
        customer_email TEXT NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Order items table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price INTEGER,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
        )
    `);

    // Insert sample products if table is empty
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
        const sampleProducts = [
            ['Pro Audio Wireless Headphones', 'Noise cancelling over-ear headphones', 29900, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgeYakQZGuOZretZzXPmikT6Vxpj0FP3BO0U4r0jihCSdmnh-B38bLUEm9s2zx16qOtgCJ1UDgFoJbDEqOddiag9Ux_ETHtqmpP4l2Mcft0RHxYggBSviBanCEjUBit0EkM0UvyRfWoyNXPND0kv3c1xk9jlQRaXEffjjq_shzDgsVI9nTj6he5Wqel3evDxjvus-zfrLT0l0kx-WbKt8iXUi9IsQ5vswywUHPiSRxs103co5rsCfXdy7o2FB5ojQ1Jp4TCtOVIBJP', 'Electronics'],
            ['ECX Pad Air', 'Lightweight tablet with stunning display', 54900, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8RNhnIyDLDhhRgF8R-tLzxOkrSaE_1L_g_K3mkhj3uRZwG6Ef2jSvSGpz9tle2c3HQJ7zL5njllQQR9YlVhgMeIdEJat2Y5qWaXR1_iPgKG1WZ_8pz3M_n0xtK5pMc2zUNfk5KHYKZQnfUDmWSms0kbXsEaAva04QDP1FpPdxJXN-mZm73PE8GGDqCwlLo5-paPip9UC_liPwFUo4tyYgMp4qOY_6Uj9dKZdlKKtzERHkjD5Mpd9lfHLiasAUJR7Cyv-9B325pAM2', 'Electronics'],
            ['Modern Ceramic Vase', 'Elegant matte finish decorative vase', 4500, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_5UEtFiUbvtxQrBgjxXE4CHlGz0OaNyfIrV7QdPQd6E7ACq6yNWEmB9x2_9t2YQGrb6ud5Lv6AnCeXuUk2CTqVcJzdJhauK0WdhqnNiGB0eGlhFdbrGXsA7iA-pYwhbzvajmk9hStufz8TckmD6TuUT2VcdVMQ46oVaqcjK1NJPT6tUtt0zXdrB_7byV7Kiedous8K9beBn6n5QR5U-BNC4QBXqiPk2j80cn4xkRdjG7EfHEpMjKWShI5NfvYU2fJb2Jyj2zjOTho', 'Home & Living'],
            ['Organic Linen Shirt', 'Lightweight summer shirt', 6800, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGcxc14sEhEQnbyRO-MO0Ks1eCQTFyHTcv5omWpjItfPGKhO-aZ6CRMi3FfdmiN9NVLc2TU5jF_KBhO6BrkldHqy0ocA-7Qupc-hb5IiVIAIFq1MHjwt23UHX31IIwjNI9wLnSKbyg6xTXgsG7big6LRfHSrSyfuLlDrD3tpegkIwZNHScBBs_aFAjCh_gwN4dZwUjRjmD2gllH7CaD-UEOjyfFbfmVunXErMUWmcWN4NUahIQkMNesV8J0gPTRjYA0TlIzfdaUOot', 'Fashion'],
            ['RGB Mechanical Keyboard', 'Backlit mechanical gaming keyboard', 12000, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkiC3L_rJWtF8SSjw4VJKqNsrlpJ7Kxfh8PceWF1oxDL-QgyoNBQM-3uQcOD1NjKC5ILQtGen7ODZ3CSJtjdR4CxPljr0um9DvM4EhPMIfZYps34OiVFdz-8Z8Sf6f0Ukwy-c3Gd8GW8ZjUGAkOxzfFRcw1miZdmG_SvziXxf9RHtP5aj8OxyaCrTckX6123wXFYo6KXKv63Ay-ZteJSRWjZztBUe_r0mZgGGMWR1MEVhADr5y4pEGk5OLmb4fmnuajBRa0gR0PqB5', 'Electronics'],
            ['ECX UltraBook Pro', 'Lightweight laptop with 14" display', 94900, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWk44oIANHyWh42Yx5pzVMkWGd94KlbcJL_ygscGopxgHh2kPpACIz1uu9yY-9KHcmrnmjpz1G0-y5_SVq8zpbqV6c9R_NQNPV6rWxDyOAlmubq5yJfVoenG5_hJ0pAq4J_7SFYXJ10pQjGvrnrJz2arMti4J657CUsmHLMeX68_i_5ZuVGeMHveR5OC_hj8ngwNY-i7HvHGSlrHSyD-RNxa8128MxqI1ih_aGZllXFl-lgSz7lRciAkoOz9eAmriSsdYVzpvNKf85', 'Electronics'],
        ];

        const stmt = db.prepare("INSERT INTO products (name, description, price, image_url, category) VALUES (?,?,?,?,?)");
        sampleProducts.forEach(p => stmt.run(p));
        stmt.finalize();
        console.log('✅ Sample products inserted');
        }
    });
});

function getProducts(callback) {
    db.all("SELECT * FROM products ORDER BY id", callback);
}

function getProductById(id, callback) {
    db.get("SELECT * FROM products WHERE id = ?", [id], callback);
}

function createOrder(orderData, callback) {
    const {reference, email, amount, items} = orderData;
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(
            'INSERT INTO orders (reference, customer_email, total_amount) VALUES (?, ?, ?)',
            [reference, email, amount], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    callback(err, null);
                } else {
                    const orderId = this.lastID;
                    const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

                    items.forEach(item => {
                        stmt.run(orderId, item.id, item.quantity, item.price);
                    });

                    stmt.finalize();
                    db.run('COMMIT');
                    callback(null, (orderId, reference ));
                }
            }
        )
    })
}

function updateOrderStatus(orderId, status, paymentData, reference, callback) {
    db.run(
        'UPDATE orders SET status = ?, payment_data = ? WHERE reference = ?',
        [status, paymentData, orderId, reference],
        callback
    );
}

module.exports = {
    getProducts,
    getProductById,
    createOrder,
    updateOrderStatus
}
