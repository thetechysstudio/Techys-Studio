
/// <reference types="@react-three/fiber" />
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PHOTOS } from './constants';
import Polaroid from './Polaroids';
import { useAppState } from './store';

const Experience: React.FC = () => {
  const { focusedId } = useAppState();
  const scrollRef = useRef(0);
  const targetScroll = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Spacing between photos
  const spacing = 4.5;
  const totalWidth = (PHOTOS.length - 1) * spacing;

  // Handle horizontal scroll on vertical wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (focusedId) return;
      // Scroll speed sensitivity
      targetScroll.current += e.deltaY * 0.008;
      
      // Keep within bounds
      targetScroll.current = Math.max(-1, Math.min(targetScroll.current, totalWidth + 1));
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [focusedId, totalWidth]);

  useFrame((state, delta) => {
    if (focusedId) return;

    // Smooth inertial scrolling
    scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, targetScroll.current, 0.08);
    
    if (groupRef.current) {
      // Offset the entire group so that it slides horizontally
      groupRef.current.position.x = -scrollRef.current;
    }
  });

  return (
    <>
      {/* Fixed: Environment component in @react-three/drei does not have an 'intensity' prop. 
          The overall scene lighting is adjusted using the other lights below. */}
      <Environment preset="studio" />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <spotLight position={[-10, 10, 20]} angle={0.2} penumbra={1} intensity={1} castShadow />

      <group ref={groupRef}>
        {PHOTOS.map((photo, index) => (
          <Polaroid
            key={photo.id}
            index={index}
            data={photo}
            spacing={spacing}
          />
        ))}
      </group>

      {/* Visual grounding: Soft shadows on a floor plane */}
      <ContactShadows 
        position={[0, -4.5, 0]} 
        opacity={0.3} 
        scale={40} 
        blur={2} 
        far={10} 
        color="#000000"
      />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.51, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#fdfbf7" roughness={1} />
      </mesh>
    </>
  );
};

export default Experience;
