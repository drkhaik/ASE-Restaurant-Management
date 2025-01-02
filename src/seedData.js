import { saveUserService } from './services/user.service.js';
import Dish from './models/dish.model.js';
import Inventory from './models/inventory.model.js';
import Order from './models/order.model.js';
import OrderDetail from './models/orderDetail.model.js';
import Payment from './models/payment.model.js';
import Role from './models/role.model.js';
import Table from './models/table.model.js';
import User from './models/user.model.js';
import WorkSchedule from './models/workSchedule.model.js';
import { connectToDatabase } from './configs/config.mongoDB.js';

const seedData = async () => {
  try {
    // Roles
    const adminRole = new Role({ name: 'admin', description: 'Administrator role' });
    const waiterRole = new Role({ name: 'waiter', description: 'Regular Waiter role' });
    const chefRole = new Role({ name: 'chef', description: 'Regular Chef role' });
    const cashierRole = new Role({ name: 'cashier', description: 'Regular Cashier role' });

    await adminRole.save();
    await waiterRole.save();
    await chefRole.save();
    await cashierRole.save();

    // Users
    const admin = new User({ name: 'Admin', username: 'admin@email.com', email: 'john@example.com', password: '123456', role: 'admin' });
    const waiter = new User({ name: 'Waiter', username: 'waiter@email.com', email: 'jane@example.com', password: '123456', role: 'waiter' });
    const chef = new User({ name: 'Chef', username: 'chef@email.com', email: 'jane3@example.com', password: '123456', role: 'chef' });
    const cashier = new User({ name: 'Cashier', username: 'cashier@email.com', email: 'jane4@example.com', password: '123456', role: 'cashier' });

    await saveUserService(admin);
    await saveUserService(waiter);
    await saveUserService(chef);
    await saveUserService(cashier);


    // Dishes
    const dish1 = new Dish({ name: 'Spaghetti Carbonara', price: 12.99, category: 'main_dish' });
    const dish2 = new Dish({ name: 'Caesar Salad', price: 7.99, category: 'starter' });
    const dish3 = new Dish({ name: 'Chocolate Cake', price: 5.99, category: 'dessert' });
    await dish1.save();
    await dish2.save();
    await dish3.save();

    // Inventory
    const inventory1 = new Inventory({ name: 'Spaghetti', quantity: 100, price: 2.50, category: 'Pasta', description: 'Spaghetti pasta for Carbonara' });
    const inventory2 = new Inventory({ name: 'Parmesan Cheese', quantity: 50, price: 1.20, category: 'Cheese', description: 'Shredded parmesan' });
    await inventory1.save();
    await inventory2.save();

    // Tables
    const table1 = new Table({ name: 'Table 1', status: 'AVAILABLE' });
    const table2 = new Table({ name: 'Table 2', status: 'OCCUPIED' });
    await table1.save();
    await table2.save();

    // // Orders
    // const order1 = new Order({ staff_in_charge: waiter._id, total_amount: 35.98, status: 'PENDING' });
    // const order2 = new Order({ staff_in_charge: waiter._id, total_amount: 15.98, status: 'DELIVERED' });
    // await order1.save();
    // await order2.save();

    // // Order Details
    // const orderDetail1 = new OrderDetail({ order_id: order1._id, dish_id: dish1._id, quantity: 2 });
    // const orderDetail2 = new OrderDetail({ order_id: order2._id, dish_id: dish2._id, quantity: 1 });
    // await orderDetail1.save();
    // await orderDetail2.save();

    // // Payments
    // const payment1 = new Payment({ order_id: order1._id, paymentMethod: 'Credit Card', totalPrice: 35.98, status: 'PAID' });
    // const payment2 = new Payment({ order_id: order2._id, paymentMethod: 'Cash', totalPrice: 15.98, status: 'PAID' });
    // await payment1.save();
    // await payment2.save();

    // Work Schedules
    const workSchedule1 = new WorkSchedule({
      user: waiter._id,
      shift: 'Morning',
      date: new Date(),
      performance_score: 95,
      comments: 'Great performance',
      evaluator_by: admin._id
    });
    const workSchedule2 = new WorkSchedule({
      user: chef._id,
      shift: 'Evening',
      date: new Date(),
      performance_score: 85,
      comments: 'Good performance',
      evaluator_by: admin._id
    });
    await workSchedule1.save();
    await workSchedule2.save();

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting seed data:', error);
    process.exit(1);
  }
};

await connectToDatabase().then(() => {
  seedData();
});
