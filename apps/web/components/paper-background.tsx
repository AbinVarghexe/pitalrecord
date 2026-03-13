export function PaperBackground({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative flex h-svh w-full bg-[#fcfbf8] overflow-hidden ${className}`}>
      {/* Global Background Texture — Cream Paper */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />
      {children}
    </div>
  )
}
