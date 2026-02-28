export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variants = {
    primary: 'glow-btn text-white font-semibold rounded-lg cursor-pointer',
    ghost:   'bg-transparent border border-[var(--border2)] text-[var(--neon2)] hover:border-[var(--neon)] hover:bg-[rgba(168,85,247,0.08)] rounded-lg transition-all duration-200 cursor-pointer font-medium',
    danger:  'bg-[rgba(248,113,113,0.15)] border border-[rgba(248,113,113,0.3)] text-[var(--red)] hover:bg-[rgba(248,113,113,0.25)] rounded-lg transition-all duration-200 cursor-pointer font-medium',
  };

  return (
    <button
      className={`${sizes[size]} ${variants[variant]} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
}
