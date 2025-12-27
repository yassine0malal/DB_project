import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    alt: string;
    placeholderClassName?: string;
    skeleton?: boolean;
}

export const LazyImage = ({
    src,
    alt,
    className,
    placeholderClassName,
    skeleton = true,
    ...props
}: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Load images 50px before they enter viewport
            }
        );

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };

    return (
        <div className="relative overflow-hidden" ref={imgRef}>
            {/* Placeholder/Skeleton */}
            {!isLoaded && skeleton && (
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse",
                        placeholderClassName
                    )}
                >
                    <div className="w-full h-full bg-gray-200" />
                </div>
            )}

            {/* Actual Image */}
            {isInView && !error && (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "transition-opacity duration-300",
                        isLoaded ? "opacity-100" : "opacity-0",
                        className
                    )}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    {...props}
                />
            )}

            {/* Error State */}
            {error && (
                <div className={cn(
                    "flex items-center justify-center bg-gray-100 text-gray-400",
                    className
                )}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}
        </div>
    );
};
