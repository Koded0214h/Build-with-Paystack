const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all products
router.get('/', (req, res) => {
  db.getProducts((err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(products);
  });
});

// GET single product by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.getProductById(id, (err, product) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });
});

module.exports = router;