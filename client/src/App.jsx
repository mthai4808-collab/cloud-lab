import { useState, useEffect } from 'react';
import './App.css';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const EMPTY_FORM = {
  studentId: '',
  name: '',
  email: '',
};

// Gọi API và kiểm tra phản hồi
async function requestApi(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Yêu cầu thất bại: HTTP ${response.status}`
    );
  }

  return data;
}

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    setLoading(true);

    try {
      const data = await requestApi('/api/students');

      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu danh sách sinh viên không hợp lệ');
      }

      setStudents(data);
    } catch (err) {
      setError(`Không tải được danh sách: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const path = editingId
        ? `/api/students/${editingId}`
        : '/api/students';

      await requestApi(path, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: formData.studentId.trim(),
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      });

      setFormData({ ...EMPTY_FORM });
      setEditingId(null);
      await fetchStudents();
    } catch (err) {
      setError(`Không lưu được sinh viên: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa sinh viên này?'
    );

    if (!confirmed) return;

    setError('');
    setDeletingId(id);

    try {
      await requestApi(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (editingId === id) {
        setEditingId(null);
        setFormData({ ...EMPTY_FORM });
      }

      await fetchStudents();
    } catch (err) {
      setError(`Không xóa được sinh viên: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Đưa dữ liệu lên form để sửa
  const handleEdit = (student) => {
    setError('');

    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || '',
    });

    setEditingId(student._id);
  };

  // Hủy sửa
  const handleCancelEdit = () => {
    setFormData({ ...EMPTY_FORM });
    setEditingId(null);
    setError('');
  };

  const busy = saving || deletingId !== null;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial',
      }}
    >
      <h1>🎓 Quản lý Sinh Viên</h1>

      {error && (
        <p
          role="alert"
          style={{
            color: '#b91c1c',
            backgroundColor: '#fee2e2',
            padding: '12px',
            borderRadius: '5px',
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '30px',
        }}
      >
        <input
          type="text"
          name="studentId"
          aria-label="Mã sinh viên"
          placeholder="Mã sinh viên (VD: SV002)"
          value={formData.studentId}
          onChange={handleInputChange}
          required
          disabled={busy}
          style={{ padding: '8px' }}
        />

        <input
          type="text"
          name="name"
          aria-label="Họ và tên"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={busy}
          style={{ padding: '8px' }}
        />

        <input
          type="email"
          name="email"
          aria-label="Email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={busy}
          style={{ padding: '8px' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={busy}
            style={{
              flex: 1,
              padding: '10px',
              cursor: busy ? 'wait' : 'pointer',
              backgroundColor: editingId ? '#FFA500' : '#4CAF50',
              color: 'white',
              border: 'none',
            }}
          >
            {saving
              ? 'Đang lưu...'
              : editingId
                ? 'Cập Nhật Sinh Viên'
                : 'Thêm Sinh Viên'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={busy}
              style={{
                flex: 1,
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: '#9e9e9e',
                color: 'white',
                border: 'none',
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <h2>Danh sách sinh viên:</h2>

      {loading && <p>Đang tải danh sách sinh viên...</p>}

      {!loading && !error && students.length === 0 && (
        <p>Chưa có sinh viên nào. Bạn hãy thêm sinh viên mới.</p>
      )}

      <ul
        style={{
          textAlign: 'left',
          padding: 0,
          listStyle: 'none',
        }}
      >
        {students.map((student) => (
          <li
            key={student._id}
            style={{
              marginBottom: '10px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <strong>{student.studentId}</strong> - {student.name}
              <br />
              <span
                style={{
                  color: 'gray',
                  fontSize: '14px',
                  overflowWrap: 'anywhere',
                }}
              >
                {student.email}
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleEdit(student)}
                disabled={busy}
                style={{
                  marginRight: '5px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Sửa
              </button>

              <button
                type="button"
                onClick={() => handleDelete(student._id)}
                disabled={busy}
                style={{
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {deletingId === student._id ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;