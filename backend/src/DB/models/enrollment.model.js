import mongoose from "mongoose";
import { EnrollmentEnum } from "../../utils/enums/enrollmentEnum.js";

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  status: {
    type: String,
    enum: Object.values(EnrollmentEnum),
    default: EnrollmentEnum.ENROLLED
  }
}, { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "Enrollment"
 });

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
