import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  grade: {
    type: String,
    required: true,
  },
  score: Number,
}, { timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "Grade"
});

export default mongoose.models.Grade || mongoose.model("Grade", gradeSchema);
