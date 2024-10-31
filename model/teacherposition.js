import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    des: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
});

const teacherPosition = mongoose.model('school.teacherpositions', PositionSchema);

export default teacherPosition;