import { useState } from 'react';
import { ImageOff } from 'lucide-react';

type ProjectImageProps = {
  src: string;
  alt: string;
};

/**
 * Lazy-loads project artwork and degrades to a labelled placeholder if the file
 * is missing (so the layout never breaks while real screenshots are pending).
 */
export default function ProjectImage({ src, alt }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="grid h-full w-full place-items-center bg-accent-gradient-soft"
      >
        <span className="flex flex-col items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <ImageOff size={20} aria-hidden="true" />
          Screenshot coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1200}
      height={750}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
    />
  );
}
