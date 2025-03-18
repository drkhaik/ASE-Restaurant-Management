import WorkSchedule from '../models/workSchedule.model.js';
import _ from 'lodash';
import moment from 'moment';

const fetchScheduleByUserAndDate = async ({ user, date }) => {
    return await WorkSchedule.findOne({ user, date });
};

export const saveWorkScheduleService = async (data) => {
    try {
        const existingSchedule = await fetchScheduleByUserAndDate({ user: data.user_id, date: data.date });

        if (existingSchedule) {
            existingSchedule.shift = data.shift;
            existingSchedule.updatedAt = new Date();
            await existingSchedule.save();
        } else {
            const workSchedule = new WorkSchedule({
                user: data.user_id,
                shift: data.shift,
                date: data.date,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await workSchedule.save();
        }

        return { errCode: 0, message: "OK" };
    } catch (e) {
        return { errCode: 1, message: "Error saving work schedule", error: e };
    }
};

export const fetchWorkScheduleById = async (id) => {
    try {
        let workSchedule = await WorkSchedule.findById(id).select({
            __v: 0,
            createdAt: 0,
            updatedAt: 0
        });

        if (!workSchedule) {
            return { errCode: 1, message: "Work schedule not found" };
        }

        return { errCode: 0, message: "OK", data: workSchedule };
    } catch (e) {
        return { errCode: 1, message: "Error fetching work schedule", error: e };
    }
};

export const getWorkingDatesByUserService = async (userId) => {
    try {
        const workSchedules = await WorkSchedule.find({ user: userId });

        const workingDates = workSchedules.map(schedule => ({
            _id: schedule._id, 
            formattedDate: schedule.date.toISOString().split('T')[0],
            shift: schedule.shift
        }));

        return workingDates;
    } catch (e) {
        console.error("Error fetching working dates:", e);
        return { errCode: 1, message: "Error fetching working dates", error: e };
    }
};

export const updateWorkScheduleService = async (data) => {
    try {
        if (!data._id) {
            return { errCode: 2, message: 'Missing required parameters!' };
        }

        let workSchedule = await WorkSchedule.findById(data._id);
        if (!workSchedule) {
            return { errCode: 1, message: 'WorkSchedule not found!' };
        }

        workSchedule.performance_score = data.performance_score;
        workSchedule.comments = !_.isEmpty(data.comments) ? data.comments : "Not yet";
        workSchedule.updatedAt = new Date();

        await workSchedule.save();

        return { errCode: 0, message: "OK" };
    } catch (e) {
        return { errCode: 1, message: "Error updating work schedule", error: e };
    }
};

export const fetchSchedulesPerformanceService = async () => {
    try {
        const workSchedules = await WorkSchedule.find({ performance_score: { $exists: true } })
            .populate('user', 'name')
            .populate('evaluator_by', 'name');

        const formattedSchedules = workSchedules.map(schedule => ({
            ...schedule.toObject(),
            date: moment(schedule.date).format('MMM D'),
            user: schedule.user ? schedule.user.name : "Unknown"
        }));

        return { errCode: 0, message: "OK", data: formattedSchedules };
    } catch (e) {
        return { errCode: 1, message: "Error fetching schedules performance", error: e };
    }
};

export const fetchWorkSchedulesService = async () => {
    try {
        const workSchedules = await WorkSchedule.find()
            .populate('user', 'name')
            .populate('evaluator_by', 'name');

        const { groupedScheduleData, datesForTable } = formatWorkSchedules(workSchedules);

        return { errCode: 0, message: "OK", data: groupedScheduleData, datesForTable };
    } catch (e) {
        return { errCode: 1, message: "Error fetching work schedules", error: e };
    }
};

const formatWorkSchedules = (workSchedules) => {
    const formattedSchedules = [];
    const datesSet = new Set();

    for (let schedule of workSchedules) {
        let scheduleObj = schedule.toObject();
        let formatDate = moment(schedule.date).format('MMM D');

        formattedSchedules.push({ 
            ...scheduleObj, 
            date: formatDate, 
            user: scheduleObj.user ? scheduleObj.user.name : "Unknown" 
        });

        datesSet.add(formatDate);
    }

    const datesForTable = Array.from(datesSet);
    const groupedScheduleData = groupedSchedule(formattedSchedules);

    return { groupedScheduleData, datesForTable };
};

const groupedSchedule = (scheduleData) => {
    const groupedSchedule = {};

    scheduleData.forEach(entry => {
        const { date, user, shift } = entry;
        if (!groupedSchedule[date]) {
            groupedSchedule[date] = {};
        }
        groupedSchedule[date][user] = shift;
    });

    const allUsers = Array.from(new Set(scheduleData.map(entry => entry.user)));

    return allUsers.map(user => {
        const row = { Staff: user };
        for (const date in groupedSchedule) {
            row[date] = groupedSchedule[date][user] || 'off';
        }
        return row;
    });
};
