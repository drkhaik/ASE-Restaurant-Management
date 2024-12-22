import Express from "express";
import userRoute from './user.js';

const router = Express.Router();

const initApiRoutes = (app) => {
    router.use("/users", userRoute);

    return app.use(router);
}

export default initApiRoutes;