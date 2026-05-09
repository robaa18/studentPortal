import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  capacity: {
    type: Number,
    default: 30,
  },
  credits: {
    type: Number,
    default: 3,
  },
  section: {
    type: String,
    default: "A",
  },
}, { timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "Course"
});

courseSchema.virtual("name").get(function () {
  return this.title;
});

courseSchema.virtual("courseName").get(function () {
  return this.title;
});

courseSchema.virtual("courseCode").get(function () {
  return this.code;
});

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
