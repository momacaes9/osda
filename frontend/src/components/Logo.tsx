export function Logo({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/logo.jpg"
      alt="OSDA"
      width={size}
      height={size}
      className="logo-img"
      style={{ width: size, height: size }}
      decoding="async"
    />
  );
}
