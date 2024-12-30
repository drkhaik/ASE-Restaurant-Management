import {
    saveWorkScheduleService,
    fetchWorkSchedulesService,
    fetchWorkScheduleById,
    updateWorkScheduleService,
    getWorkingDatesByUserService,
    fetchSchedulesPerformanceService
} from '../services/workSchedule.service.js';
import {
    fetchUserExceptManagerRole
} from '../services/user.service.js';

/*Get và post tạo user mới*/
export const getWorkScheduleCreate = async (req, res, next) => {
    try {
        let usersExceptManager = await fetchUserExceptManagerRole();
        // console.log("check users", usersExceptManager);
        if (usersExceptManager) {
            res.render('./workSchedule/add-work-schedule', { title: 'Add new WorkSchedule', users: usersExceptManager });
        } else {
            res.status(500).json({ message: response.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

export const postWorkScheduleCreate = async (req, res, next) => {
    try {
        let response = await saveWorkScheduleService(req.body);
        // console.log("check req.body", req.body);
        if (response.errCode !== 0) {
            return res.status(500).json({ message: response.message });
        }else{
            return res.redirect('/work-schedules');
        }
    } catch (e) {
        console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}

// get working dates by user
export const getWorkingDatesByUser = async (req, res, next) => {
    try {
        const workingDates = await getWorkingDatesByUserService(req.params.userId);
        res.json(workingDates);
    } catch (error) {
        console.error('Error fetching working dates:', error);
        res.status(500).json({ error: error.message });
    }
}

/*get và update user*/
export const getPerformanceAppraisal = async (req, res, next) => {
    try {
        const usersExceptManager = await fetchUserExceptManagerRole();
        if (usersExceptManager) {
            res.render('./workSchedule/performance-appraisal', {
                title: 'Performance Appraisal',
                users: usersExceptManager,
            });
        } else {
            res.status(500).json({ message: 'Error retrieving user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

export const postPerformanceAppraisal = async (req, res, next) => {
    try {
        // console.log("check req.body update", req.body);
        const updateResponse = await updateWorkScheduleService(req.body);
        if (updateResponse.errCode === 0) {
            return res.redirect('/work-schedules');
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

export const fetchWorkSchedules = async (req, res) => {
    try {
        const workScheduleResponse = await fetchWorkSchedulesService();
        const schedulePerformanceResponse = await fetchSchedulesPerformanceService();
        if (workScheduleResponse.errCode === 0) { res.render('workSchedule/manage-work-schedule', { 
                title: 'Work Schedules Management', 
                workSchedules: workScheduleResponse.data, 
                datesForTable: workScheduleResponse.datesForTable,
                schedulePerformance: schedulePerformanceResponse.data
            });
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
