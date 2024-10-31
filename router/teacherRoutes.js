import express from "express";
import { getAllTeachers, createTeacher, getTeacherPositions, createTeacherPosition } from "../controllers/teacherController.js";

const router = express.Router();

// Route để lấy danh sách giáo viên
router.get("/teachers", getAllTeachers);
router.post("/teachers", createTeacher);
router.get('/teacher-positions', getTeacherPositions);
router.post('/teacher-positions', createTeacherPosition);
export default router;
