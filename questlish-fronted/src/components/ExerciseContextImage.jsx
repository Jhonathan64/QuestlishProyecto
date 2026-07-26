export default function ExerciseContextImage({ image, describedBy }) {
  if (!image?.src) return null;

  return (
    <figure
      role="img"
      tabIndex="0"
      className="w-full max-w-2xl mx-auto mb-7 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#140f24]"
      aria-label={`${image.ariaLabel || 'Context image for this exercise'}. ${image.alt}${image.caption ? ` ${image.caption}` : ''}`}
      aria-describedby={describedBy}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="w-full aspect-video object-cover rounded-2xl border border-violet-500/30 shadow-lg shadow-violet-950/40"
      />
      {image.caption && (
        <figcaption className="mt-2 text-sm text-center text-gray-400">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}
