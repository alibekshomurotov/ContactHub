import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const styles = {
  form: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1e293b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    marginTop: '24px',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '42px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 auto 20px',
  },
};

function ProfileEdit({ user, userId, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profession: user?.profession || '',
    company: user?.company || '',
    address: user?.address || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch(`http://localhost:3001/users/${userId}`, formData);
      localStorage.setItem('userName', formData.name);
      toast.success('Profil yangilandi!');
      onUpdate();
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const initials = formData.name?.charAt(0).toUpperCase() || '?';

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h3 style={styles.title}>✏️ Profilni tahrirlash</h3>

      <div style={styles.avatar}>{initials}</div>

      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>To'liq ism</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Ish joyi / Tashkilot</label>
          <input
            style={styles.input}
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
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
          />
        </div>
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
      </button>
    </form>
  );
}

export default ProfileEdit;