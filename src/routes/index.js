import Express from "express";
import authRoute from './auth.js';
import tableRoute from './table.js';
import userRoute from './user.js';
import workScheduleRoute from './workSchedule.js';
import orderRoute from './order.js';
import dishRoute from './dish.js';
import paymentRoute from './payment.js'
import inventoryRoute from './inventory.js';
import { requireAuth, checkUser } from '../middleware/authMiddleware.js';


const router = Express.Router();

const initApiRoutes = (app) => {
    router.use('*', checkUser)
    router.use(authRoute)
    router.get('/',(req, res) => {
        res.redirect('/dashboard');
    });
    router.get('/dashboard', requireAuth, (req, res) => {
        res.render('index', { title: 'Home Page' });
    });
    router.use('/tables', requireAuth, tableRoute)
    router.use('/users', requireAuth, userRoute);
    router.use('/orders', requireAuth, orderRoute);
    router.use('/work-schedules', requireAuth , workScheduleRoute);
    router.use('/dishes', requireAuth, dishRoute);
    router.use('/payment',  paymentRoute);
    router.use('/inventories', requireAuth, inventoryRoute);
    router.use((req, res) => {
        res.status(404).render('404', { title: '404', layout: false });
    });
    return app.use(router);
}

export default initApiRoutes;