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
  textarea: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  select: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
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
  hintBox: {
    marginTop: '20px',
    padding: '16px',
    background: '#fef3c7',
    borderRadius: '12px',
  },
  hintText: {
    color: '#d97706',
    fontSize: '13px',
    textAlign: 'center',
  },
};

function AddContactForm({ userId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'friend',
    note: '',
    address: ''
  });

  const categories = [
    { value: 'family', label: '👨‍👩‍👧 Oila' },
    { value: 'friend', label: '👫 Do\'st' },
    { value: 'work', label: '💼 Ish' },
    { value: 'client', label: '🤝 Mijoz' },
    { value: 'other', label: '📝 Boshqa' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Ism majburiy!');
      return;
    }

    setLoading(true);

    try {
      const userRes = await axios.get(`http://localhost:3001/users/${userId}`);
      const currentContacts = userRes.data.contacts || [];
      
      const newContact = {
        id: Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        category: formData.category,
        note: formData.note,
        address: formData.address,
        createdAt: new Date().toISOString()
      };

      const updatedContacts = [...currentContacts, newContact];
      await axios.patch(`http://localhost:3001/users/${userId}`, { contacts: updatedContacts });
      
      toast.success('Kontakt qo\'shildi!');
      onSuccess(newContact);
      
      // Formani tozalash
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'friend',
        note: '',
        address: ''
      });
      
    } catch (error) {
      toast.error('Kontakt qo\'shishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h3 style={styles.title}>➕ Yangi kontakt qo'shish</h3>
      
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Ism *</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="To'liq ismi"
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
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Kategoriya</label>
          <select
            style={styles.select}
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Manzil</label>
          <input
            style={styles.input}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Manzil"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Eslatma</label>
          <textarea
            style={styles.textarea}
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Qo'shimcha ma'lumot..."
          />
        </div>
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? '⏳ Qo\'shilmoqda...' : '➕ Kontakt qo\'shish'}
      </button>

      <div style={styles.hintBox}>
        <div style={styles.hintText}>
          💡 Eslatma: Bu odam saytda ro'yxatdan o'tgan bo'lishi shart emas!
          <br />
          Siz faqat o'zingiz uchun kontakt saqlayapsiz.
        </div>
      </div>
    </form>
  );
}

export default AddContactForm;