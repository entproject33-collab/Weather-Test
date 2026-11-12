export function Atmosphere({ stars = false }: { stars?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute -top-[26rem] left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full opacity-80"
        style={{
          background: 'radial-gradient(closest-side, var(--glow-1), transparent 72%)',
        }}
      />
      <div
        className="absolute -right-52 top-[24%] h-[34rem] w-[34rem] rounded-full opacity-70"
        style={{
          background: 'radial-gradient(closest-side, var(--glow-2), transparent 70%)',
        }}
      />
      <div
        className="absolute -left-64 bottom-[-10rem] h-[40rem] w-[40rem] rounded-full opacity-50"
        style={{
          background: 'radial-gradient(closest-side, var(--glow-2), transparent 72%)',
        }}
      />
      {stars ? <div className="starfield absolute inset-x-0 top-0 h-[70vh]" /> : null}
      <div className="grain absolute inset-0" />
    </div>
  )
}
