'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/config';
import { getToken, setToken, setUser } from '@/lib/auth';
import StatusBox from '@/components/StatusBox';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (getToken()) router.replace('/dashboard');
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);

    const endpoint = mode === 'login' ? '/users/login' : '/users/register';

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Error al procesar la solicitud');
        return;
      }

      if (mode === 'login') {
        setToken(data.token);
        setUser(data.user);
        router.replace('/dashboard');
      } else {
        setMode('login');
        setError('');
        setEmail(''); setPassword('');
        // show success message briefly
        setError('¡Cuenta creada! Ahora inicia sesión.');
      }
    } catch {
      setError('Error de red / API no disponible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--purple), var(--neon))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, boxShadow: '0 0 30px var(--glow)',
          }}>⚡</div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700 }} className="glow-text">
            LEVEL<span style={{ color: 'var(--neon)' }}>UP</span>
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 6 }}>
            {mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratis'}
          </p>
        </div>

        {/* Card */}
        <div className="card glow-border" style={{ padding: 28 }}>

          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg2)', borderRadius: 10, padding: 4, marginBottom: 24, border: '1px solid var(--border)' }}>
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                  background: mode === m ? 'linear-gradient(135deg, var(--purple), var(--purple2))' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text3)',
                  boxShadow: mode === m ? '0 0 15px var(--glow2)' : 'none',
                }}>
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

            <Button type="submit" disabled={loading} size="lg" style={{ width: '100%', marginTop: 4 }}>
              {loading ? '...' : mode === 'login' ? '→ Entrar' : '→ Crear cuenta'}
            </Button>
          </form>

          {(error) && (
            <div style={{ marginTop: 16 }}>
              <StatusBox error={error.startsWith('¡') ? undefined : error} success={error.startsWith('¡') ? error : undefined} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
