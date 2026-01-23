
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Preload } from '@react-three/drei';
import Experience from './Experience';
import { useAppState } from './store';
import { ArrowLeft, StepBackIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const navigate = useNavigate()
  const { focusedId, setFocusedId } = useAppState();

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Header UI */}
      <div className="absolute top-8 left-10 flex gap-4 items-center z-20 ">
        <Link to={"/home"}  >
          <ArrowLeft onClick={() => navigate("/home")} />
        </Link>
        <div>
          <h1 className="text-xl text-[#1a1a1a] font-bold tracking-tight">Memory Card- Digital Polaroids.</h1>
          <p className="text-sm font-light italic text-stone-400 normal-case mt-2">View Our Designs Here</p>
        </div>
      </div>
      {/* Cinematic UI Overlay */}
      <div
        className={`fixed inset-0 z-10 pointer-events-none transition-all duration-1000 ${focusedId ? 'bg-black/40 backdrop-blur-md opacity-100' : 'bg-transparent opacity-0'
          }`}
      />

      {/* Close Button (Focus Mode) */}
      {focusedId && (
        <button
          onClick={() => setFocusedId(null)}
          className="absolute top-8 right-10 z-30 pointer-events-auto flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#1a1a1a] group-hover:mr-2 transition-all">Close</span>
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center transition-transform group-hover:rotate-90">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="black" strokeWidth="1.5" />
            </svg>
          </div>
        </button>
      )}

      {/* Scroll Hint (Gallery Mode) */}
      {!focusedId && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
          {/* <div className="w-px h-12 bg-black/20 animate-bounce mb-4" /> */}
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/40">Scroll and Click to Explore</p>
          <p>DM To Get Full Neat Designs</p>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#fdfbf7']} />
        <Suspense fallback={null}>
          <Experience />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Loading Bar Overlay */}
      <Loader />
    </div>
  );
};

export default Main;
