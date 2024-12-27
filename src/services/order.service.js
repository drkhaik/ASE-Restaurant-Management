import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';

export const saveOrderService = (data) => {
    return new Promise(async (resolve, reject) => {
        const session = await Order.startSession(); // Start a session for transactions
        session.startTransaction(); // Start the transaction
        
        try {
            // Step 1: Save the Order
            const order = await Order.create([{
                staff_in_charge: data.staff_in_charge,
                total_amount: data.total_amount,
                createdAt: new Date(),
                updatedAt: new Date(),
            }], { session }); // Pass session for transaction support

            const orderId = order[0]._id; // Get the created Order ID

            // Step 2: Save OrderDetails
            const orderDetails = data.order_details.map(detail => ({
                order_id: orderId,
                dish_id: detail.dish_id,
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
            });
        } catch (e) {
            // Rollback the transaction on error
            await session.abortTransaction();
            session.endSession();
            reject(e);
        }
    });
};


export const fetchAllOrderService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Step 1: Fetch Orders with populated staff_in_charge
            const orders = await Order.find({})
                .populate('staff_in_charge', 'name') // Populate staff details with selected fields
                .lean(); // Convert Mongoose documents to plain JavaScript objects for manipulation

            // Step 2: Fetch all OrderDetails and group by order_id
            const orderDetails = await OrderDetail.find({}).lean();
            const detailsByOrderId = orderDetails.reduce((acc, detail) => {
                if (!acc[detail.order_id]) {
                    acc[detail.order_id] = [];
                }
                acc[detail.order_id].push(detail);
                return acc;
            }, {});

            // Step 3: Combine Orders and their corresponding OrderDetails
            const enrichedOrders = orders.map(order => {
                const createdAt = new Date(order.createdAt); // Get the createdAt timestamp
                const currentTime = new Date(); // Current time

                // Calculate the time difference
                const timeDifference = currentTime - createdAt; // Difference in milliseconds

                // Convert to hours and minutes
                const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert to hours
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes

                return {
                    ...order,
                    order_details: detailsByOrderId[order._id] || [], // Attach details or default to an empty array
                    order_time: {hours, minutes}, 
                };
            });

            // Resolve with the enriched data
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



