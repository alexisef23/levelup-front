export default function Card({ title, subtitle, children, className = '', noPad = false }) {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle) && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          {title && <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{subtitle}</p>}
        </div>
      )}
      <div style={noPad ? {} : { padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}
