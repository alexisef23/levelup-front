'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getToken, clearToken, clearUser, getUser } from '@/lib/auth';
import { useState, useEffect } from 'react';

function NavLink({ href, children, icon }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
      textDecoration: 'none', transition: 'all 0.15s',
      background: active ? 'rgba(168,85,247,0.15)' : 'transparent',
      color: active ? 'var(--neon2)' : 'var(--text2)',
      border: active ? '1px solid rgba(168,85,247,0.25)' : '1px solid transparent',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text2)'; }}
    >
      <span>{icon}</span>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [token, setToken2] = useState(null);
  const [user, setUser2] = useState(null);

  useEffect(() => {
    setToken2(getToken());
    setUser2(getUser());
  }, []);

  function logout() {
    clearToken(); clearUser();
    router.replace('/login');
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 0 40px rgba(0,0,0,0.4)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, gap: 8 }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--purple), var(--neon))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px var(--glow)', fontSize: 16,
          }}>⚡</div>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em' }}>
            LEVEL<span style={{ color: 'var(--neon)' }}>UP</span>
          </span>
        </Link>

        {/* Nav links */}
        {token && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
            <NavLink href="/dashboard" icon="◈">Dashboard</NavLink>
            <NavLink href="/historial" icon="▤">Historial</NavLink>
            <NavLink href="/ejercicios" icon="◎">Ejercicios</NavLink>
            <NavLink href="/rutina" icon="◉">Rutina</NavLink>
          </nav>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {token ? (
            <>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--purple), var(--neon2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white',
                    boxShadow: '0 0 10px var(--glow2)',
                  }}>
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text3)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                </div>
              )}
              <button onClick={logout} style={{
                background: 'transparent', border: '1px solid rgba(248,113,113,0.3)',
                color: 'var(--red)', borderRadius: 8, padding: '6px 14px',
                fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >Salir</button>
            </>
          ) : (
            <Link href="/login" style={{
              padding: '7px 18px', borderRadius: 8,
              background: 'linear-gradient(135deg, var(--purple), var(--purple2))',
              color: 'white', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', boxShadow: '0 0 15px var(--glow2)',
            }}>Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}
