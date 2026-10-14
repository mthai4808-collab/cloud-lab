require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Model sinh viên
const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Student = mongoose.model('Student', studentSchema);

// Trang chủ Backend (Tránh lỗi Cannot GET /)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'MERN Backend API is running successfully!',
        endpoints: ['/api/students', '/api/hello', '/health']
    });
});

// Endpoint kiểm tra sức khỏe phục vụ Rolling Updates (Phần 4 - Câu 44)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Kiểm tra backend
app.get('/api/hello', (req, res) => {
    res.json({
        message: 'Backend đang hoạt động'
    });
});

// Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Lỗi lấy danh sách sinh viên:', error.message);
        res.status(500).json({
            message: 'Lỗi khi lấy dữ liệu'
        });
    }
});

// Thêm sinh viên
app.post('/api/students', async (req, res) => {
    try {
        const { studentId, name, email } = req.body;

        const newStudent = await Student.create({
            studentId,
            name,
            email
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Lỗi thêm sinh viên:', error.message);
        res.status(400).json({
            message: 'Không thể thêm sinh viên. Kiểm tra các trường bắt buộc.'
        });
    }
});

// Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID sinh viên không hợp lệ'
            });
        }

        const { studentId, name, email } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { studentId, name, email },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: 'Không tìm thấy sinh viên'
            });
        }

        res.json(updatedStudent);
    } catch (error) {
        console.error('Lỗi cập nhật sinh viên:', error.message);
        res.status(400).json({
            message: 'Lỗi cập nhật sinh viên'
        });
    }
});

// Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID sinh viên không hợp lệ'
            });
        }

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                message: 'Không tìm thấy sinh viên'
            });
        }

        res.json({
            message: 'Đã xóa sinh viên thành công'
        });
    } catch (error) {
        console.error('Lỗi xóa sinh viên:', error.message);
        res.status(500).json({
            message: 'Lỗi khi xóa sinh viên'
        });
    }
});

// Kết nối MongoDB thành công rồi khởi động server
const PORT = process.env.PORT || 5000;

async function startServer() {
    if (!process.env.MONGODB_URI) {
        console.error('Thiếu biến môi trường MONGODB_URI');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Đã kết nối thành công với MongoDB Atlas!');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server Node.js đang chạy trên cổng ${PORT}`);
        });
    } catch (error) {
        console.error('Không thể kết nối MongoDB:', error.message);
        process.exit(1);
    }
}

startServer();