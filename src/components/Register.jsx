import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    background: 'white',
    borderRadius: '32px',
    padding: '40px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '28px',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#64748b',
  },
  linkText: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profession: '',
    company: '',
    address: ''
  });

  const professions = [
    { value: 'teacher', label: '👨‍🏫 O\'qituvchi' },
    { value: 'doctor', label: '👨‍⚕️ Shifokor' },
    { value: 'manager', label: '💼 Menejer' },
    { value: 'business', label: '🏢 Tadbirkor' },
    { value: 'engineer', label: '🔧 Muhandis' },
    { value: 'lawyer', label: '⚖️ Advokat' },
    { value: 'accountant', label: '📊 Buxgalter' },
    { value: 'designer', label: '🎨 Dizayner' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Parollar mos kelmadi!');
      return;
    }

    if (formData.password.length < 4) {
      toast.error('Parol kamida 4 belgi bo\'lishi kerak!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/users');
      const existingUser = response.data.find(u => u.email === formData.email);
      
      if (existingUser) {
        toast.error('Bu email allaqachon ro\'yxatdan o\'tgan!');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        profession: formData.profession,
        company: formData.company,
        address: formData.address,
        createdAt: new Date().toISOString(),
        contacts: []  // Qo'lda qo'shilgan kontaktlar shu yerda saqlanadi
      };

      await axios.post('http://localhost:3001/users', newUser);
      
      toast.success('Ro\'yxatdan o\'tdingiz! Endi kiring.');
      navigate('/login');
      
    } catch (error) {
      toast.error('Xatolik yuz berdi. Qayta urining.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📝 Ro'yxatdan o'tish</h1>
        <p style={styles.subtitle}>Kontaktlar kitobiga xush kelibsiz</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>To'liq ism *</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ism familiyangiz"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Telefon raqam</label>
            <input
              style={styles.input}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 __ ___ __ __"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Kasbingiz *</label>
            <select
              style={styles.select}
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
            >
              <option value="">Kasbingizni tanlang</option>
              {professions.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Ish joyi / Tashkilot</label>
            <input
              style={styles.input}
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Ish joyingiz yoki tashkilot nomi"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Manzil</label>
            <input
              style={styles.input}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Shahringiz, manzilingiz"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Parol *</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Kamida 4 belgi"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Parolni takrorlang *</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Parolni qayta kiriting"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "⏳ Ro'yxatdan o'tmoqda..." : "✅ Ro'yxatdan o'tish"}
          </button>
        </form>

        <div style={styles.link}>
          Hisobingiz bormi?{' '}
          <Link to="/login" style={styles.linkText}>
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;