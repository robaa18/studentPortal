import Enrollment from "../../DB/models/enrollment.model.js";
import Schedule from "../../DB/models/schedule.model.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import { NotFoundException } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

const populateSchedule = (query) =>
  query.populate({
    path: "course",
    populate: { path: "instructor", select: "firstName lastName userName email" },
  });

export const getSchedule = async (req, res) => {
  if (req.user.role === RoleEnum.ADMIN) {
    const schedule = await populateSchedule(Schedule.find().sort({ day: 1, time: 1 }));
    return successResponse({ res, data: schedule });
  }

  const enrollments = await Enrollment.find({ student: req.user._id });
  const courseIds = enrollments.map((enrollment) => enrollment.course).filter(Boolean);

  const schedule = await populateSchedule(
    Schedule.find({ course: { $in: courseIds } }).sort({ day: 1, time: 1 })
  );

  return successResponse({
    res,
    data: schedule,
  });
};

export const createSchedule = async (req, res) => {
  const schedule = await Schedule.create(req.body);
  await schedule.populate({
    path: "course",
    populate: { path: "instructor", select: "firstName lastName userName email" },
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Schedule item created successfully",
    data: schedule,
  });
};

export const updateSchedule = async (req, res) => {
  const schedule = await populateSchedule(
    Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
  );

  if (!schedule) {
    return NotFoundException({ message: "Schedule item not found" });
  }

  return successResponse({
    res,
    message: "Schedule item updated successfully",
    data: schedule,
  });
};

export const deleteSchedule = async (req, res) => {
  const deleted = await Schedule.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return NotFoundException({ message: "Schedule item not found" });
  }

  return successResponse({
    res,
    message: "Schedule item deleted successfully",
  });
};
