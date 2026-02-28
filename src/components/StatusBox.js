export default function StatusBox({ loading, error, success }) {
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 8, color: 'var(--neon2)', fontSize: 14 }}>
      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
      Procesando...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (error) return (
    <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, color: 'var(--red)', fontSize: 14 }}>
      ✕ {error}
    </div>
  );
  if (success) return (
    <div style={{ padding: '12px 16px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 8, color: 'var(--green)', fontSize: 14 }}>
      ✓ {success}
    </div>
  );
  return null;
}
