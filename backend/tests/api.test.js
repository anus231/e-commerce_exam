const assert = require('assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

async function runTests() {
  console.log('--------------------------------------------------');
  console.log('     RUNNING UNIT & INTEGRATION TEST SUITE        ');
  console.log('--------------------------------------------------');

  try {
    // Test 1: Password Hashing Integrity
    console.log('Test 1: Verifying password hashing security...');
    const rawPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);
    
    assert.ok(hash !== rawPassword, 'Hash should not match raw password string');
    const isMatch = await bcrypt.compare(rawPassword, hash);
    assert.strictEqual(isMatch, true, 'Hashed password compare failed');
    const isIncorrectMatch = await bcrypt.compare('wrongpassword', hash);
    assert.strictEqual(isIncorrectMatch, false, 'Should reject invalid passwords');
    console.log('✅ Test 1 Passed: Hashing is secure.');

    // Test 2: Token JWT Sign & Verify
    console.log('\nTest 2: Verifying JWT signing and authentication middleware...');
    const payload = { id: 1, email: 'admin@agaseke.rw', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    
    assert.ok(token, 'Token generation failed');
    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.id, payload.id, 'Decoded ID mismatch');
    assert.strictEqual(decoded.role, payload.role, 'Decoded role mismatch');
    console.log('✅ Test 2 Passed: Token authentication verified.');

    // Test 3: Relational DB Schema and Seed Integrations
    console.log('\nTest 3: Verifying database connector and catalog schemas...');
    
    // Test fetch products
    const productsResult = await db.query('SELECT * FROM products');
    assert.ok(Array.isArray(productsResult.rows), 'Query should return array of rows');
    assert.ok(productsResult.rows.length > 0, 'Database products should be seeded and non-empty');
    
    // Verify columns exist
    const firstProduct = productsResult.rows[0];
    assert.ok(firstProduct.hasOwnProperty('name'), 'Product missing name');
    assert.ok(firstProduct.hasOwnProperty('price'), 'Product missing price');
    assert.ok(firstProduct.hasOwnProperty('stock'), 'Product missing stock');
    assert.ok(firstProduct.hasOwnProperty('artisan_name'), 'Product missing artisan_name');
    console.log(`✅ Test 3 Passed: Catalog is online with ${productsResult.rows.length} products.`);

    console.log('\n--------------------------------------------------');
    console.log('      ALL TESTS PASSED SUCCESSFULLY (3/3)          ');
    console.log('--------------------------------------------------');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    process.exit(1);
  }
}

// Execute tests
runTests();
