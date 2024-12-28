import Express from "express";
import userRoute from './user.js';
import orderRoute from './order.js';
import dishRoute from './dish.js';
import paymentRoute from './payment.js'
import inventoryRoute from './inventory.js';

const router = Express.Router();

const initApiRoutes = (app) => {
    router.get('/dashboard', (req, res) => {
        res.render('index', { title: 'Home Page' });
    });
    router.use('/users',userRoute);
    router.use('/orders',orderRoute);
    router.use('/dishes',dishRoute);
    router.use('/payment', paymentRoute);
    router.use(inventoryRoute);
    router.use((req, res) => {
        res.status(404).render('404', { title: '404' });

    });
    return app.use(router);
}

export default initApiRoutes;