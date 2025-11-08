export default function Footer({ theme }) {
  const styles = getStyles(theme);

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <p style={styles.copyright}>
          © 2025 Notes Keeper • Created by <a href="https://github.com/manoj-sahoo-536" target="_blank" rel="noopener noreferrer" style={styles.name}>Manoj Kumar Sahoo</a>
        </p>
        <div style={styles.socialLinks} className="social-links">
          <a href="https://github.com/manoj-sahoo-536/NoteKeeper" target="_blank" rel="noopener noreferrer" style={styles.link} title="GitHub">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://linkedin.com/in/manoj-kumar-sahoo-mks" target="_blank" rel="noopener noreferrer" style={styles.link} title="LinkedIn">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
          <a href="mailto:manojsahoo8940@gmail.com" style={styles.link} title="Email">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
            </svg>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

const getStyles = (theme) => ({
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: theme === 'dark' ? 'rgba(20,20,30,0.95)' : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
    padding: '12px 32px'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  copyright: {
    color: theme === 'dark' ? '#aaa' : '#666',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.2'
  },
  name: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'opacity 0.2s ease'
  },
  socialLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: theme === 'dark' ? '#aaa' : '#666',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s ease',
    cursor: 'pointer'
  },
  icon: {
    width: '18px',
    height: '18px'
  }
});
