const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database configuration
const config = {
    host: 'localhost',
    user: 'root',
    password: 'mysql@153',
    multipleStatements: true
};

// Create connection
const connection = mysql.createConnection(config);

// Read schema file
const schemaPath = path.join(__dirname, '../database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('Setting up FaceMatch database...');

// Execute schema
connection.query(schema, (err, results) => {
    if (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
    
    console.log('✓ Database created successfully');
    console.log('✓ Tables created successfully');
    console.log('✓ Indexes created successfully');
    console.log('\nFaceMatch database is ready!');
    
    connection.end();
});