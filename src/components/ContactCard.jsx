import { useState } from 'react';
import toast from 'react-hot-toast';

const styles = {
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    position: 'relative',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px -8px rgba(0, 0, 0, 0.15)',
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 auto 16px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: '4px',
  },
  category: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '12px',
  },
  info: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '12px',
    marginTop: '12px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#475569',
    marginBottom: '8px',
    wordBreak: 'break-all',
  },
  deleteBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#fee2e2',
    border: 'none',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#ef4444',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  callBtn: {
    flex: 1,
    padding: '8px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  emailBtn: {
    flex: 1,
    padding: '8px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};

function ContactCard({ contact, onDelete }) {
  const [hovered, setHovered] = useState(false);

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'];
  const avatarColor = colors[(contact.id || 1) % colors.length];
  const initials = contact.name?.charAt(0).toUpperCase() || '?';

  const getCategoryLabel = (category) => {
    const labels = {
      family: '👨‍👩‍👧 Oila',
      friend: '👫 Do\'st',
      work: '💼 Ish',
      client: '🤝 Mijoz',
      other: '📝 Boshqa'
    };
    return labels[category] || category;
  };

  const handleCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    } else {
      toast.error('Telefon raqam mavjud emas');
    }
  };

  const handleEmail = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    } else {
      toast.error('Email mavjud emas');
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button style={styles.deleteBtn} onClick={onDelete}>
        🗑️ O'chirish
      </button>

      <div style={{ ...styles.avatar, backgroundColor: avatarColor }}>
        {initials}
      </div>

      <div style={styles.name}>{contact.name}</div>
      <div style={styles.category}>
        {contact.category && getCategoryLabel(contact.category)}
      </div>

      <div style={styles.info}>
        {contact.phone && (
          <div style={styles.infoRow}>
            <span>📞</span> {contact.phone}
          </div>
        )}
        {contact.email && (
          <div style={styles.infoRow}>
            <span>📧</span> {contact.email}
          </div>
        )}
        {contact.address && (
          <div style={styles.infoRow}>
            <span>📍</span> {contact.address}
          </div>
        )}
        {contact.note && (
          <div style={styles.infoRow}>
            <span>📝</span> {contact.note}
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.callBtn} onClick={handleCall}>
          📞 Qo'ng'iroq
        </button>
        <button style={styles.emailBtn} onClick={handleEmail}>
          ✉️ Email
        </button>
      </div>
    </div>
  );
}

export default ContactCard;