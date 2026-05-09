import Course from "../../DB/models/course.model.js";
import Enrollment from "../../DB/models/enrollment.model.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const getAllCourses = async (req, res) => {
  const courses = await Course.find()
    .populate("instructor", "firstName lastName userName email role")
    .sort({ createdAt: -1 });

  const enrollmentCounts = await Enrollment.aggregate([
    { $group: { _id: "$course", count: { $sum: 1 } } },
  ]);
  const countByCourse = new Map(enrollmentCounts.map((item) => [String(item._id), item.count]));

  return successResponse({
    res,
    data: courses.map((course) => ({
      ...course.toJSON(),
      enrolledCount: countByCourse.get(String(course._id)) || 0,
    })),
  });
};

export const createCourse = async (req, res) => {
  const existing = await Course.findOne({ code: req.body.code?.toUpperCase() });
  if (existing) {
    return ConflictException({ message: "Course code already exists" });
  }

  const course = await Course.create(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Course created successfully",
    data: course,
  });
};

export const updateCourse = async (req, res) => {
  if (req.body.code) {
    const existing = await Course.findOne({
      code: req.body.code.toUpperCase(),
      _id: { $ne: req.params.id },
    });
    if (existing) {
      return ConflictException({ message: "Course code already exists" });
    }
  }

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return NotFoundException({ message: "Course not found" });
  }

  return successResponse({
    res,
    message: "Course updated successfully",
    data: course,
  });
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return NotFoundException({ message: "Course not found" });
  }

  await Enrollment.deleteMany({ course: req.params.id });

  return successResponse({
    res,
    message: "Course deleted successfully",
  });
};

export const enrollCourse = async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return NotFoundException({ message: "Course not found" });
  }

  const existing = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (existing) {
    return BadRequestException({ message: "Already enrolled" });
  }

  const enrolledCount = await Enrollment.countDocuments({ course: courseId });
  if (course.capacity && enrolledCount >= course.capacity) {
    return BadRequestException({ message: "Course is full" });
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  await enrollment.populate("course");

  return successResponse({
    res,
    statusCode: 201,
    message: "Enrolled successfully",
    data: enrollment,
  });
};

export const withdrawCourse = async (req, res) => {
  const { courseId } = req.body;

  const deleted = await Enrollment.findOneAndDelete({
    student: req.user._id,
    course: courseId,
  });

  if (!deleted) {
    return NotFoundException({ message: "Enrollment not found" });
  }

  return successResponse({
    res,
    message: "Withdrawn successfully",
  });
};

export const getMyCourses = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "course",
      populate: { path: "instructor", select: "firstName lastName userName email" },
    })
    .sort({ createdAt: -1 });

  return successResponse({
    res,
    data: enrollments,
  });
};
