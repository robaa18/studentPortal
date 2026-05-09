import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "Announcement"
});

export default mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
