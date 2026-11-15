export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0f1a0a" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#8fbf3f" strokeWidth="3" />
      <path d="M22 40c0-12 8-20 22-20-1 14-8 22-20 22" fill="#8fbf3f" />
      <path d="M22 42c4-6 9-11 16-15" stroke="#0f1a0a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
