import Express from "express";
import userRoute from './user.js';
import orderRoute from './order.js';

const router = Express.Router();

const initApiRoutes = (app) => {
    router.use(userRoute);
    router.use(orderRoute);
    return app.use(router);
}

export default initApiRoutes;