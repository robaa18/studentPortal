import bcrypt from "bcryptjs";
import User from "../../DB/models/user.model.js";
import { create, findOne } from "../../DB/database.repository.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { SALT } from "../../../config/config.service.js";
import Token from "../../DB/models/token.model.js";
import { getNewLoginCredientials } from "../../utils/token/token.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

export const register = async (req, res) => {
  const {
    userName,
    password,
    role = RoleEnum.STUDENT,
    firstName,
    lastName,
    studentID,
    academicLevel,
    email,
    phoneNumber,
    major,
  } = req.body;

  const user = await findOne({
    model: User,
    filter: { userName },
  });

  if (user) {
    return ConflictException({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, Number(SALT) || 10);
  const newUser = await create({
    model: User,
    data: {
      userName,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      studentID,
      academicLevel,
      email,
      phoneNumber,
      major,
    },
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: newUser,
  });
};

export const login = async (req, res) => {
  const { userName, password } = req.body;

  const user = await findOne({
    model: User,
    filter: { userName },
    select: "+password",
  });

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return BadRequestException({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await getNewLoginCredientials(user);

  return successResponse({
    res,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
      user: user.toJSON(),
    },
  });
};

export const logout = async (req, res) => {
  if (!req.decoded) {
    return BadRequestException({ message: "Authentication data missing" });
  }

  const { jti, _id, exp } = req.decoded;

  if (!jti) {
    return BadRequestException({ message: "Token does not contain a JTI" });
  }

  await Token.create({
    jti,
    userId: _id,
    expiresIn: new Date(exp * 1000),
  });

  return successResponse({
    res,
    message: "Logged out successfully and token revoked.",
  });
};

export const me = async (req, res) => {
  return successResponse({
    res,
    data: req.user,
  });
};
