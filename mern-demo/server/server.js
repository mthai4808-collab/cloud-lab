require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Đã kết nối thành công với MongoDB Atlas!'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: "Lỗi thêm sinh viên" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Node.js đang chạy tại http://localhost:${PORT}`);
});