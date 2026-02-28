export default function Select({ label, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>
          {label}
        </label>
      )}
      <select className={`field ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
