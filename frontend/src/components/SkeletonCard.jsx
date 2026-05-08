function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Image area skeleton */}
      <div
        className="relative overflow-hidden"
        style={{ height: "160px", background: "rgba(255,255,255,0.04)" }}
      >
        <div className="skeleton-shine absolute inset-0" />
      </div>

      {/* Content skeleton */}
      <div className="p-3 md:p-4 space-y-2.5 md:space-y-3">
        {/* Category + price row */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-16 md:w-20 rounded-full skeleton-block" />
          <div className="h-5 w-14 md:w-16 rounded-full skeleton-block" />
        </div>

        {/* Title */}
        <div className="h-4 w-full rounded skeleton-block" />
        <div className="h-4 w-3/4 rounded skeleton-block" />

        {/* Brand */}
        <div className="h-3 w-1/3 rounded skeleton-block" />

        {/* Stars */}
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 w-3 rounded-full skeleton-block" />
          ))}
          <div className="h-3 w-8 rounded skeleton-block ml-1" />
        </div>

        {/* Button */}
        <div className="h-8 w-full rounded-xl skeleton-block" />
      </div>
    </div>
  );
}

export default SkeletonCard;
