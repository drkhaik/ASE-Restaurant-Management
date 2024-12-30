import {
    saveTableService,
    fetchAllTableService,
    fetchTableById,
    updateTableService,
    deleteTableService
} from '../services/table.service.js';

import { getDishesService } from '../services/order.service.js';


/*Get và post tạo table mới*/
export const getTableCreate = async (req, res, next) => {
    try {
        res.render('./table/form-add-table', { title: 'Add new Table'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

export const postTableCreate = async (req, res, next) => {
    try {
        let response = await saveTableService(req.body);
        console.log("check req.body", req.body);
        if (response.errCode === 0) {
            return res.redirect('/tables');
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

/*get và update table*/
export const getTableDetail = async (req, res, next) => {
    try {
        const tableId = req.params.id;

        // Fetch table details by ID
        const tableResponse = await fetchTableById(tableId);
        if (tableResponse.errCode !== 0) {
            return res.status(500).json({ message: 'Error retrieving table' });
        }

        // Fetch dishes from the service
        const dishResponse = await getDishesService();
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

        // Render the table details page with grouped dishes
        res.render('./table/table-details', {
            title: 'Table Details',
            table: tableResponse.data,
            groupedDishes: groupedDishes // Pass grouped dishes to the template
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong...');
    }
};


export const postTableUpdate = async (req, res, next) => {
    try {
        console.log("check req.body update", req.body);
        let updateResponse = await updateTableService(req.body);
        if (updateResponse.errCode === 0) {
            return res.redirect('/tables');
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

/* Delete a table by ID */
export const deleteTable = async (req, res, next) => {
    try {
        const tableId = req.params.id;

        // Call the service to delete the table
        const response = await deleteTableService(tableId);

        if (response.errCode === 0) {
            // Redirect to the table list page after successful deletion
            return res.redirect('/tables');
        } else {
            // Respond with an error message if the table could not be found or deleted
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

export const fetchAllTable = async (req, res) => {
    try {
        let response = await fetchAllTableService();
        if (response.errCode === 0) {
            res.render('table/manage-table', { title: 'Table List', tables: response.data });
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
