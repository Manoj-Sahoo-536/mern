import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import NoteForm from './NoteForm';
import NoteCard from './NoteCard';
import ConfirmDialog from './ConfirmDialog';
import Auth from './Auth';

const colorFilters = [
  { name: 'all', label: 'All', color: '#667eea' },
  { name: 'default', label: 'Default', color: '#555' },
  { name: 'red', label: 'Red', color: '#ef5350' },
  { name: 'orange', label: 'Orange', color: '#ffa726' },
  { name: 'yellow', label: 'Yellow', color: '#ffeb3b' },
  { name: 'green', label: 'Green', color: '#66bb6a' },
  { name: 'blue', label: 'Blue', color: '#42a5f5' },
  { name: 'purple', label: 'Purple', color: '#ab47bc' },
  { name: 'pink', label: 'Pink', color: '#ec407a' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [colorFilter, setColorFilter] = useState('all');
  const [view, setView] = useState('active'); // 'active', 'archived', 'trash'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'title-asc', 'title-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [theme, setTheme] = useState('dark'); // 'dark', 'light'
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [view, user]);



  const fetchNotes = async (searchTerm = '') => {
    const { data } = await getNotes(searchTerm, view === 'archived', view === 'trash');
    setNotes(data);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchNotes(value);
  };

  const handleCreate = async (note) => {
    if (editNote) {
      await updateNote(editNote._id, note);
      setEditNote(null);
    } else {
      await createNote(note);
    }
    fetchNotes(search);
  };

  const handlePin = async (note) => {
    await updateNote(note._id, { ...note, pinned: !note.pinned });
    fetchNotes(search);
  };

  const handleDelete = (id, permanent = false) => {
    const message = permanent 
      ? 'Are you sure you want to permanently delete this note? This action cannot be undone.'
      : 'Move this note to trash?';
    
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: async () => {
        await deleteNote(id, permanent);
        fetchNotes(search);
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  const handleRestore = async (note) => {
    await updateNote(note._id, { ...note, trashed: false, deletedAt: null });
    fetchNotes(search);
  };

  const handleDuplicate = async (note) => {
    const duplicate = {
      title: `${note.title} (Copy)`,
      content: note.content,
      color: note.color,
      pinned: false
    };
    await createNote(duplicate);
    fetchNotes(search);
  };

  const handleExport = (format) => {
    const notesToExport = selectedNotes.length > 0 ? selectedNotes : filteredNotes;
    const dataStr = format === 'json' 
      ? JSON.stringify(notesToExport, null, 2)
      : notesToExport.map(n => `# ${n.title}\n\n${n.content}\n\n---\n\n`).join('');
    
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
    setSelectionMode(false);
    setSelectedNotes([]);
    setShowExportMenu(false);
  };

  const toggleNoteSelection = (note) => {
    setSelectedNotes(prev => 
      prev.find(n => n._id === note._id)
        ? prev.filter(n => n._id !== note._id)
        : [...prev, note]
    );
  };

  const handleArchive = async (note) => {
    await updateNote(note._id, { ...note, archived: !note.archived });
    fetchNotes(search);
  };

  let filteredNotes = colorFilter === 'all' ? notes : notes.filter(n => n.color === colorFilter);
  
  // Apply date filter
  const now = new Date();
  if (dateFilter === 'today') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filteredNotes = filteredNotes.filter(n => new Date(n.createdAt) >= today);
  } else if (dateFilter === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredNotes = filteredNotes.filter(n => new Date(n.createdAt) >= weekAgo);
  } else if (dateFilter === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredNotes = filteredNotes.filter(n => new Date(n.createdAt) >= monthAgo);
  }
  
  // Apply sorting
  filteredNotes = [...filteredNotes].sort((a, b) => {
    switch(sortBy) {
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotes([]);
  };

  const styles = getStyles(theme);

  if (!user) {
    return <Auth onLogin={setUser} theme={theme} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient}></div>
      <header className="header" style={styles.header}>
        <div className="header-content" style={styles.headerContent}>
          <h1 className="logo" style={styles.logo}>
            <span className="logo-icon" style={styles.logoIcon}>✨</span>
            Notes Keeper
          </h1>
          <div className="bottom-row" style={styles.bottomRow}>
            <div className="nav-btns" style={styles.navBtns}>
              <button 
                onClick={() => setView('active')} 
                className="nav-btn"
                style={{...styles.navBtn, ...(view === 'active' && styles.navBtnActive)}}
              >
                📝 Notes
              </button>
              <button 
                onClick={() => setView('archived')} 
                className="nav-btn"
                style={{...styles.navBtn, ...(view === 'archived' && styles.navBtnActive)}}
              >
                📦 Archive
              </button>
              <button 
                onClick={() => setView('trash')} 
                className="nav-btn"
                style={{...styles.navBtn, ...(view === 'trash' && styles.navBtnActive)}}
              >
                🗑️ Trash
              </button>
            </div>
            <div className="search-action-row" style={styles.searchActionRow}>
              <div className="search-wrapper" style={styles.searchWrapper}>
                <span className="search-icon" style={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search your notes..."
                  value={search}
                  onChange={handleSearch}
                  style={styles.search}
                />
              </div>
              <div className="action-btns" style={styles.actionBtns}>
              <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="icon-only-btn" style={styles.iconOnlyBtn} title={viewMode === 'grid' ? 'List View' : 'Grid View'}>
                {viewMode === 'grid' ? '☰' : '⊞'}
              </button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="icon-only-btn" style={styles.iconOnlyBtn} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              {selectionMode ? (
                <>
                  <button onClick={() => { setSelectionMode(false); setSelectedNotes([]); }} className="icon-only-btn" style={styles.iconOnlyBtn} title="Cancel">❌</button>
                  <div style={styles.exportWrapper}>
                    <button onClick={() => setShowExportMenu(!showExportMenu)} className="icon-only-btn" style={{...styles.iconOnlyBtn, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff'}} title="Export">
                      📥 ({selectedNotes.length})
                    </button>
                    {showExportMenu && (
                      <div style={styles.exportMenu}>
                        <button onClick={() => handleExport('txt')} style={styles.exportOption}>Export as TXT</button>
                        <button onClick={() => handleExport('json')} style={styles.exportOption}>Export as JSON</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button onClick={() => setSelectionMode(true)} className="icon-only-btn" style={styles.iconOnlyBtn} title="Export Notes">📥</button>
              )}
              </div>
            </div>
          </div>
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <div className="user-avatar" style={styles.userAvatar}>{user.name.charAt(0).toUpperCase()}</div>
              <span className="user-name" style={styles.userName}>{user.name}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </header>
      <div className="content" style={styles.content}>
        {view === 'active' && <NoteForm onSubmit={handleCreate} editNote={editNote} onCancel={() => setEditNote(null)} theme={theme} />}
        <div className="filter-bar" style={styles.filterBar}>
          <div className="filter-section" style={styles.filterSection}>
            <span className="filter-label" style={styles.filterLabel}>Color:</span>
            {colorFilters.map(f => (
              <button
                key={f.name}
                onClick={() => setColorFilter(f.name)}
                className="filter-btn"
                style={{
                  ...styles.filterBtn,
                  background: colorFilter === f.name ? f.color : 'rgba(255,255,255,0.1)',
                  color: colorFilter === f.name ? '#fff' : '#aaa'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="sort-container" style={styles.sortContainer}>
            <div className="sort-section" style={styles.sortSection}>
              <span className="filter-label" style={styles.filterLabel}>Date:</span>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={styles.sortSelect}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="sort-section" style={styles.sortSection}>
              <span className="filter-label" style={styles.filterLabel}>Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
        {filteredNotes.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>{view === 'trash' ? '🗑️' : view === 'archived' ? '📦' : '📝'}</span>
            <p style={styles.emptyText}>
              {view === 'trash' ? 'Trash is empty' : view === 'archived' ? 'No archived notes' : 'No notes yet. Create your first note!'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid' : 'list'} style={viewMode === 'grid' ? styles.grid : styles.list}>
            {filteredNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={setEditNote}
                onDelete={handleDelete}
                onPin={handlePin}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDuplicate={handleDuplicate}
                view={view}
                viewMode={viewMode}
                theme={theme}
                selectionMode={selectionMode}
                isSelected={selectedNotes.find(n => n._id === note._id)}
                onToggleSelect={toggleNoteSelection}
              />
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}
        theme={theme}
      />
    </div>
  );
}

const getStyles = (theme) => ({
  container: { minHeight: '100vh', position: 'relative', background: theme === 'dark' ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' : 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fce7f3 100%)' },
  bgGradient: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: theme === 'dark' ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' : 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fce7f3 100%)', zIndex: 0 },
  header: { position: 'sticky', top: 0, zIndex: 100, background: theme === 'dark' ? 'rgba(20,20,30,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: theme === 'dark' ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 20px rgba(0,0,0,0.08)', borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' },
  headerContent: { maxWidth: '1400px', margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '24px' },
  bottomRow: { display: 'flex', alignItems: 'center', gap: '24px', flex: 1 },
  searchActionRow: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  logo: { margin: 0, fontSize: '20px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  logoIcon: { fontSize: '24px' },
  searchWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '16px', fontSize: '18px', zIndex: 1, color: theme === 'dark' ? '#888' : '#666' },
  search: { width: '100%', padding: '12px 16px 12px 48px', border: theme === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)', borderRadius: '50px', fontSize: '15px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', transition: 'all 0.3s ease', outline: 'none', color: theme === 'dark' ? '#fff' : '#000' },
  navBtns: { display: 'flex', gap: '4px' },
  navBtn: { padding: '6px 12px', background: 'transparent', color: theme === 'dark' ? '#aaa' : '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
  navBtnActive: { background: theme === 'dark' ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.15)', color: '#667eea' },
  actionBtns: { display: 'flex', gap: '8px', alignItems: 'center' },
  iconOnlyBtn: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: theme === 'dark' ? '#fff' : '#000', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s ease' },

  content: { position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  filterBar: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px', padding: '16px', background: theme === 'dark' ? 'rgba(30,30,45,0.6)' : 'rgba(255,255,255,0.8)', borderRadius: '12px', backdropFilter: 'blur(10px)', alignItems: 'center', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' },
  filterSection: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', flex: 1 },
  sortContainer: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  sortSection: { display: 'flex', gap: '12px', alignItems: 'center', minWidth: 'fit-content' },
  filterLabel: { color: theme === 'dark' ? '#aaa' : '#666', fontSize: '14px', fontWeight: '600' },
  filterBtn: { padding: '8px 16px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.3s ease' },
  sortSelect: { padding: '8px 16px', background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: theme === 'dark' ? '#fff' : '#000', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' },
  empty: { textAlign: 'center', padding: '80px 20px', background: theme === 'dark' ? 'rgba(30,30,45,0.6)' : 'rgba(255,255,255,0.8)', borderRadius: '20px', backdropFilter: 'blur(10px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' },
  emptyIcon: { fontSize: '64px', display: 'block', marginBottom: '16px' },
  emptyText: { fontSize: '18px', color: theme === 'dark' ? '#aaa' : '#666', fontWeight: '500' },
  viewToggle: { padding: '10px 20px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: theme === 'dark' ? '#fff' : '#000', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '50px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s ease', whiteSpace: 'nowrap' },
  exportWrapper: { position: 'relative', display: 'inline-block' },
  exportMenu: { position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: theme === 'dark' ? 'rgba(30,30,45,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', minWidth: '160px', zIndex: 1000 },
  exportOption: { display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: theme === 'dark' ? '#fff' : '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'all 0.2s ease' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700' },
  userName: { color: theme === 'dark' ? '#fff' : '#000', fontSize: '14px', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logoutBtn: { padding: '8px 16px', background: 'rgba(239,83,80,0.15)', color: '#ef5350', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }
});
