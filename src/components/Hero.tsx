import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MEMORIES } from '../../constants';
import { Polaroid } from './Polaroid';
import { MousePosition } from '../../types';
import { Link } from 'react-router-dom';    

const Hero: React.FC = () => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

    return (
        <div className="relative min-h-screen bg-[#fcfcf9] overflow-hidden flex flex-col selection:bg-stone-100">
            {/* Soft Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stone-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-100/30 blur-[120px] rounded-full" />
            </div>

            {/* Hero Content Layer */}
            <div className="relative z-10 pt-20 px-8 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl"
                >

                    <span className="inline-block px-4 py-1 rounded-full bg-black border border-black text-white text-xs font-semibold tracking-wider uppercase mb-6">
                        The Techys Studio
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                        Making the <span className="font-light italic text-stone-400 normal-case ml-1">memories</span> memorable and everlasting.
                    </h1>
                    <p className="text-lg text-gray-500 font-light max-w-lg mx-auto leading-relaxed mb-6">
                        We are a collective of dreamers and makers preserving the fragments of time that matter most to you.
                    </p>
                    <Link to="/home" className="transform hover:scale-105 px-8 py-3 bg-gray-900 text-white rounded-full font-medium shadow-2xl hover:bg-white hover:text-black transition-colors duration-300">
                        Start Your Story
                    </Link>
                </motion.div>
            </div>

            {/* Interactive Collage Container */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="flex-grow relative w-full h-[600px] md:h-auto overflow-hidden md:overflow-visible mt-12 md:mt-0"
            >
                {/* Desktop Layout: Scattered Collage */}
                <div className="hidden md:block absolute inset-0">
                    {MEMORIES.map((memory, index) => (
                        <Polaroid
                            key={memory.id}
                            memory={memory}
                            index={index}
                            mousePosition={mousePosition}
                        />
                    ))}
                </div>

                {/* Mobile Layout: Horizontal Scroll / Grid */}
                <div className="md:hidden flex flex-nowrap overflow-x-auto gap-6 px-6 pb-20 no-scrollbar snap-x">
                    {MEMORIES.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 snap-center"
                        >
                            <div className="bg-white p-3 pb-10 shadow-lg ring-1 ring-black/5 w-64">
                                <div className="w-full h-72 overflow-hidden bg-gray-100">
                                    <img
                                        src={memory.imageUrl}
                                        alt={memory.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-bold text-sm">{memory.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{memory.caption}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>



            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default Hero;
