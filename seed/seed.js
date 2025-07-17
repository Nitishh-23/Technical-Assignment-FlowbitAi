const mongoose = require('mongoose');

// We need to define schemas here because this script runs independently
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  customerId: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'User'], default: 'User' },
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  customerId: { type: String, required: true },
  status: { type: String, enum: ['open', 'processing', 'done'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flowbit-db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Seed: MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('Seed: Connection error:', err.message);
    return false;
  }
};

const seedData = async () => {
  if (!(await connectDB())) {
      console.log("Seed: Aborting due to DB connection failure.");
      process.exit(1);
  }

  // Models need to be registered with the connection
  const User = mongoose.model('User', userSchema); 
  const Ticket = mongoose.model('Ticket', ticketSchema);
  const bcrypt = require('bcryptjs');

  try {
    // Clear existing data
    await User.deleteMany();
    await Ticket.deleteMany();
    console.log('Seed: Old data cleared.');

    // Create users for two tenants
    const users = [
      {
        name: 'Logistics Admin',
        email: 'admin@logistics.co',
        password: 'password123',
        customerId: 'customer_1_logistics', // Tenant ID
        role: 'Admin',
      },
      {
        name: 'Retail Admin',
        email: 'admin@retail.gmbh',
        password: 'password123',
        customerId: 'customer_2_retail', // Tenant ID
        role: 'Admin',
      },
    ];
    
    // Manually hash passwords before inserting
    const salt = await bcrypt.genSalt(10);
    users[0].password = await bcrypt.hash(users[0].password, salt);
    users[1].password = await bcrypt.hash(users[1].password, salt);


    const createdUsers = await User.insertMany(users);
    console.log('Seed: Users created.');

    // Create some initial tickets
    const tickets = [
        { title: 'Shipment Tracker Down', description: 'The main tracking page is not loading.', customerId: 'customer_1_logistics', createdBy: createdUsers[0]._id },
        { title: 'POS System Error', description: 'Cannot process credit card payments.', customerId: 'customer_2_retail', createdBy: createdUsers[1]._id },
    ]

    await Ticket.insertMany(tickets);
    console.log('Seed: Tickets created.');


    console.log('Seed: Database has been seeded successfully!');
  } catch (error) {
    console.error('Error with data seeding:', error);
  } finally {
    mongoose.connection.close();
  }
};

setTimeout(seedData, 10000); // Wait 10s for mongo container to be ready