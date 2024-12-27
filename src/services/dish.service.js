import Dish from '../models/dish.model.js';

let fetchDishByName = async (name) => {
    return await Dish.findOne({name}).select({ createdAt: 0, updatedAt: 0 });
};

export const saveDishService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await fetchDishByName(data.name);
            if (isExist) {
                resolve({
                    errCode: 1,
                    message: "Dish already exists!"
                })
            } else {
                console.log("check data", data);
                await Dish.create({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category,    
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

export const fetchDishById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dish = await Dish.findOne({
                // raw: true,
                _id: id
            }).select({
                __v: 0,
                createdAt: 0,
                updatedAt: 0
            });
            // Dishs.get({ plain: true });
            resolve({
                errCode: 0,
                message: "OK",
                data: dish
            })
        } catch (e) {
            reject(e)
        }
    })
}

export const updateDishService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data._id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                })
            }
            let dish = await Dish.findOne({
                _id: data._id
            })
            // console.log("check res", Dish);
            if (dish) {
                dish.name = data.name;
                dish.description = data.description;
                dish.price = data.price;
                dish.category = data.category;
                dish.updatedAt = new Date();
                // await Dish.save(); // lưu 1 đối tượng ko quan tâm đã có hay chưa
                await Dish.updateOne({ _id: data._id }, dish);
                resolve({
                    errCode: 0,
                    message: `Ok`
                });
            } else {
                resolve({
                    errCode: 1,
                    message: `The Dish not found!`
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const deleteDishService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                });
                return;
            }

            let dish = await Dish.findOne({ _id: id });
            if (!dish) {
                resolve({
                    errCode: 1,
                    message: 'Dish not found!'
                });
                return;
            }

            await Dish.deleteOne({ _id: id });

            resolve({
                errCode: 0,
                message: 'Dish deleted successfully!'
            });
        } catch (e) {
            reject(e);
        }
    });
};

export const fetchAllDishService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let Dishes = await Dish.find({})
            resolve({
                errCode: 0,
                message: "OK",
                data: Dishes
            })
        } catch (e) {
            reject(e)
        }
    })
}

