import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'school.users', required: true }, // Sửa userld thành userId
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    code: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    teacherPositions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'school.teacherpositions' }],
    degrees: [{
        type: { type: String, enum: ['Cử nhân', 'Thạc sĩ', 'Tiến sĩ'], required: true },
        school: { type: String, required: true },
        major: { type: String, required: true },
        year: { type: Number, required: true },
        isGraduated: { type: Boolean, default: false }
    }]
});

const Teacher = mongoose.model('school.teachers', teacherSchema);

export default Teacher;
