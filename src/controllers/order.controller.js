import {
    saveOrderService,
    fetchAllOrderService
} from '../services/order.service.js';

// import { getUsersService } from '../services/user.service.js';

/*Get và post tạo order mới*/
export const getOrderCreate = async (req, res, next) => {
    try {
        // let dishResponse = await getDishesService();
        // if (userResponse.errCode === 0) {
            res.render('./order/form-add-order', { title: 'Add new Order', dishes: {} });
        // } else {
        //     res.status(500).json({ message: userResponse.message });
        // }
    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

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

const sampleOrders = [
    {
        _id: 'ORD123',
        staff_in_charge: { name: 'John Doe' },
        total_amount: 50.75,
        status: { name: 'PENDING' },
        order_time: {hours: 0, minutes: 56},
        details: [
            {
                dish: { name: 'Spaghetti Carbonara', price: 12.99 },
                quantity: 2
            },
            {
                dish: { name: 'Caesar Salad', price: 8.50 },
                quantity: 1
            },
            {
                dish: { name: 'Garlic Bread', price: 3.99 },
                quantity: 3
            }
        ]
    },
    {
        _id: 'ORD124',
        staff_in_charge: { name: 'Jane Smith' },
        total_amount: 78.30,
        status: { name: 'DELIVERED' },
        order_time: {hours: 0, minutes: 15},
        details: [
            {
                dish: { name: 'Chicken Alfredo', price: 15.50 },
                quantity: 2
            },
            {
                dish: { name: 'Mixed Grilled Vegetables', price: 5.99 },
                quantity: 1
            },
            {
                dish: { name: 'Tiramisu', price: 7.00 },
                quantity: 2
            }
        ]
    },
    {
        _id: 'ORD126',
        staff_in_charge: { name: 'Lily Smith' },
        total_amount: 78.30,
        status: { name: 'PAID' },
        order_time: {hours: 1, minutes: 56},
        details: [    ]
    },
];


export const fetchAllOrder = async (req, res) => {
    try {
        let response = await fetchAllOrderService();
        if (response.errCode === 0) {
            res.render('order/manage-order', { title: 'Order Tracking', orders: sampleOrders });
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


