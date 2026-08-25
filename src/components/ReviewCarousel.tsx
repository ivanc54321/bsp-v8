import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Sarah J.",
    location: "Broadstairs",
    rating: 5,
    text: "The frosted film installation was perfect. Highly professional, clean work, and completely changed the feel of our office space."
  },
  {
    id: 2,
    name: "Mike T.",
    location: "Margate",
    rating: 5,
    text: "Great service! The team was on time and the privacy film looks amazing on our front windows. Highly recommended."
  },
  {
    id: 3,
    name: "Emma L.",
    location: "Ramsgate",
    rating: 5,
    text: "Excellent privacy film for our bathroom window. Quick, affordable, and no mess left behind. Very happy with the result."
  }
];

export function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-6 mb-12">
      <div className="bg-surface-low rounded-3xl p-6 border border-surface-highest/50 shadow-sm relative overflow-hidden min-h-[180px]">
        {/* Decorative Quote Mark */}
        <div className="absolute top-4 right-6 text-brand-lime/10 text-6xl font-serif font-black leading-none select-none">
          "
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col h-full relative z-10"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(REVIEWS[currentIndex].rating)].map((_, i) => (
                <Star key={i} size={14} className="fill-brand-lime text-brand-lime" />
              ))}
            </div>
            
            <p className="text-sm text-white font-medium italic mb-4 flex-grow">
              "{REVIEWS[currentIndex].text}"
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-sm text-brand-lime">
                {REVIEWS[currentIndex].name}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <MapPin size={12} />
                {REVIEWS[currentIndex].location}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-4 bg-brand-lime' : 'w-1.5 bg-surface-highest'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
