'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import StatusBox from '@/components/StatusBox';
import Link from 'next/link';

export default function NuevoHistorialPage() {
  const router = useRouter();
  const [ejercicios, setEjercicios] = useState([]);
  const [form, setForm] = useState({
    ejercicio_id: '',
    fecha: new Date().toISOString().split('T')[0],
    series: '',
    reps: '',
    peso: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingEx, setLoadingEx] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    apiFetch('/ejercicios?limit=50')
      .then(r => setEjercicios(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingEx(false));
  }, []);

  function onChange(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await apiFetch('/historial', {
        method: 'POST',
        body: JSON.stringify({
          ejercicio_id: Number(form.ejercicio_id),
          fecha: form.fecha,
          series: Number(form.series),
          reps: Number(form.reps),
          peso: Number(form.peso),
        }),
      });
      setSuccess('¡Entrenamiento registrado! 💪');
      setForm(f => ({ ...f, ejercicio_id: '', series: '', reps: '', peso: '' }));
      setTimeout(() => router.push('/historial'), 1500);
    } catch (err) {
      if (err.status === 401) { router.replace('/login'); return; }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const grouped = ejercicios.reduce((acc, e) => {
    if (!acc[e.musculo]) acc[e.musculo] = [];
    acc[e.musculo].push(e);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <Link href="/historial" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          ← Volver al historial
        </Link>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700 }}>
          NUEVO <span style={{ color: 'var(--neon)' }}>ENTRENAMIENTO</span>
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 4 }}>Registra tu sesión de hoy</p>
      </div>

      <div className="card glow-border fade-up-1" style={{ padding: 28 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <Select label="Ejercicio" value={form.ejercicio_id} onChange={e => onChange('ejercicio_id', e.target.value)} required>
            <option value="">— Selecciona un ejercicio —</option>
            {loadingEx ? (
              <option disabled>Cargando...</option>
            ) : (
              Object.entries(grouped).map(([musculo, exs]) => (
                <optgroup key={musculo} label={`▸ ${musculo}`}>
                  {exs.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </optgroup>
              ))
            )}
          </Select>

          <Input label="Fecha" type="date" value={form.fecha} onChange={e => onChange('fecha', e.target.value)} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Input label="Series" type="number" min="1" placeholder="3" value={form.series} onChange={e => onChange('series', e.target.value)} required />
            <Input label="Reps" type="number" min="1" placeholder="10" value={form.reps} onChange={e => onChange('reps', e.target.value)} required />
            <Input label="Peso (kg)" type="number" min="0" step="0.5" placeholder="50" value={form.peso} onChange={e => onChange('peso', e.target.value)} required />
          </div>

          {form.series && form.reps && form.peso && (
            <div style={{
              padding: '12px 16px', borderRadius: 8,
              background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)',
              display: 'flex', gap: 20, alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vista previa</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--neon2)' }}>
                {form.series} × {form.reps}
              </span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>
                {form.peso} kg
              </span>
            </div>
          )}

          <Button type="submit" disabled={loading} size="lg" style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Guardando...' : '✓ Guardar entrenamiento'}
          </Button>
        </form>

        {(error || success) && (
          <div style={{ marginTop: 16 }}>
            <StatusBox error={error} success={success} />
          </div>
        )}
      </div>

    </div>
  );
}
