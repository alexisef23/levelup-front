'use client';
import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import StatusBox from '@/components/StatusBox';

const MUSCULOS = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Core', 'Glúteos', 'Pantorrillas'];

export default function EjerciciosPage() {
  const router = useRouter();
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  const [data, setData]         = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]         = useState(1);
  const [musculo, setMusculo]   = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ nombre: '', musculo: '' });
  const [saving, setSaving]     = useState(false);
  const [fSuccess, setFSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      let url = `/ejercicios?page=${page}&limit=12`;
      if (musculo) url += `&musculo=${encodeURIComponent(musculo)}`;
      const r = await apiFetch(url);
      setData(r.data || []);
      setPagination(r.pagination || {});
    } catch (err) {
      if (err.status === 401) { router.replace('/login'); return; }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, musculo, router]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true); setError(''); setFSuccess('');
    try {
      await apiFetch('/ejercicios', { method: 'POST', body: JSON.stringify(form) });
      setFSuccess('Ejercicio creado ✓');
      setForm({ nombre: '', musculo: '' });
      load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  const muscleColors = {
    Pecho: 'badge-purple', Espalda: 'badge-yellow', Piernas: 'badge-green',
    Hombros: 'badge-red', Bíceps: 'badge-purple', Tríceps: 'badge-yellow',
    Core: 'badge-green', Glúteos: 'badge-red', Pantorrillas: 'badge-yellow',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 34, fontWeight: 700 }}>
            EJERCICIOS <span style={{ color: 'var(--neon)' }}>◎</span>
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 4 }}>{pagination.total} ejercicios en el catálogo</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'ghost' : 'primary'}>
            {showForm ? '✕ Cancelar' : '+ Agregar ejercicio'}
          </Button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="card glow-border fade-up-1" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--neon2)' }}>
            NUEVO EJERCICIO
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 180 }}>
              <Input label="Nombre del ejercicio" placeholder="Press banca..." value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} required />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>Músculo</label>
                <select className="field" value={form.musculo} onChange={e => setForm(f => ({...f, musculo: e.target.value}))} required>
                  <option value="">— Selecciona —</option>
                  {MUSCULOS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <Button type="submit" disabled={saving}>{saving ? '...' : 'Crear'}</Button>
          </form>
          {(error || fSuccess) && <div style={{ marginTop: 12 }}><StatusBox error={error} success={fSuccess} /></div>}
        </div>
      )}

      <div className="fade-up-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => { setMusculo(''); setPage(1); }}
          style={{
            padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: !musculo ? '1px solid var(--neon)' : '1px solid var(--border)',
            background: !musculo ? 'rgba(168,85,247,0.15)' : 'transparent',
            color: !musculo ? 'var(--neon2)' : 'var(--text3)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >Todos</button>
        {MUSCULOS.map(m => (
          <button key={m}
            onClick={() => { setMusculo(m); setPage(1); }}
            style={{
              padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
              border: musculo === m ? '1px solid var(--neon)' : '1px solid var(--border)',
              background: musculo === m ? 'rgba(168,85,247,0.15)' : 'transparent',
              color: musculo === m ? 'var(--neon2)' : 'var(--text3)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{m}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)' }}>Cargando...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>◎</div>
          <p>No hay ejercicios {musculo ? `para ${musculo}` : 'en el catálogo'}.</p>
        </div>
      ) : (
        <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {data.map(e => (
            <div key={e.id} className="card" style={{ padding: '16px 18px', cursor: 'default' }}>
              <span className={`badge ${muscleColors[e.musculo] || 'badge-purple'}`} style={{ marginBottom: 10, display: 'inline-flex' }}>
                {e.musculo}
              </span>
              <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginTop: 6 }}>{e.nombre}</p>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Anterior</Button>
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>
            <span style={{ color: 'var(--neon2)', fontWeight: 600 }}>{pagination.page}</span> / {pagination.totalPages}
          </span>
          <Button variant="ghost" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</Button>
        </div>
      )}

    </div>
  );
}
