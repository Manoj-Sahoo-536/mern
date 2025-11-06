import { useState } from 'react';
import { marked } from 'marked';

const colorMapDark = {
  default: 'rgba(30,30,45,0.7)',
  red: 'rgba(239,83,80,0.2)',
  orange: 'rgba(255,167,38,0.2)',
  yellow: 'rgba(255,235,59,0.2)',
  green: 'rgba(102,187,106,0.2)',
  blue: 'rgba(66,165,245,0.2)',
  purple: 'rgba(171,71,188,0.2)',
  pink: 'rgba(236,64,122,0.2)'
};

const colorMapLight = {
  default: 'rgba(255,255,255,0.9)',
  red: 'rgba(239,83,80,0.15)',
  orange: 'rgba(255,167,38,0.15)',
  yellow: 'rgba(255,235,59,0.2)',
  green: 'rgba(102,187,106,0.15)',
  blue: 'rgba(66,165,245,0.15)',
  purple: 'rgba(171,71,188,0.15)',
  pink: 'rgba(236,64,122,0.15)'
};

export default function NoteCard({ note, onEdit, onDelete, onPin, onArchive, onRestore, onDuplicate, view, viewMode, theme, selectionMode, isSelected, onToggleSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = (e) => {
    if (selectionMode) {
      onToggleSelect(note);
    } else if (!e.target.closest('button')) {
      setIsExpanded(!isExpanded);
    }
  };
  const colorMap = theme === 'dark' ? colorMapDark : colorMapLight;
  const cardBg = colorMap[note.color] || colorMap.default;
  const styles = getStyles(theme);
  
  const renderContent = () => {
    if (showMarkdown && note.content) {
      return { __html: marked(note.content) };
    }
    return null;
  };

  return (
    <div 
      style={{ 
        ...styles.card, 
        ...(viewMode === 'list' && styles.listCard),
        background: cardBg, 
        ...(note.pinned && styles.pinned), 
        ...(isHovered && styles.cardHover),
        ...(isSelected && styles.selected)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {selectionMode && (
        <input 
          type="checkbox" 
          checked={!!isSelected} 
          onChange={() => onToggleSelect(note)}
          style={styles.checkbox}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {note.pinned && <div style={styles.pinnedBadge}>📌 Pinned</div>}
      <div style={viewMode === 'list' ? styles.listContent : styles.gridContent}>
        <div style={styles.textSection}>
          <div style={styles.titleRow}>
            <h3 style={styles.title}>{note.title}</h3>
            {isExpanded && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMarkdown(!showMarkdown); }} 
                style={styles.mdToggleBtn}
              >
                {showMarkdown ? '📝' : '📄'}
              </button>
            )}
          </div>
          {showMarkdown && isExpanded ? (
            <div className="markdown" style={styles.markdown} dangerouslySetInnerHTML={renderContent()} />
          ) : (
            <p style={isExpanded ? styles.contentExpanded : styles.content}>{note.content}</p>
          )}
        </div>
        <div style={styles.actions}>
        {view === 'trash' ? (
          <>
            <button onClick={() => onRestore(note)} style={styles.iconBtn} title="Restore">↩️</button>
            <button onClick={() => onDelete(note._id, true)} style={{...styles.iconBtn, background: 'rgba(239,83,80,0.2)'}} title="Delete Forever">🗑️</button>
          </>
        ) : (
          <>
            {view === 'active' && (
              <button onClick={() => onPin(note)} style={styles.iconBtn} title={note.pinned ? 'Unpin' : 'Pin'}>
                {note.pinned ? '📌' : '📍'}
              </button>
            )}
            <button onClick={() => onEdit(note)} style={styles.iconBtn} title="Edit">✏️</button>
            <button onClick={handleCopy} style={styles.iconBtn} title={copied ? 'Copied!' : 'Copy Text'}>{copied ? '✅' : '📋'}</button>
            <button onClick={() => onDuplicate(note)} style={styles.iconBtn} title="Duplicate">📑</button>
            <button onClick={() => onArchive(note)} style={styles.iconBtn} title={view === 'archived' ? 'Unarchive' : 'Archive'}>
              {view === 'archived' ? '📤' : '📦'}
            </button>
            <button onClick={() => onDelete(note._id, false)} style={styles.iconBtn} title="Move to Trash">🗑️</button>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

const getStyles = (theme) => ({
  card: { background: theme === 'dark' ? 'rgba(30,30,45,0.7)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '16px', boxShadow: theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)', position: 'relative', transition: 'all 0.3s ease', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' },
  listCard: { padding: '20px' },
  cardHover: { transform: 'translateY(-8px)', boxShadow: '0 16px 48px rgba(102,126,234,0.4)', border: '1px solid rgba(102,126,234,0.5)' },
  gridContent: {},
  listContent: { display: 'flex', gap: '20px', alignItems: 'center' },
  textSection: { flex: 1 },
  checkbox: { position: 'absolute', top: '16px', left: '16px', width: '20px', height: '20px', cursor: 'pointer', accentColor: '#667eea' },
  selected: { border: '3px solid #667eea', boxShadow: '0 8px 32px rgba(102,126,234,0.6)' },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  mdToggleBtn: { background: 'rgba(102,126,234,0.2)', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.2s ease' },
  markdown: { fontSize: '15px', color: theme === 'dark' ? '#e0e0e0' : '#333', lineHeight: '1.6' },
  contentExpanded: { margin: 0, fontSize: '15px', color: theme === 'dark' ? '#e0e0e0' : '#333', fontWeight: '500', whiteSpace: 'pre-wrap', lineHeight: '1.6' },
  pinned: { background: 'rgba(255,215,0,0.1)', border: '2px solid #ffd700', boxShadow: '0 8px 32px rgba(255,215,0,0.3)' },
  pinnedBadge: { position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', boxShadow: '0 2px 8px rgba(255,215,0,0.4)' },
  title: { margin: 0, fontSize: '20px', fontWeight: '800', color: theme === 'dark' ? '#fff' : '#000', lineHeight: '1.4', flex: 1 },
  content: { margin: '0', fontSize: '15px', color: theme === 'dark' ? '#e0e0e0' : '#333', fontWeight: '500', whiteSpace: 'pre-wrap', lineHeight: '1.6', minHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' },
  actions: { display: 'flex', gap: '6px', paddingTop: '12px', borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', flexWrap: 'nowrap', justifyContent: 'space-evenly' },
  iconBtn: { background: theme === 'dark' ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.15)', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px 8px', borderRadius: '6px', transition: 'all 0.2s ease' }
});
