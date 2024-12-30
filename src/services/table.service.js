import Table from '../models/table.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import { saveOrderService } from './order.service.js';


let fetchTableByName = async (name) => {
    return await Table.findOne({name}).select({ createdAt: 0, updatedAt: 0 });
};

export const saveTableService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await fetchTableByName(data.name);
            if (isExist) {
                resolve({
                    errCode: 1,
                    message: "Table already exists!"
                })
            } else {
                console.log("check data", data);
                await Table.create({
                    name: data.name,
                    status: data.status,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                resolve({
                    errCode: 0,
                    message: "OK",
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const fetchTableById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the table by ID and remove unnecessary fields
            const table = await Table.findOne({ _id: id })
            .select({ __v: 0, createdAt: 0, updatedAt: 0 })
            .populate('currentOrder', 'status total_amount'); // Populating only the currentOrder field

            // If no table is found, resolve with an error message
            if (!table) {
                return resolve({
                    errCode: 1,
                    message: 'Table not found!',
                });
            }

            // Fetch corresponding order details for the current order if available
            let orderDetails = [];
            if (table.currentOrder) {
                // Fetch order details only if the table has a current order
                const order = await OrderDetail.find({ order_id: table.currentOrder._id })
                    .select({ __v: 0, createdAt: 0, updatedAt: 0 })
                    .populate('dish_id', 'name price'); // Populating dish details (name, price)

                // Simplify order details to only include necessary fields (dish_id, quantity)
                orderDetails = order.map(detail => ({
                    dish_id: {
                        _id: detail.dish_id._id,
                        name: detail.dish_id.name,
                        price: detail.dish_id.price,
                    },
                    quantity: detail.quantity,
                }));
            }

            // Construct the enriched table object
            const enrichedTable = {
                _id: table._id,  // Keep table's basic info
                name: table.name,
                status: table.status,
                currentOrder: {
                    _id: table.currentOrder ? table.currentOrder._id : null,
                    status: table.currentOrder ? table.currentOrder.status : null,
                    total_amount: table.currentOrder ? table.currentOrder.total_amount : null, // Add the total_amount here
                    order_details: orderDetails, // Add the order details directly inside the current order
                },
            };
            console.log("enrichedTable:", JSON.stringify(enrichedTable, null, 2))
            // Resolve with the enriched table data
            resolve({
                errCode: 0,
                message: "OK",
                data: enrichedTable,
            });
        } catch (e) {
            // Log error and reject with an error message
            console.error('Error fetching table with details:', e);
            reject({
                errCode: 1,
                message: 'Failed to fetch table with details',
                error: e.message,
            });
        }
    });
};

export const updateTableService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Step 1: Check for Missing Parameters
            if (!data._id) {
                return resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                });
            }
            // Step 2: Find the table in the database by its _id
            let table = await Table.findOne({
                _id: data._id
            });

            // If table not found
            if (!table) {
                return resolve({
                    errCode: 1,
                    message: `The Table not found!`
                });
            }
            // Step 3: Update table details (name, status, etc.)
            table.name = data.name;
            table.status = data.status;
            // Step 4: Parse the currentOrder if available
            let currentOrder;
            if (data.currentOrder) {
                try {
                    currentOrder = JSON.parse(data.currentOrder);
                    console.log("currentOrder:", currentOrder); // Optional: Check currentOrder contents
                } catch (e) {
                    console.error("Error parsing currentOrder:", e);
                    return resolve({
                        errCode: 3,
                        message: 'Failed to parse currentOrder!'
                    });
                }
            }
            // Step 5: Check if currentOrder exists and save it
            if (currentOrder) {
                const response = await saveOrderService(currentOrder);
                // Check if saveOrderService was successful
                if (response.errCode !== 0) {
                    // Handle error from saveOrderService
                    return resolve({
                        errCode: response.errCode,
                        message: response.message
                    });
                }
                // If saveOrderService was successful, proceed with the table update
                table.currentOrder = response.orderId; // Use the returned orderId from saveOrderService
            }
            // Step 6: Set the updatedAt timestamp
            table.updatedAt = new Date();

            // Step 7: Update the table in the database
            await Table.updateOne({ _id: data._id }, table);

            // Step 8: Resolve with a success message
            resolve({
                errCode: 0,
                message: `Table updated successfully!`
            });

        } catch (e) {
            // If any error occurs, reject the promise with the error details
            reject({
                errCode: 1,
                message: 'Failed to update table',
                error: e.message
            });
        }
    });
};

export const deleteTableService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                });
                return;
            }

            let table = await Table.findOne({ _id: id });
            if (!table) {
                resolve({
                    errCode: 1,
                    message: 'Table not found!'
                });
                return;
            }

            await Table.deleteOne({ _id: id });

            resolve({
                errCode: 0,
                message: 'Table deleted successfully!'
            });
        } catch (e) {
            reject(e);
        }
    });
};

export const fetchAllTableService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch all tables with their associated currentOrder (populate the currentOrder field)
            const tables = await Table.find({}).select({ __v: 0, createdAt:0, updatedAt: 0 })
                .populate({
                    path: 'currentOrder',
                    select: { __v: 0, updatedAt: 0 },
                    populate: {
                        path: 'staff_in_charge',
                        select: 'name',
                    }
                });
            
            // Fetch order details related to each order
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

            // Enrich each table with its order data
            const enrichedTables = tables.map(table => {
                const tableData = table.toObject(); // Convert Mongoose document to plain object
                
                if (tableData.currentOrder) {
                    const orderData = tableData.currentOrder;
                    const createdAt = new Date(orderData.createdAt); // Get the createdAt timestamp
                    const currentTime = new Date(); // Current time

                    // Calculate the time difference
                    const timeDifference = currentTime - createdAt; // Difference in milliseconds

                    // Convert to hours and minutes
                    const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert to hours
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
                    
                    return {
                        ...tableData,  // Use the plain object
                        order_time: { hours, minutes }, // Add order time
                        details: detailsByOrderId[String(orderData._id)] || [], // Add order details (dishes)
                    };
                }

                // If no current order, return table data with no order information
                return {
                    ...tableData,
                    order_time: { hours: 0, minutes: 0 },
                    details: [],
                };
            });
            // Resolve with the enriched data
            resolve({
                errCode: 0,
                message: "OK",
                data: enrichedTables,
            });
        } catch (e) {
            reject({
                errCode: 1,
                message: e.message,
            });
        }
    });
};
