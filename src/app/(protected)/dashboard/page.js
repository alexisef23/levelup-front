'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function StatBox({ icon, label, value, sub, color = 'var(--neon)' }) {
  return (
    <div className="stat-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)' }}>{label}</span>
        <span style={{ fontSize: 20, color }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/historial?limit=50')
      .then(r => setHistorial(r.data || []))
      .catch(err => { if (err.status === 401) router.replace('/login'); })
      .finally(() => setLoading(false));
  }, [router]);

  const totalSeries = historial.reduce((s, r) => s + Number(r.series), 0);
  const totalReps   = historial.reduce((s, r) => s + Number(r.series) * Number(r.reps), 0);
  const maxPeso     = historial.length ? Math.max(...historial.map(r => Number(r.peso))) : 0;
  const ultimos5    = historial.slice(0, 5);

  const muscles = historial.reduce((acc, r) => {
    acc[r.musculo] = (acc[r.musculo] || 0) + 1;
    return acc;
  }, {});
  const topMuscle = Object.entries(muscles).sort((a,b) => b[1]-a[1])[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>Bienvenido de vuelta</p>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 36, fontWeight: 700 }} className="glow-text">
            {user?.email?.split('@')[0]?.toUpperCase() || 'ATLETA'} <span style={{ color: 'var(--neon)' }}>⚡</span>
          </h1>
        </div>
        <Link href="/historial/nuevo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 10,
          background: 'linear-gradient(135deg, var(--purple), var(--neon))',
          color: 'white', fontWeight: 700, fontSize: 14,
          textDecoration: 'none', boxShadow: '0 0 20px var(--glow)',
          fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.04em',
        }}>+ REGISTRAR ENTRENAMIENTO</Link>
      </div>

      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatBox icon="◈" label="Sesiones" value={historial.length} sub="registradas" />
        <StatBox icon="▤" label="Total Series" value={totalSeries} sub="acumuladas" color="var(--neon2)" />
        <StatBox icon="◉" label="Total Reps" value={totalReps.toLocaleString()} sub="repeticiones" color="var(--neon3)" />
        <StatBox icon="◎" label="Mayor peso" value={`${maxPeso}kg`} sub={topMuscle ? `Top: ${topMuscle[0]}` : 'sin data'} color="var(--green)" />
      </div>

      <div className="fade-up-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text2)' }}>ÚLTIMAS SESIONES</h2>
          <Link href="/historial" style={{ fontSize: 13, color: 'var(--neon2)', textDecoration: 'none' }}>Ver todo →</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>Cargando...</div>
        ) : ultimos5.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>◎</div>
            <p>No tienes entrenamientos aún.</p>
            <Link href="/historial/nuevo" style={{ color: 'var(--neon)', textDecoration: 'none', fontSize: 14, marginTop: 8, display: 'block' }}>
              Registra tu primer entrenamiento →
            </Link>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="lu-table">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Músculo</th>
                  <th>Fecha</th>
                  <th>Series × Reps</th>
                  <th>Peso</th>
                </tr>
              </thead>
              <tbody>
                {ultimos5.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{r.ejercicio_nombre}</td>
                    <td><span className="badge badge-purple">{r.musculo}</span></td>
                    <td style={{ color: 'var(--text3)', fontSize: 13 }}>{r.fecha}</td>
                    <td style={{ color: 'var(--neon2)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 15 }}>{r.series} × {r.reps}</td>
                    <td style={{ color: 'var(--green)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>{r.peso} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
