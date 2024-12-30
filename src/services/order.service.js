import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import Dish from '../models/dish.model.js';

export const getDishesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dishes = await Dish.find({}).select({ createdAt: 0, updatedAt: 0, description: 0 });
            resolve({
                errCode: 0,
                message: "OK",
                data: dishes
            })
        } catch (e) {
            reject(e)
        }
    })
}

export const saveOrderService = (data) => {
    return new Promise(async (resolve, reject) => {
        const session = await Order.startSession(); // Start a session for transactions
        session.startTransaction(); // Start the transaction
        
        try {
            // Step 1: Save the Order
            const order = await Order.create([{
                staff_in_charge: data.staff_in_charge,
                total_amount: parseFloat(data.total_amount), // Ensure total amount is a number
                createdAt: new Date(),
                updatedAt: new Date(),
            }], { session }); // Pass session for transaction support

            const orderId = order[0]._id; // Get the created Order ID

            // Step 2: Parse and Save OrderDetails
            const orderDetails = JSON.parse(data.order_details).map(detail => ({
                order_id: orderId,
                dish_id: detail.dishId,
                quantity: detail.quantity,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await OrderDetail.insertMany(orderDetails, { session }); // Insert all OrderDetails in one call

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            resolve({
                errCode: 0,
                message: "Order and OrderDetails saved successfully!",
                orderId: orderId
            });
        } catch (e) {
            // Rollback the transaction on error
            await session.abortTransaction();
            session.endSession();

            console.error('Error saving order:', e);
            reject({
                errCode: 1,
                message: 'Failed to save order and order details',
                error: e.message
            });
        }
    });
};

export const fetchOrderWithDetailsById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the order by ID and remove unnecessary fields
            const order = await Order.findOne({ _id: id })
                .select({ __v: 0, createdAt: 0, updatedAt: 0 })
                .populate('staff_in_charge', 'id name');  // Populate staff_in_charge to include staff's name

            // If no order is found, resolve with an error message
            if (!order) {
                return resolve({
                    errCode: 1,
                    message: 'Order not found!',
                });
            }

            // Fetch corresponding order details and remove unnecessary fields
            const orderDetails = await OrderDetail.find({ order_id: id })
                .select({ __v: 0, createdAt: 0, updatedAt: 0 })
                .populate('dish_id', 'name price');
            // Construct the enriched order object
            const enrichedOrder = {
                ...order.toObject(),  // Convert Mongoose document to plain object
                details: orderDetails // Attach the order details
            };

            // Resolve with the enriched order data
            resolve({
                errCode: 0,
                message: "OK",
                data: enrichedOrder,
            });
        } catch (e) {
            // Log error and reject with an error message
            console.error('Error fetching order with details:', e);
            reject({
                errCode: 1,
                message: 'Failed to fetch order with details',
                error: e.message,
            });
        }
    });
};

export const updateOrderService = (data) => {
    return new Promise(async (resolve, reject) => {
        const session = await Order.startSession(); // Start a session for transactions
        session.startTransaction(); // Start the transaction
        
        try {
            if (!data._id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                });
                return;
            }

            // Step 1: Find and update the Order
            const order = await Order.findOne({ _id: data._id }).session(session);
            if (!order) {
                resolve({
                    errCode: 1,
                    message: 'Order not found!'
                });
                return;
            }

            order.staff_in_charge = data.staff_in_charge;
            order.total_amount = parseFloat(data.total_amount);
            order.status = data.status
            order.updatedAt = new Date();

            await order.save({ session }); // Save the updated order

            // Step 2: Delete old order details and insert new ones
            await OrderDetail.deleteMany({ order_id: data._id }, { session });

            const orderDetails = JSON.parse(data.order_details).map(detail => ({
                order_id: data._id,
                dish_id: detail.dishId,
                quantity: detail.quantity,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await OrderDetail.insertMany(orderDetails, { session }); // Insert new details

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            resolve({
                errCode: 0,
                message: 'Order and OrderDetails updated successfully!',
            });
        } catch (e) {
            // Rollback the transaction on error
            await session.abortTransaction();
            session.endSession();

            console.error('Error updating order:', e);
            reject({
                errCode: 1,
                message: 'Failed to update order and order details',
                error: e.message
            });
        }
    });
};

export const deleteOrderService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                });
                return;
            }

            // Step 1: Find and delete the Order
            let order = await Order.findOne({ _id: id });
            if (!order) {
                resolve({
                    errCode: 1,
                    message: 'Order not found!'
                });
                return;
            }

            // Step 2: Delete associated OrderDetails
            await OrderDetail.deleteMany({ order_id: id });

            // Step 3: Delete the Order
            await Order.deleteOne({ _id: id });

            resolve({
                errCode: 0,
                message: 'Order and associated details deleted successfully!'
            });
        } catch (e) {
            console.error('Error deleting order:', e);
            reject({
                errCode: 1,
                message: 'Failed to delete order',
                error: e.message
            });
        }
    });
};

export const fetchAllOrderService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch orders and remove unnecessary fields
            const orders = await Order.find({}).select({ __v: 0, updatedAt: 0 })
                .populate('staff_in_charge', 'name');

            // Fetch order details and remove unnecessary fields
            const orderDetails = await OrderDetail.find({}).select({ __v: 0, createdAt: 0, updatedAt: 0 })
                .populate('dish_id', 'name price');

            // Reduce orderDetails to a lookup table by order_id
            const detailsByOrderId = orderDetails.reduce((acc, detail) => {
                const orderId = String(detail.order_id); // Convert order_id to string
                if (!acc[orderId]) {
                    acc[orderId] = [];
                }
                acc[orderId].push(detail);
                return acc;
            }, {});

            // Combine Orders and their corresponding OrderDetails
            const enrichedOrders = orders.map(order => {
                const orderData = order.toObject(); // Convert Mongoose document to plain object
                
                const createdAt = new Date(orderData.createdAt); // Get the createdAt timestamp
                const currentTime = new Date(); // Current time
                
                // Calculate the time difference
                const timeDifference = currentTime - createdAt; // Difference in milliseconds
                
                // Convert to hours and minutes
                const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert to hours
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
                
                return {
                    ...orderData,  // Use the plain object
                    details: detailsByOrderId[orderData._id] || [], // Attach details or default to an empty array
                    order_time: { hours, minutes }, 
                };
            });

            // Sort the orders by the oldest first (ascending order)
            enrichedOrders.sort((a, b) => {
                const timeA = a.order_time.hours * 60 + a.order_time.minutes; // Convert to minutes
                const timeB = b.order_time.hours * 60 + b.order_time.minutes;
                return timeA - timeB; // Sort ascending (oldest first)
            });

            // Resolve with the enriched and sorted data
            resolve({
                errCode: 0,
                message: "OK",
                data: enrichedOrders,
            });
        } catch (e) {
            reject({
                errCode: 1,
                message: e.message,
            });
        }
    });
};
