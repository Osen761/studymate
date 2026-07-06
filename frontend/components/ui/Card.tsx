export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-line bg-white p-5 shadow-soft ${className}`}>{children}</section>;
}
