'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchWorkSchedules,
    getWorkScheduleCreate,
    postWorkScheduleCreate,
    getPerformanceAppraisal,
    postPerformanceAppraisal,
    getWorkingDatesByUser
}
from "../controllers/workSchedule.controller.js"

// add work-schedule
router.get('/add-work-schedule', getWorkScheduleCreate);
router.post('/add-work-schedule', postWorkScheduleCreate);

// get work-schedules
router.get('/', fetchWorkSchedules);

router.get('/working-dates/:userId', getWorkingDatesByUser);
router.get('/performance-appraisal', getPerformanceAppraisal);
router.post('/performance-appraisal', postPerformanceAppraisal);


export default router;