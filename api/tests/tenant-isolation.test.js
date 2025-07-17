const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Ticket = require('../src/models/ticket.model');

describe('Tenant Data Isolation', () => {
  let tokenTenantA;
  let tenantA_User;
  let tenantB_User;
  let tenantA_Ticket;
  let tenantB_Ticket;

  beforeAll(async () => {
    // Create users for two different tenants
    tenantA_User = await User.create({ name: 'Admin A', email: 'adminA@test.com', password: 'password', customerId: 'tenant-a', role: 'Admin' });
    tenantB_User = await User.create({ name: 'Admin B', email: 'adminB@test.com', password: 'password', customerId: 'tenant-b', role: 'Admin' });

    // Create tickets for each tenant
    tenantA_Ticket = await Ticket.create({ title: 'Ticket A', description: 'Desc A', customerId: 'tenant-a', createdBy: tenantA_User._id });
    tenantB_Ticket = await Ticket.create({ title: 'Ticket B', description: 'Desc B', customerId: 'tenant-b', createdBy: tenantB_User._id });

    // Login as Tenant A's admin to get a token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'adminA@test.com', password: 'password' });
    tokenTenantA = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('proves an Admin from Tenant A CANNOT read data from Tenant B', async () => {
    // Use Tenant A's token to try fetching all tickets
    const res = await request(app)
      .get('/api/tickets')
      .set('Authorization', `Bearer ${tokenTenantA}`);

    // Expect a successful response
    expect(res.statusCode).toEqual(200);

    // Expect the response body to be an array
    expect(Array.isArray(res.body)).toBe(true);
    
    // Expect the array to contain ONLY Tenant A's ticket
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Ticket A');
    
    // Most importantly, expect it NOT to contain Tenant B's ticket
    const tenantBData = res.body.find(ticket => ticket.customerId === 'tenant-b');
    expect(tenantBData).toBeUndefined();
  });
});