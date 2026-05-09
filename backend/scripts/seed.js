import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../src/DB/connections.js";
import { SALT } from "../config/config.service.js";
import { RoleEnum } from "../src/utils/enums/user.enum.js";
import User from "../src/DB/models/user.model.js";
import Course from "../src/DB/models/course.model.js";
import Enrollment from "../src/DB/models/enrollment.model.js";
import Grade from "../src/DB/models/grade.model.js";
import Schedule from "../src/DB/models/schedule.model.js";
import Announcement from "../src/DB/models/announcement.model.js";

const hash = (password) => bcrypt.hash(password, Number(SALT) || 10);

const upsertUser = async (filter, data, password) => {
  const existing = await User.findOne(filter).select("+password");
  if (existing) return existing;

  return User.create({
    ...data,
    password: await hash(password),
  });
};

const upsertCourse = async (code, data) => {
  const existing = await Course.findOne({ code });
  if (existing) return existing;
  return Course.create({ ...data, code });
};

const run = async () => {
  await connectDB();

  const admin = await upsertUser(
    { userName: "admin" },
    {
      userName: "admin",
      role: RoleEnum.ADMIN,
    },
    "admin123"
  );

  const student = await upsertUser(
    { userName: "student" },
    {
      firstName: "John",
      lastName: "Doe",
      studentID: "STU-2026-001",
      academicLevel: "Level 4",
      email: "john.doe@student.local",
      phoneNumber: "+20 100 000 0000",
      userName: "student",
      major: "Computer Science",
      dateOfBirth: new Date("2002-05-14"),
      gpa: 3.8,
      creditsEarned: 96,
      creditsTotal: 120,
      status: "active",
      role: RoleEnum.STUDENT,
    },
    "student123"
  );

  const courses = await Promise.all([
    upsertCourse("CS-401", {
      title: "Advanced Algorithms",
      instructor: admin._id,
      capacity: 40,
      credits: 4,
      section: "A",
    }),
    upsertCourse("AI-301", {
      title: "Machine Learning",
      instructor: admin._id,
      capacity: 35,
      credits: 3,
      section: "B",
    }),
    upsertCourse("CS-305", {
      title: "Database Systems",
      instructor: admin._id,
      capacity: 45,
      credits: 3,
      section: "A",
    }),
    upsertCourse("CS-210", {
      title: "Web Development",
      instructor: admin._id,
      capacity: 50,
      credits: 3,
      section: "C",
    }),
  ]);

  await Promise.all(courses.slice(0, 3).map((course) =>
    Enrollment.updateOne(
      { student: student._id, course: course._id },
      { $setOnInsert: { student: student._id, course: course._id } },
      { upsert: true }
    )
  ));

  const scheduleItems = [
    { course: courses[0]._id, day: "Monday", time: "09:00 - 10:30", location: "Hall 4B" },
    { course: courses[1]._id, day: "Wednesday", time: "11:00 - 12:30", location: "Lab 12" },
    { course: courses[2]._id, day: "Friday", time: "10:00 - 11:30", location: "Auditorium A" },
  ];

  await Promise.all(scheduleItems.map((item) =>
    Schedule.updateOne(
      { course: item.course, day: item.day, time: item.time },
      { $setOnInsert: item },
      { upsert: true }
    )
  ));

  const grades = [
    { student: student._id, course: courses[0]._id, grade: "A", score: 95 },
    { student: student._id, course: courses[1]._id, grade: "A-", score: 90 },
    { student: student._id, course: courses[2]._id, grade: "B+", score: 86 },
  ];

  await Promise.all(grades.map((item) =>
    Grade.updateOne(
      { student: item.student, course: item.course },
      item,
      { upsert: true }
    )
  ));

  await Announcement.updateOne(
    { title: "Welcome to StudentPortal" },
    {
      title: "Welcome to StudentPortal",
      content: "Your local development database is ready. You can log in as admin/admin123 or student/student123.",
      createdBy: admin._id,
    },
    { upsert: true }
  );

  console.log("Seed completed: admin/admin123 and student/student123 are ready.");
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
