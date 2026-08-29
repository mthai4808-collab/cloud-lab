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

// ==========================================
// BỔ SUNG: CÂU 77 - API Cập nhật sinh viên (Sửa)
// ==========================================
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Yêu cầu Mongoose trả về data mới sau khi update
        );
        if (!updatedStudent) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật sinh viên" });
    }
});

// ==========================================
// BỔ SUNG: CÂU 78 - API Xóa sinh viên (Xóa)
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
        res.json({ message: 'Đã xóa sinh viên thành công' });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sinh viên" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Node.js đang chạy tại http://localhost:${PORT}`);
});