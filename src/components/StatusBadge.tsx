export function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone ?? children?.toString().toLowerCase().replaceAll(' ', '-')}`}>{children}</span>
}