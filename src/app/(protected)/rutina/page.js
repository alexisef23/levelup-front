'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

const NIVELES = ['principiante', 'intermedio', 'avanzado'];

const dayColors = {
  Lunes: 'var(--neon)',
  Martes: 'var(--neon2)',
  Miércoles: 'var(--green)',
  Jueves: 'var(--neon3)',
  Viernes: 'var(--yellow)',
  Sábado: 'var(--neon)',
  Domingo: 'var(--text3)',
};

export default function RutinaPage() {
  const router = useRouter();
  const [nivel, setNivel]     = useState('principiante');
  const [rutina, setRutina]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function loadRutina(n) {
    setLoading(true); setError('');
    try {
      const r = await apiFetch(`/external/rutina-sugerida?nivel=${n}`);
      setRutina(r.rutina || []);
    } catch (err) {
      if (err.status === 401) { router.replace('/login'); return; }
      setError('No se pudo cargar la rutina. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRutina(nivel); }, [nivel]);

  const workDays = rutina.filter(d => !d.descanso);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div className="fade-up">
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 34, fontWeight: 700 }}>
          RUTINA SEMANAL <span style={{ color: 'var(--neon)' }}>◉</span>
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 4 }}>
          Plan generado vía API externa · wger.de
        </p>
      </div>

      <div className="fade-up-1" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {NIVELES.map(n => (
          <button key={n}
            onClick={() => setNivel(n)}
            style={{
              padding: '10px 24px', borderRadius: 10, fontSize: 14,
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.05em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              border: nivel === n ? 'none' : '1px solid var(--border2)',
              background: nivel === n
                ? 'linear-gradient(135deg, var(--purple), var(--neon))'
                : 'transparent',
              color: nivel === n ? 'white' : 'var(--text2)',
              boxShadow: nivel === n ? '0 0 20px var(--glow)' : 'none',
            }}
          >{n}</button>
        ))}
      </div>

      {/* Stats */}
      {rutina.length > 0 && !loading && (
        <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
          <div className="stat-box" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 40, fontWeight: 700, color: 'var(--neon)' }}>{workDays.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Días de entreno</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 40, fontWeight: 700, color: 'var(--neon2)' }}>
              {workDays[0]?.series || '—'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Series por ej.</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 40, fontWeight: 700, color: 'var(--green)' }}>
              {workDays[0]?.reps || '—'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reps objetivo</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 40, fontWeight: 700, color: 'var(--neon3)' }}>
              {7 - workDays.length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Días descanso</div>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border2)', borderTopColor: 'var(--neon)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p>Generando rutina...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--red)' }}>{error}</div>
      ) : (
        <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {rutina.map((d, i) => (
            <div key={d.dia}
              className="card"
              style={{
                padding: '20px',
                opacity: d.descanso ? 0.5 : 1,
                borderColor: d.descanso ? 'var(--border)' : 'var(--border2)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {/* Day header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: dayColors[d.dia] || 'var(--neon)',
                }}>{d.dia}</span>
                {d.descanso ? (
                  <span className="badge badge-yellow">Descanso</span>
                ) : (
                  <span className="badge badge-purple">Entrenamiento</span>
                )}
              </div>

              <div className="neon-divider" style={{ marginBottom: 12 }} />

              {d.descanso ? (
                <p style={{ fontSize: 14, color: 'var(--text3)', fontStyle: 'italic' }}>
                  Recuperación activa. Estira y descansa.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{d.enfoque}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--neon2)', lineHeight: 1 }}>{d.series}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>series</div>
                    </div>
                    <div style={{ width: 1, background: 'var(--border)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{d.reps}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>reps</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Source note */}
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>
          Rutina generada con datos de{' '}
          <a href="https://wger.de" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon2)', textDecoration: 'none' }}>
            wger.de
          </a>
          {' '}· API externa pública
        </p>
      </div>

    </div>
  );
}
