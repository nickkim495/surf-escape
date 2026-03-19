export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top half: video-background hero */}
      <section className="relative h-[50vh] min-h-[320px] w-full overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://assets.mixkit.co/videos/5016/5016-thumb-720-0.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/5016/5016-720.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <h1 className="relative z-10 font-[family-name:var(--font-pacifico)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-lg tracking-wide">
          Surf Escape
        </h1>
      </section>

      {/* Bottom half: plain white section */}
      <section className="flex-1 min-h-[50vh] bg-white" aria-label="Content" />
    </div>
  );
}
