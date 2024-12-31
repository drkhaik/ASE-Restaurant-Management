import {
    saveOrderService,
    fetchAllOrderService,
    getDishesService,
    fetchOrderWithDetailsById,
    updateOrderService,
    deleteOrderService
} from '../services/order.service.js';

/*Get và post tạo order mới*/
export const getOrderCreate = async (req, res, next) => {
    try {
        // Fetch dishes from your service
        let dishResponse = await getDishesService();
        
        if (dishResponse.errCode === 0) {
            // Group the dishes by category
            const groupedDishes = dishResponse.data.reduce((acc, dish) => {
                // Check if the category exists in the accumulator, otherwise create it
                if (!acc[dish.category]) {
                    acc[dish.category] = [];
                }
                // Push the dish into the corresponding category
                acc[dish.category].push(dish);
                return acc;
            }, {});

            // Render the page with grouped dishes
            res.render('./order/form-add-order', {
                title: 'Add new Order',
                groupedDishes: groupedDishes // Pass grouped dishes to the template
            });
        } else {
            res.status(500).json({ message: dishResponse.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong...');
    }
};

export const postOrderCreate = async (req, res, next) => {
    try {
        let response = await saveOrderService(req.body);
        console.log("check req.body", req.body);
        if (response.errCode === 0) {
            return res.redirect('/orders');
        } else {
            return res.status(500).json({ message: response.message });
        }
    } catch (e) {
        console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}

/*get và update order*/
export const getOrderEdit = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        // Fetch the order with details
        const orderResponse = await fetchOrderWithDetailsById(orderId);
        // Check if the order was successfully fetched
        if (orderResponse.errCode !== 0) {
            return res.status(500).json({ message: 'Error retrieving order' });
        }
        // Fetch dishes from your service
        const dishResponse = await getDishesService();
        // Check if dishes were successfully fetched
        if (dishResponse.errCode !== 0) {
            return res.status(500).json({ message: dishResponse.message });
        }
        // Group the dishes by category
        const groupedDishes = dishResponse.data.reduce((acc, dish) => {
            if (!acc[dish.category]) {
                acc[dish.category] = [];
            }
            acc[dish.category].push(dish);
            return acc;
        }, {});
        // Render the page with order details and grouped dishes
        res.render('./order/form-edit-order', {
            title: 'Update Order',
            order: orderResponse.data,
            groupedDishes: groupedDishes // Pass grouped dishes to the template
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong...');
    }
};

export const postOrderUpdate = async (req, res, next) => {
    try {
        console.log("check req.body update", req.body);
        let updateResponse = await updateOrderService(req.body);
        if (updateResponse.errCode === 0) {
            return res.redirect('/orders');
        } else {
            return res.status(500).json({ message: updateResponse.message });
        }
    } catch (e) {
        console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const response = await deleteOrderService(orderId);
        if (response.errCode === 0) {
            return res.redirect('/orders');
        } else {
            return res.status(500).json({ message: response.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};

export const fetchAllOrder = async (req, res) => {
    try {
        let response = await fetchAllOrderService();
        console.log(response.data)
        if (response.errCode === 0) {
            res.render('order/manage-order', { title: 'Order Tracking', orders: response.data });
        } else {
            res.status(500).json({ message: response.message });
        }
    } catch (e) {
        console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}


