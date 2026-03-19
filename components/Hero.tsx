export function Hero() {
  return (
    <section
      className="relative flex min-h-[min(52vh,520px)] w-full items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="https://assets.mixkit.co/videos/5016/5016-thumb-720-0.jpg"
      >
        <source
          src="https://assets.mixkit.co/videos/5016/5016-720.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" aria-hidden />
      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-5 px-6 pb-8 pt-12 text-center sm:gap-6 sm:pb-12 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          Weekend surf + flight scout
        </p>
        <h1
          id="hero-heading"
          className="font-[family-name:var(--font-surf)] text-5xl leading-tight text-white drop-shadow-md sm:text-6xl md:text-7xl"
        >
          Surf Escape
        </h1>
        <p className="max-w-xl text-base font-medium text-white/95 sm:text-lg">
          Rank curated surf regions by{" "}
          <span className="whitespace-nowrap">round-trip cost</span> and our
          Surf Score — built for flexible intermediate surfers.
        </p>
      </div>
    </section>
  );
}
