import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  
  // Trạng thái để biết ứng dụng đang ở chế độ "Thêm" hay "Sửa"
  const [editingId, setEditingId] = useState(null);

  // Gọi API lấy danh sách
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi bấm nút "Thêm Sinh Viên" hoặc "Cập Nhật"
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // CÂU 77: GỌI API PUT ĐỂ CẬP NHẬT
        const response = await fetch(`http://localhost:5000/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          setEditingId(null); // Thoát chế độ sửa
        }
      } else {
        // CÂU 75: GỌI API POST ĐỂ THÊM MỚI
        await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      
      fetchStudents(); // Tải lại danh sách
      setFormData({ studentId: '', name: '', email: '' }); // Xóa trắng form
    } catch (error) {
      console.error("Lỗi khi lưu sinh viên:", error);
    }
  };

  // CÂU 78: GỌI API DELETE ĐỂ XÓA
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchStudents(); // Tải lại danh sách sau khi xóa
        }
      } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error);
      }
    }
  };

  // Đưa thông tin sinh viên lên form để chuẩn bị sửa
  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
    setEditingId(student._id); // Lưu lại ID của sinh viên đang sửa
  };

  // Nút Hủy chế độ sửa
  const handleCancelEdit = () => {
    setFormData({ studentId: '', name: '', email: '' });
    setEditingId(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🎓 Quản lý Sinh Viên</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input type="text" name="studentId" placeholder="Mã sinh viên (VD: SV002)" value={formData.studentId} onChange={handleInputChange} required style={{ padding: '8px' }} />
        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleInputChange} required style={{ padding: '8px' }} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required style={{ padding: '8px' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: editingId ? '#FFA500' : '#4CAF50', color: 'white', border: 'none' }}>
            {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
          </button>
          
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#9e9e9e', color: 'white', border: 'none' }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <h2>Danh sách sinh viên:</h2>
      <ul style={{ textAlign: 'left', padding: 0, listStyle: 'none' }}>
        {students.map((student) => (
          <li key={student._id} style={{ marginBottom: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{student.studentId}</strong> - {student.name} <br/>
              <span style={{color: 'gray', fontSize: '14px'}}>{student.email}</span>
            </div>
            <div>
              <button onClick={() => handleEdit(student)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>Sửa</button>
              <button onClick={() => handleDelete(student._id)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;