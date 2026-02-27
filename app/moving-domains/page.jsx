export const metadata = {
  title: "We're Moving — MAH Youth",
  description:
    "MAH Youth is merging with the official Muslim Association of Hamilton website. Stay tuned for updates.",
};

export default function MovingDomainsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-dark via-primary-light to-primary px-4 text-center">
      {/* Animated pulse dot */}
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-accent/30 shadow-lg">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </span>
        <span className="text-sm font-bold text-accent tracking-wider uppercase">
          Important Announcement
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
        <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          We&apos;re Merging!
        </span>
      </h1>

      {/* Body copy */}
      <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-6">
        MAH Youth is joining forces with the official{" "}
        <strong className="text-white">Muslim Association of Hamilton</strong>{" "}
        website. All of our programs, events, and community resources will soon
        be available in one place.
      </p>

      <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
        Stay tuned for further updates on when the transition will be complete.
        In the meantime, visit us at our new home:
      </p>

      {/* CTA button */}
      <a
        href="https://www.mahcanada.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-lg py-4 px-10 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 mb-6"
      >
        Visit mahcanada.com
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        <div className="w-24 h-1 bg-gradient-to-r from-accent via-accent-light to-accent rounded-full"></div>
        <div
          className="w-2 h-2 bg-accent-light rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <p className="text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Muslim Association of Hamilton Youth
      </p>
    </div>
  );
}
