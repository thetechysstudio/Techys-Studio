
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Memory } from '../../types';

interface PolaroidProps {
  memory: Memory;
  mousePosition: { x: number; y: number };
  index: number;
}

export const Polaroid: React.FC<PolaroidProps> = ({ memory, mousePosition, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Parallax values
  const xMovement = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  const yMovement = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });

  // Update movement based on mouse position relative to center
  React.useEffect(() => {
    const multiplier = 20 + index * 5; // Differing speeds for depth
    xMovement.set(mousePosition.x * multiplier);
    yMovement.set(mousePosition.y * multiplier);
  }, [mousePosition, index, xMovement, yMovement]);

  // Determine text reveal side (left or right)
  const isRightSide = memory.x > 50;

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, scale: 0.5, rotate: memory.rotation * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: memory.rotation }}
      transition={{
        delay: index * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        left: `${memory.x}%`,
        top: `${memory.y}%`,
        x: xMovement,
        y: yMovement,
        zIndex: isHovered ? 50 : 10 + index,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex items-center justify-center"
        whileHover={{
          y: -15,
          scale: 1.08,
          rotate: memory.rotation * 0.5,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }}
      >
        {/* The Polaroid Card */}
        <div className="bg-white p-3 pb-12 shadow-md hover:shadow-2xl transition-shadow duration-300 ring-1 ring-black/5">
          <div className="w-48 h-56 overflow-hidden bg-gray-100 relative">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] brightness-[1.05]"
            />
            <div className="absolute inset-0 bg-orange-100/10 mix-blend-overlay pointer-events-none" />
          </div>
          <div className="mt-4 px-1">
            <p className="font-marker text-xs text-gray-400 rotate-1 transform-gpu">
              #{memory.id.padStart(4, '0')}
            </p>
          </div>
        </div>

        {/* Dynamic Text Reveal */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{
                opacity: 0,
                x: isRightSide ? -20 : 20,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                x: isRightSide ? -230 : 230,
                scale: 1
              }}
              exit={{
                opacity: 0,
                x: isRightSide ? -20 : 20,
                scale: 0.95
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`absolute top-0 w-52 p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 pointer-events-none z-[-1]
                ${isRightSide ? 'origin-right' : 'origin-left'}`}
            >
              <h3 className="font-bold text-gray-900 text-sm mb-1">{memory.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light italic">
                "{memory.caption}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
