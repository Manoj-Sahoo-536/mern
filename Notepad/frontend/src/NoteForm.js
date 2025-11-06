import { useState, useEffect } from 'react';

const colors = [
  { name: 'default', value: 'rgba(30,30,45,0.7)', label: 'Default' },
  { name: 'red', value: 'rgba(239,83,80,0.2)', label: 'Red' },
  { name: 'orange', value: 'rgba(255,167,38,0.2)', label: 'Orange' },
  { name: 'yellow', value: 'rgba(255,235,59,0.2)', label: 'Yellow' },
  { name: 'green', value: 'rgba(102,187,106,0.2)', label: 'Green' },
  { name: 'blue', value: 'rgba(66,165,245,0.2)', label: 'Blue' },
  { name: 'purple', value: 'rgba(171,71,188,0.2)', label: 'Purple' },
  { name: 'pink', value: 'rgba(236,64,122,0.2)', label: 'Pink' }
];

export default function NoteForm({ onSubmit, editNote, onCancel, theme }) {
  const styles = getStyles(theme);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('default');

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setColor(editNote.color || 'default');
    }
  }, [editNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, color });
    setTitle('');
    setContent('');
    setColor('default');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />
      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
      />
      <div style={styles.colorPicker}>
        <span style={styles.colorLabel}>Color:</span>
        <div style={styles.colorOptions}>
          {colors.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              style={{
                ...styles.colorBtn,
                background: c.value,
                border: color === c.name ? '3px solid #667eea' : '2px solid rgba(255,255,255,0.2)'
              }}
              title={c.label}
            />
          ))}
        </div>
      </div>
      <div style={styles.buttons}>
        <button type="submit" style={styles.btn}>{editNote ? 'Update' : 'Add'}</button>
        {editNote && <button type="button" onClick={onCancel} style={styles.btnCancel}>Cancel</button>}
      </div>
    </form>
  );
}

const getStyles = (theme) => ({
  form: { background: theme === 'dark' ? 'rgba(30,30,45,0.7)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '28px', borderRadius: '20px', boxShadow: theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '14px 18px', marginBottom: '14px', border: theme === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '16px', fontWeight: '600', transition: 'all 0.3s ease', outline: 'none', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: theme === 'dark' ? '#fff' : '#000' },
  textarea: { width: '100%', padding: '14px 18px', border: theme === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)', borderRadius: '12px', minHeight: '120px', fontSize: '15px', resize: 'vertical', transition: 'all 0.3s ease', outline: 'none', fontFamily: 'inherit', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', lineHeight: '1.6', color: theme === 'dark' ? '#fff' : '#000' },
  colorPicker: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px' },
  colorLabel: { color: theme === 'dark' ? '#aaa' : '#666', fontSize: '14px', fontWeight: '600' },
  colorOptions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  colorBtn: { width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s ease' },
  buttons: { display: 'flex', gap: '12px', marginTop: '16px' },
  btn: { padding: '12px 28px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' },
  btnCancel: { padding: '12px 28px', background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: theme === 'dark' ? '#fff' : '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s ease' }
});
