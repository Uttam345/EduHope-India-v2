// MongoDB Connection Checker before actual connection establishment for debugging and troubleshooting
import mongoose from 'mongoose';

async function checkConnections() {
  console.log('Checking MongoDB Connections...\n');

  // Test Atlas Connection
  const atlasUri = process.env.MONGODB_URI;
  console.log('Testing Atlas Connection...');
  console.log('URI:', atlasUri.replace(/:[^:]*@/, ':****@'));
  
  try {
    await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });  //Time-out = 5 sec for Atlas connection
    console.log('Atlas Connection: SUCCESS');
    await mongoose.disconnect();
  } catch (error) {
    console.log('Atlas Connection: FAILED');
    console.log('Error:', error.message);
  }

  console.log('\nTesting Local MongoDB...');
  const localUri = 'mongodb://localhost:27017/eduhope-newsletter';
  
  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });  //Time-out = 3 sec for local connection
    console.log('Local MongoDB: SUCCESS');
    await mongoose.disconnect();
  } catch (error) {
    console.log('Local MongoDB: FAILED');
    console.log('Error:', error.message);
  }

  /*
  console.log('\nRecommendations:');
  console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
  console.log('2. Or use MongoDB Atlas with correct cluster URL');
  console.log('3. For quick setup, consider using MongoDB Docker container');
  */
  
  process.exit(0);
}

checkConnections();
