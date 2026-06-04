// Check if .env.local exists and load it manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create .env.local with: MONGODB_URI=your_mongodb_connection_string');
  process.exit(1);
}

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
  process.exit(1);
}

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.log('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('📝 Using MongoDB URI:', mongoUri.substring(0, 30) + '...');

// Now test the connection
const { MongoClient } = require('mongodb');

async function testConnection() {
  let client;
  try {
    console.log('\n🔗 Testing MongoDB connection...');
    client = new MongoClient(mongoUri);
    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB connection successful!');
    
    // Get database stats
    const databases = await client.db('admin').admin().listDatabases();
    console.log(`\n📊 Connected to server with ${databases.databases.length} database(s):`);
    databases.databases.forEach(db => console.log(`   - ${db.name}`));
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testConnection();
