import Grade from "../../DB/models/grade.model.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import { successResponse } from "../../utils/response/success.js";
import { NotFoundException } from "../../utils/response/error.js";

export const getGrades = async (req, res) => {
  const filter = req.user.role === RoleEnum.ADMIN ? {} : { student: req.user._id };

  const grades = await Grade.find(filter)
    .populate("course")
    .populate("student", "firstName lastName studentID email userName")
    .sort({ createdAt: -1 });

  return successResponse({
    res,
    data: grades,
  });
};

export const uploadGrade = async (req, res) => {
  const grade = await Grade.findOneAndUpdate(
    { student: req.body.student, course: req.body.course },
    req.body,
    { new: true, upsert: true, runValidators: true }
  )
    .populate("course")
    .populate("student", "firstName lastName studentID email userName");

  return successResponse({
    res,
    statusCode: 201,
    message: "Grade uploaded successfully",
    data: grade,
  });
};

export const deleteGrade = async (req, res) => {
  const grade = await Grade.findByIdAndDelete(req.params.id);
  if (!grade) {
    return NotFoundException({ message: "Grade not found" });
  }
  return successResponse({
    res,
    message: "Grade deleted successfully",
  });
};
