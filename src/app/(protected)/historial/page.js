'use client';
import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import StatusBox from '@/components/StatusBox';

export default function HistorialPage() {
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]       = useState(1);
  const [fecha, setFecha]     = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      let url = `/historial?page=${page}&limit=10`;
      if (fecha) url += `&fecha=${fecha}`;
      const r = await apiFetch(url);
      setData(r.data || []);
      setPagination(r.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      if (err.status === 401) { router.replace('/login'); return; }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, fecha, router]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este registro?')) return;
    setDeleting(id);
    try {
      await apiFetch(`/historial/${id}`, { method: 'DELETE' });
      load();
    } catch (err) { setError(err.message); }
    finally { setDeleting(null); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 34, fontWeight: 700 }}>
            HISTORIAL <span style={{ color: 'var(--neon)' }}>▤</span>
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 4 }}>
            {pagination.total} registros en total
          </p>
        </div>
        <Link href="/historial/nuevo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '11px 22px', borderRadius: 10,
          background: 'linear-gradient(135deg, var(--purple), var(--neon))',
          color: 'white', fontWeight: 700, fontSize: 14, textDecoration: 'none',
          boxShadow: '0 0 20px var(--glow)', fontFamily: 'Rajdhani, sans-serif',
        }}>+ NUEVO</Link>
      </div>

      <div className="card fade-up-1" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>
            Filtrar por fecha
          </label>
          <input type="date" value={fecha} onChange={e => { setFecha(e.target.value); setPage(1); }}
            className="field" style={{ width: 'auto' }} />
          {fecha && (
            <button onClick={() => { setFecha(''); setPage(1); }} style={{
              background: 'transparent', border: 'none', color: 'var(--text3)',
              cursor: 'pointer', fontSize: 13,
            }}>✕ Limpiar</button>
          )}
        </div>
      </div>

      <StatusBox error={error} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)' }}>Cargando...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>▤</div>
          <p>{fecha ? 'No hay registros para esta fecha.' : 'No tienes entrenamientos aún.'}</p>
          <Link href="/historial/nuevo" style={{ color: 'var(--neon)', textDecoration: 'none', marginTop: 12, display: 'block', fontSize: 14 }}>
            Registrar entrenamiento →
          </Link>
        </div>
      ) : (
        <div className="card fade-up-2" style={{ overflow: 'hidden' }}>
          <table className="lu-table">
            <thead>
              <tr>
                <th>Ejercicio</th>
                <th>Músculo</th>
                <th>Fecha</th>
                <th>Series</th>
                <th>Reps</th>
                <th>Peso</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.ejercicio_nombre}</td>
                  <td><span className="badge badge-purple">{r.musculo}</span></td>
                  <td style={{ color: 'var(--text3)', fontSize: 13 }}>{r.fecha}</td>
                  <td style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: 'var(--neon2)', fontSize: 16 }}>{r.series}</td>
                  <td style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: 'var(--neon2)', fontSize: 16 }}>{r.reps}</td>
                  <td style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: 'var(--green)', fontSize: 16 }}>{r.peso} kg</td>
                  <td>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      style={{
                        background: 'transparent', border: '1px solid rgba(248,113,113,0.2)',
                        color: 'var(--red)', borderRadius: 6, padding: '4px 10px',
                        fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >{deleting === r.id ? '...' : '✕'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Anterior</Button>
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>
            Página <span style={{ color: 'var(--neon2)', fontWeight: 600 }}>{pagination.page}</span> de {pagination.totalPages}
          </span>
          <Button variant="ghost" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</Button>
        </div>
      )}

    </div>
  );
}
