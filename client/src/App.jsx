import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchStudents();
        setFormData({ studentId: '', name: '', email: '' });
      }
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🎓 Quản lý Sinh Viên</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          name="studentId"
          placeholder="Mã sinh viên (VD: SV002)"
          value={formData.studentId}
          onChange={handleInputChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>Thêm Sinh Viên</button>
      </form>

      <h2>Danh sách sinh viên:</h2>
      <ul style={{ textAlign: 'left' }}>
        {students.map((student) => (
          <li key={student._id} style={{ marginBottom: '8px' }}>
            <strong>{student.studentId}</strong> - {student.name} <em>({student.email})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;