import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', paddingTop: 48 }} className="fade-up">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 18px', borderRadius: 99,
          background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
          marginBottom: 24, fontSize: 13, color: 'var(--neon2)',
        }}>
          ⚡ Tu progreso. Tu historia.
        </div>

        <h1 style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
          fontSize: 'clamp(48px, 8vw, 88px)', lineHeight: 1.05,
          letterSpacing: '-0.01em', marginBottom: 24,
        }} className="glow-text">
          ENTRENA.
          <br />
          <span style={{ color: 'var(--neon)' }}>REGISTRA.</span>
          <br />
          SUPÉRATE.
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 }}>
          LevelUp es tu bitácora de entrenamientos. Lleva el control de cada serie, rep y kilo para ver cómo creces día a día.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 10,
            background: 'linear-gradient(135deg, var(--purple), var(--neon))',
            color: 'white', fontWeight: 700, fontSize: 16,
            textDecoration: 'none', boxShadow: '0 0 30px var(--glow)',
            fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.04em',
          }}>
            EMPEZAR AHORA →
          </Link>
          <Link href="/ejercicios" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 10,
            border: '1px solid var(--border2)', color: 'var(--neon2)',
            fontWeight: 600, fontSize: 15, textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Ver ejercicios
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="fade-up-2">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { icon: '◈', title: 'Dashboard', desc: 'Visualiza tu progreso con estadísticas claras de tus últimas sesiones.' },
            { icon: '▤', title: 'Historial', desc: 'Registra cada entrenamiento con series, reps y peso. Filtra por fecha.' },
            { icon: '◎', title: 'Ejercicios', desc: 'Catálogo de ejercicios organizado por grupo muscular.' },
            { icon: '◉', title: 'Rutina', desc: 'Consulta tu rutina semanal personalizada según tu nivel.' },
          ].map((f) => (
            <div key={f.title} className="stat-box" style={{ cursor: 'default' }}>
              <div style={{ fontSize: 28, marginBottom: 12, color: 'var(--neon)' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
