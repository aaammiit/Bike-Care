import React, { useState, useEffect } from "react";
import { Wrench } from "lucide-react";

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  iconFallback?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Robust image component that handles broken, malformed, or unreachable image URLs.
 * 1. Tries the provided `src`.
 * 2. On error, tries `fallbackSrc` once without infinite loop.
 * 3. If fallback also fails or src is empty/malformed, gracefully renders a placeholder UI with an icon instead of broken browser image errors.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
  iconFallback,
  className,
  containerClassName,
  onError,
  ...props
}) => {
  const [errorStage, setErrorStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setErrorStage(0);
  }, [src]);

  const currentSrc = errorStage === 0 ? (src || fallbackSrc) : fallbackSrc;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (errorStage === 0 && fallbackSrc && src !== fallbackSrc) {
      setErrorStage(1);
    } else {
      setErrorStage(2);
    }
    if (onError) {
      onError(e);
    }
  };

  if (!src || errorStage === 2) {
    return (
      <div 
        className={`w-full h-full min-h-[100px] flex flex-col items-center justify-center bg-slate-900/90 text-slate-400 p-3 text-center border border-slate-800/60 rounded-xl ${containerClassName || className || ""}`}
      >
        {iconFallback || <Wrench className="h-8 w-8 text-orange-500/80 mb-1 animate-pulse" />}
        <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase line-clamp-1">
          {alt || "Garage Media"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
