'use strict';

import Express from "express";
import {
    fetchWorkSchedules,
    getWorkScheduleCreate,
    postWorkScheduleCreate,
    getPerformanceAppraisal,
    postPerformanceAppraisal,
    getWorkingDatesByUser
} from "../controllers/workSchedule.controller.js";
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = Express.Router();

// Add work-schedule
router.get('/add-work-schedule', checkPermission("manage_schedules"), getWorkScheduleCreate);
router.post('/add-work-schedule', checkPermission("manage_schedules"), postWorkScheduleCreate);

// Get work-schedules
router.get('/', checkPermission("view_schedules"), fetchWorkSchedules);

// View working dates
router.get('/working-dates/:userId', checkPermission("view_schedules"), getWorkingDatesByUser);

// Performance appraisal
router.get('/performance-appraisal', checkPermission("manage_schedules"), getPerformanceAppraisal);
router.post('/performance-appraisal', checkPermission("manage_schedules"), postPerformanceAppraisal);

export default router;
