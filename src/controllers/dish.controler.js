import {
    saveDishService,
    fetchAllDishService,
    fetchDishById,
    updateDishService,
    deleteDishService
} from '../services/dish.service.js';


/*Get và post tạo dish mới*/
export const getDishCreate = async (req, res, next) => {
    try {
        res.render('./dish/form-add-dish', { title: 'Add new Dish'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

export const postDishCreate = async (req, res, next) => {
    try {
        let response = await saveDishService(req.body);
        console.log("check req.body", req.body);
        if (response.errCode === 0) {
            return res.redirect('/dishes');
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

/*get và update dish*/
export const getDishEdit = async (req, res, next) => {
    try {
        const dishId = req.params.id;
        // console.log("check dish Id", dishId);
        const dish = await fetchDishById(dishId);
        if (dish.errCode === 0) {
            res.render('./dish/form-edit-dish', { title: 'Update Dish', dish: dish.data });
        } else {
            res.status(500).json({ message: 'Error retrieving dish' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

export const postDishUpdate = async (req, res, next) => {
    try {
        console.log("check req.body update", req.body);
        let updateResponse = await updateDishService(req.body);
        if (updateResponse.errCode === 0) {
            return res.redirect('/dishes');
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

/* Delete a dish by ID */
export const deleteDish = async (req, res, next) => {
    try {
        const dishId = req.params.id;

        // Call the service to delete the dish
        const response = await deleteDishService(dishId);

        if (response.errCode === 0) {
            // Redirect to the dish list page after successful deletion
            return res.redirect('/dishes');
        } else {
            // Respond with an error message if the dish could not be found or deleted
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

export const fetchAllDish = async (req, res) => {
    try {
        let response = await fetchAllDishService();
        if (response.errCode === 0) {
            res.render('dish/manage-dish', { title: 'Dish List', dishes: response.data });
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
