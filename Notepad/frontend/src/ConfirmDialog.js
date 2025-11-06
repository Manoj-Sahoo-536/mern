export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel, theme }) {
  if (!isOpen) return null;

  const styles = getStyles(theme);

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>⚠️ Confirm Action</h3>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onConfirm} style={styles.confirmBtn}>Confirm</button>
          <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const getStyles = (theme) => ({
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  dialog: { background: theme === 'dark' ? 'rgba(30,30,45,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '32px', borderRadius: '20px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' },
  title: { margin: '0 0 16px 0', fontSize: '22px', fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' },
  message: { margin: '0 0 24px 0', fontSize: '16px', color: theme === 'dark' ? '#ccc' : '#555', lineHeight: '1.6' },
  buttons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  confirmBtn: { padding: '12px 24px', background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(239,83,80,0.4)' },
  cancelBtn: { padding: '12px 24px', background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: theme === 'dark' ? '#fff' : '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s ease' }
});
