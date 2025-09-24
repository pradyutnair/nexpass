// Test Appwrite connection
const { Client, Databases } = require('appwrite');

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68d3cfe5001f03d5c030');

const databases = new Databases(client);

async function testConnection() {
  try {
    console.log('Testing Appwrite connection...');
    console.log('Endpoint:', 'https://fra.cloud.appwrite.io/v1');
    console.log('Project ID:', '68d3cfe5001f03d5c030');
    
    // Test if finance database exists by trying to access it
    try {
      const collections = await databases.listCollections('finance');
      console.log('✅ Finance database found!');
      console.log('Collections:', collections.collections.map(col => ({ id: col.$id, name: col.name })));
      
      const usersCollection = collections.collections.find(col => col.$id === 'users_private');
      if (usersCollection) {
        console.log('✅ users_private collection found!');
        console.log('🎉 All setup is correct!');
      } else {
        console.log('❌ users_private collection NOT found. Please create it in Appwrite Console.');
      }
    } catch (dbError) {
      if (dbError.message.includes('not found')) {
        console.log('❌ Finance database NOT found. Please create it in Appwrite Console.');
      } else {
        console.log('❌ Database error:', dbError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('This might be due to:');
    console.log('1. Incorrect project ID or endpoint');
    console.log('2. Network connectivity issues');
    console.log('3. Missing database/collection setup');
  }
}

testConnection();
