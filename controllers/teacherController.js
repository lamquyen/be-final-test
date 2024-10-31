import Teacher from '../model/teacher.js';
import User from "../model/users.js";
import TeacherPosition from "../model/teacherposition.js";
import mongoose from 'mongoose';
import crypto from 'crypto'

const getAllTeachers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const teachers = await Teacher.find()
            .populate({
                path: "userId",
                select: "name email phoneNumber address",
                match: { role: 'TEACHER' }
            })
            .populate("teacherPositions", "name")
            .skip(skip)
            .limit(limit)
            .exec();

        const teacherList = teachers
            .filter(teacher => teacher.userId)
            .map(teacher => ({
                code: teacher.code,
                name: teacher.userId?.name || 'N/A',
                email: teacher.userId?.email || 'N/A',
                phoneNumber: teacher.userId?.phoneNumber || 'N/A',
                address: teacher.userId?.address || 'N/A',
                isActive: teacher.isActive,
                teacherPositions: teacher.teacherPositions.map(pos => ({
                    name: pos.name,
                    des: pos.des
                })),
                degrees: teacher.degrees?.map(degree => ({
                    type: degree.type,
                    school: degree.school,
                    major: degree.major,
                    year: degree.year,
                    isGraduated: degree.isGraduated
                })) || []
            }));

        res.status(200).json(teacherList);
    } catch (error) {
        console.error("Error retrieving teachers:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách giáo viên", error });
    }
};





// API để thêm giáo viên mới
const createTeacher = async (req, res) => {
    try {
        const { userId, startDate, endDate, email, teacherPositions, degrees } = req.body;

        // Kiểm tra tính duy nhất của email
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Kiểm tra userId và teacherPositions
        if (!mongoose.Types.ObjectId.isValid(userId) || !teacherPositions.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid userId or teacherPositions" });
        }

        // Tạo đối tượng giáo viên mới
        const newTeacher = new Teacher({
            userId: mongoose.Types.ObjectId(userId), // Chuyển đổi userId thành ObjectId
            startDate,
            endDate,
            email,
            teacherPositions: teacherPositions.map(positionId => mongoose.Types.ObjectId(positionId)), // Chuyển đổi teacherPositions thành ObjectId
            degrees,
        });

        // Lưu giáo viên vào database
        await newTeacher.save();

        res.status(201).json({
            message: "Giáo viên đã được tạo thành công",
            teacher: newTeacher,
        });
    } catch (error) {
        console.error("Error creating teacher:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }
        res.status(500).json({ message: "Lỗi server khi tạo giáo viên", error: error.message });
    }
};



const getTeacherPositions = async (req, res) => {
    try {
        // Lấy tất cả các vị trí công tác
        const teacherPositions = await TeacherPosition.find();

        // Trả về danh sách các vị trí công tác
        res.status(200).json({
            message: "Danh sách vị trí công tác",
            teacherPositions,
        });
    } catch (error) {
        console.error("Error fetching teacher positions:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách vị trí công tác", error });
    }
};

const createTeacherPosition = async (req, res) => {
    const { name, code, des, isActive, isDeleted } = req.body;

    // Kiểm tra xem code đã tồn tại hay chưa
    const existingPosition = await TeacherPosition.findOne({ code });
    if (existingPosition) {
        return res.status(400).json({ message: "Mã vị trí công tác đã tồn tại" });
    }

    try {
        // Tạo mới vị trí công tác
        const newPosition = new TeacherPosition({
            name,
            code,
            des,
            isActive,
            isDeleted,
        });

        // Lưu vào cơ sở dữ liệu
        await newPosition.save();

        // Trả về thông tin vị trí công tác vừa tạo
        res.status(201).json({
            message: "Vị trí công tác đã được tạo thành công",
            teacherPosition: newPosition,
        });
    } catch (error) {
        console.error("Error creating teacher position:", error);
        res.status(500).json({ message: "Lỗi server khi tạo vị trí công tác", error });
    }
};

export { getAllTeachers, createTeacher, getTeacherPositions, createTeacherPosition };
