import React, { useEffect, useRef, useState } from 'react';

export const RevealOnScroll = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [threshold]);

  const animationClass = isVisible ? 'is-visible' : '';

  return (
    <div
      ref={ref}
      className={`reveal-element reveal-${animation} ${animationClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
