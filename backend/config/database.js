import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Reduced timeout for faster failure detection
      socketTimeoutMS: 45000,    // Socket timeout for inactivity
      maxPoolSize: 10,    // Maximum number of connections in the pool
      retryWrites: true, // Automatically retry write operations that fail due to network issues
      retryReads: true,  // Automatically retry read operations that fail due to network issues
    };

    console.log('Attempting to connect to MongoDB...');
    const maskedUri = process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@');  // masking the url for security
    console.log('Connection URI:', maskedUri);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('--> MongoDB reconnected');
    });

    // Graceful close on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return true; // Connection successful

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    
    // Provide helpful troubleshooting information
    /*
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('💡 DNS/Network Issue:');
      console.error('   • MongoDB Atlas cluster URL may be incorrect');
      console.error('   • Check internet connection and IP whitelist');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication Issue:');
      console.error('   • Verify username/password in connection string');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Local MongoDB Issue:');
      console.error('   • MongoDB not running locally');
      console.error('   • Install MongoDB or start Docker container');
    }
    
    console.error('\n🚀 Quick Setup Options:');
    console.error('   1. Start Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.error('   2. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   3. Use MongoDB Atlas with correct cluster URL');
    
    */
    console.warn('Server will continue without database - some features will be limited');
    return false; // Connection failed but server can continue
  }
};

export default connectDB;
