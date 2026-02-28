import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'LevelUp — Bitácora de Entrenamientos',
  description: 'Registra y sigue el progreso de tus entrenamientos con LevelUp.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
