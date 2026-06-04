import clientPromise from "./lib/mongodb";

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    const client = await clientPromise;
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connection successful!");
    
    // Get database stats
    const databases = await client.db("admin").admin().listDatabases();
    console.log(`📊 Connected to server with ${databases.databases.length} database(s)`);
    console.log("Databases:", databases.databases.map(db => db.name));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
