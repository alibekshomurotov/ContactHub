import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ContactCard from './ContactCard';
import AddContactForm from './AddContactForm';
import ProfileEdit from './ProfileEdit';

const styles = {
  container: {
    minHeight: '100vh',
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '32px',
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutBtn: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '12px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 24px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '12px',
    transition: 'all 0.3s',
  },
  activeTab: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  searchBar: {
    marginBottom: '24px',
  },
  searchInput: {
    width: '100%',
    padding: '14px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    fontSize: '15px',
    outline: 'none',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '8px',
  },
  contactsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#94a3b8',
  },
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const fetchData = async () => {
    try {
      const userRes = await axios.get(`http://localhost:3001/users/${userId}`);
      setUser(userRes.data);
      setContacts(userRes.data.contacts || []);
    } catch (error) {
      toast.error('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Tizimdan chiqdingiz');
  };

  const handleContactAdded = (newContact) => {
    setContacts([...contacts, newContact]);
    fetchData();
    setActiveTab('contacts');
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Kontaktni o\'chirmoqchimisiz?')) {
      const updatedContacts = contacts.filter(c => c.id !== contactId);
      await axios.patch(`http://localhost:3001/users/${userId}`, { contacts: updatedContacts });
      setContacts(updatedContacts);
      toast.success('Kontakt o\'chirildi');
    }
  };

  const getProfessionLabel = (profession) => {
    const labels = {
      teacher: '👨‍🏫 O\'qituvchi',
      doctor: '👨‍⚕️ Shifokor',
      manager: '💼 Menejer',
      business: '🏢 Tadbirkor',
      engineer: '🔧 Muhandis',
      lawyer: '⚖️ Advokat',
      accountant: '📊 Buxgalter',
      designer: '🎨 Dizayner',
    };
    return labels[profession] || profession;
  };

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.note?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div style={styles.container}>⏳ Yuklanmoqda...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📇 {userName}</h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>
              {user?.profession && getProfessionLabel(user.profession)}
              {user?.company && ` • ${user.company}`}
            </p>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Chiqish
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{contacts.length}</div>
            <div style={styles.statLabel}>📞 Kontaktlar</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {user?.profession ? getProfessionLabel(user.profession).split(' ')[0] : '-'}
            </div>
            <div style={styles.statLabel}>💼 Kasb</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{user?.company || '-'}</div>
            <div style={styles.statLabel}>🏢 Tashkilot</div>
          </div>
        </div>

        <div style={styles.tabs}>
          {[
            { id: 'contacts', label: '📋 Kontaktlar' },
            { id: 'add', label: '➕ Qo\'shish' },
            { id: 'profile', label: '👤 Profil' }
          ].map(tab => (
            <button
              key={tab.id}
              style={{ ...styles.tab, ...(activeTab === tab.id ? styles.activeTab : {}) }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'contacts' && (
          <>
            <div style={styles.searchBar}>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="🔍 Ism, telefon, kategoriya yoki eslatma bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {contacts.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div>Hali kontaktlar yo'q</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Yangi kontakt qo'shish uchun "Qo'shish" tabiga o'ting
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div style={styles.emptyState}>
                <div>🔍 "{searchQuery}" bo'yicha hech narsa topilmadi</div>
              </div>
            ) : (
              <div style={styles.contactsGrid}>
                {filteredContacts.map(contact => (
                  <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    onDelete={() => handleDeleteContact(contact.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'add' && (
          <AddContactForm userId={userId} onSuccess={handleContactAdded} />
        )}

        {activeTab === 'profile' && (
          <ProfileEdit user={user} userId={userId} onUpdate={fetchData} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;