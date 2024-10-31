import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    identity: { type: String, required: true },
    dob: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    role: { type: String, enum: ['STUDENT', 'TEACHER', 'ADMIN'], required: true },
});

const User = mongoose.model('school.users', userSchema);

export default User