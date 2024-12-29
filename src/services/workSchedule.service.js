import WorkSchedule from '../models/workSchedule.model.js';
import _ from 'lodash';
import moment from 'moment';

const fetchScheduleByUserAndDate = async ({user, date}) => {
    return await WorkSchedule.findOne({
        user: user,
        date: date
    })
}

export const saveWorkScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
                // console.log("check workSchedule data", data);
                // figure out if it duplicate date and user
                const existingSchedule = await fetchScheduleByUserAndDate({user: data.user_id, date: data.date });

                if (existingSchedule){
                    existingSchedule.shift = data.shift;
                    existingSchedule.updatedAt = new Date();
                    await existingSchedule.save();
                }else{
                    const workSchedule = new WorkSchedule({
                        user: data.user_id,
                        shift: data.shift,
                        date: data.date,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    await workSchedule.save();
                }
                resolve({
                    errCode: 0,
                    message: "OK",
                })
            
        } catch (e) {
            reject(e);
        }
    })
}

export const fetchWorkScheduleById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let workSchedules = await WorkSchedule.findOne({
                // raw: true,
                _id: id
            }).select({
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
            });
            // users.get({ plain: true });
            resolve({
                errCode: 0,
                message: "OK",
                data: workSchedules
            })
        } catch (e) {
            reject(e)
        }
    })
}

export const getWorkingDatesByUserService = async (userId) => {
        try {
            console.log("check userId", userId);
            const workSchedules = await WorkSchedule.find({ user: userId});
            const workingDates = workSchedules.map(schedule => ({
                _id: schedule._id, // _id for update schedule
                formattedDate: schedule.date.toISOString().split('T')[0],
                shift: schedule.shift
            }));
            // console.log("check working date", workingDates);
            return workingDates;
        } catch (e) {
            throw new Error('Error fetching working dates', e);
        }
}

export const updateWorkScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data._id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                })
            }
            let workSchedule = await WorkSchedule.findOne({
                _id: data._id
            })
            // console.log("check res", user);
            if (workSchedule) {
                workSchedule.performance_score = data.performance_score,
                    workSchedule.comments = !_.isEmpty(data.comments) ? data.comments : "Not yet",
                // workSchedule.evaluator_by = data.evaluator_by,
                workSchedule.updatedAt = new Date();
                await WorkSchedule.updateOne({ _id: data._id }, workSchedule);
                resolve({
                    errCode: 0,
                    message: `Ok`
                });
            } else {
                resolve({
                    errCode: 1,
                    message: `The WorkSchedule not found!`
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const fetchSchedulesPerformanceService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const workSchedules = await WorkSchedule.find({
                performance_score: { $exists: true}
            })
            .populate('user', 'name')
            .populate('evaluator_by', 'name');
            
            const formattedSchedules = [];
            for (let i = 0; i < workSchedules.length; i++) {
                let schedule = workSchedules[i].toObject();
                let formatDate = moment(workSchedules[i].date).format('MMM D');
                let user = schedule.user;
                formattedSchedules.push({ ...schedule, date: formatDate, user: user.name });
            }

            resolve({
                errCode: 0,
                message: "OK",
                data: formattedSchedules,
            })

        } catch (e) {
            reject(e)
        }
    })
}

export const fetchWorkSchedulesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const workSchedules = await WorkSchedule.find()
                .populate('user', 'name')
                .populate('evaluator_by', 'name');

            const { groupedScheduleData, datesForTable } = formatWorkSchedules(workSchedules);
            resolve({
                errCode: 0,
                message: "OK",
                data: groupedScheduleData,
                datesForTable: datesForTable, 
            })

        } catch (e) {
            reject(e)
        }
    })
}

const formatWorkSchedules = (workSchedules) => {
    const formattedSchedules = [];
    const datesSet = new Set();

    for (let i = 0; i < workSchedules.length; i++) {
        let schedule = workSchedules[i].toObject();
        let formatDate = moment(workSchedules[i].date).format('MMM D');
        let user = schedule.user;

        formattedSchedules.push({ ...schedule, date: formatDate, user: user.name });
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

    const formattedSchedule = allUsers.map(user => {
        const row = { Staff: user };
        for (const date in groupedSchedule) {
            row[date] = groupedSchedule[date][user] || 'off';
        }
        return row;
    });

    return formattedSchedule;
}
