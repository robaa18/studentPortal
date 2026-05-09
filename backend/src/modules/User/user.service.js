import bcrypt from "bcryptjs";
import User from "../../DB/models/user.model.js";
import {
  create,
  findAll,
  findById,
  findOne,
  findOneAndDelete,
  findOneAndUpdate,
} from "../../DB/database.repository.js";
import {
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { SALT } from "../../../config/config.service.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const normalizeStudentPayload = (body) => ({
  firstName: body.firstName,
  lastName: body.lastName,
  studentID: body.studentID ?? body.studentId,
  academicLevel: body.academicLevel,
  email: body.email,
  phoneNumber: body.phoneNumber ?? body.phone,
  userName: body.userName,
  major: body.major,
  dateOfBirth: body.dateOfBirth,
  gpa: body.gpa,
  creditsEarned: body.creditsEarned,
  creditsTotal: body.creditsTotal,
  status: body.status,
  role: body.role ?? RoleEnum.STUDENT,
});

const removeUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

const ensureUniqueUserFields = async ({ email, studentID, userName, excludeId }) => {
  const uniqueFilters = [];
  if (email) uniqueFilters.push({ email });
  if (studentID) uniqueFilters.push({ studentID });
  if (userName) uniqueFilters.push({ userName });
  if (!uniqueFilters.length) return;

  const filter = { $or: uniqueFilters };
  if (excludeId) filter._id = { $ne: excludeId };

  const existingUser = await findOne({
    model: User,
    filter,
  });

  if (existingUser) {
    return ConflictException({ message: "User with this email, student ID or username already exists" });
  }
};

export const addUser = async (req, res) => {
  const studentID = req.body.studentID ?? req.body.studentId;
  await ensureUniqueUserFields({
    email: req.body.email,
    studentID,
    userName: req.body.userName,
  });

  const hashedPassword = await bcrypt.hash(req.body.password, Number(SALT) || 10);
  const newUser = await create({
    model: User,
    data: {
      ...removeUndefined(normalizeStudentPayload(req.body)),
      password: hashedPassword,
    },
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Student added successfully by Admin",
    data: newUser,
  });
};

export const getProfile = async (req, res) => {
  const user = await findById({
    model: User,
    id: req.user._id,
  });

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  return successResponse({
    res,
    data: user,
  });
};

export const updateProfile = async (req, res) => {
  const update = removeUndefined(normalizeStudentPayload(req.body));
  delete update.role;
  delete update.userName;

  const user = await findOneAndUpdate({
    model: User,
    filter: { _id: req.user._id },
    update,
  });

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  return successResponse({
    res,
    message: "Profile updated successfully",
    data: user,
  });
};

export const getAllUsers = async (req, res) => {
  const users = await findAll({
    model: User,
    options: { sort: { createdAt: -1 } },
  });

  return successResponse({
    res,
    data: users,
  });
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const studentID = req.body.studentID ?? req.body.studentId;

  await ensureUniqueUserFields({
    email: req.body.email,
    studentID,
    userName: req.body.userName,
    excludeId: id,
  });

  const update = removeUndefined(normalizeStudentPayload(req.body));

  if (req.body.password) {
    update.password = await bcrypt.hash(req.body.password, Number(SALT) || 10);
  }

  const user = await findOneAndUpdate({
    model: User,
    filter: { _id: id },
    update,
  });

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  return successResponse({
    res,
    message: "User updated successfully",
    data: user,
  });
};

export const deleteUserById = async (req, res) => {
  const deleted = await findOneAndDelete({
    model: User,
    filter: { _id: req.params.id },
  });

  if (!deleted) {
    return NotFoundException({ message: "User not found" });
  }

  return successResponse({
    res,
    message: "User deleted successfully",
  });
};
