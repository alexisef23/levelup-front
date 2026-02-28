import Navbar from './Navbar';

export default function AppShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {children}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 13,
        color: 'var(--text3)',
        background: 'rgba(13,13,26,0.8)',
      }}>
        <span style={{ color: 'var(--neon)' }}>⚡ LevelUp</span> — Bitácora de Entrenamientos · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
