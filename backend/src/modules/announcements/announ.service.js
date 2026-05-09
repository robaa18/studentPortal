import Announcement from "../../DB/models/announcement.model.js";
import { NotFoundException } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const createAnnouncement = async (req, res) => {
  const { title, content } = req.body;

  const announcement = await Announcement.create({
    title,
    content,
    createdBy: req.user._id,
  });

  await announcement.populate("createdBy", "firstName lastName userName role email");

  return successResponse({
    res,
    message: "Announcement created successfully",
    data: announcement,
    statusCode: 201,
  });
};

export const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find()
    .populate("createdBy", "firstName lastName userName role email")
    .sort({ createdAt: -1 });

  return successResponse({
    res,
    data: announcements,
  });
};

export const updateAnnouncement = async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "firstName lastName userName role email");

  if (!announcement) {
    return NotFoundException({ message: "Announcement not found" });
  }

  return successResponse({
    res,
    message: "Updated successfully",
    data: announcement,
  });
};

export const deleteAnnouncement = async (req, res) => {
  const deleted = await Announcement.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return NotFoundException({ message: "Announcement not found" });
  }

  return successResponse({
    res,
    message: "Deleted successfully",
  });
};
