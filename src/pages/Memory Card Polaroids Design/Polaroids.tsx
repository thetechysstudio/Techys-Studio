
/// <reference types="@react-three/fiber" />
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Text, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { PhotoData } from './types';
import { useAppState } from './store';
import { COLORS } from './constants';

interface PolaroidProps {
  data: PhotoData;
  index: number;
  spacing: number;
}

const Polaroid: React.FC<PolaroidProps> = ({ data, index, spacing }) => {
  const meshRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { focusedId, setFocusedId, setHoveredId, hoveredId } = useAppState();
  const { camera } = useThree();

  const [hovered, setHover] = useState(false);
  const isFocused = focusedId === data.id;
  const isAnyFocused = focusedId !== null;

  // Random scattering logic
  const initialData = useMemo(() => ({
    x: index * spacing,
    y: (Math.random() - 0.5) * 1.5,
    z: (Math.random() - 0.5) * 0.5,
    rotation: (Math.random() - 0.5) * 0.3,
  }), [index, spacing]);

  // Handle Focus Transitions
  useEffect(() => {
    if (!meshRef.current) return;

    if (isFocused) {
      // Calculate current world position offset to center it relative to camera
      // but accounting for group translation. We use parent.position.x to neutralize the scroll.
      const parentX = meshRef.current.parent?.position.x || 0;

      gsap.to(meshRef.current.position, {
        x: -parentX, // Neutralize group's scroll to bring to screen center
        y: 0,
        z: 4.5, // Reduced from 6 to prevent "over-zooming" and going off-screen
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.to(meshRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: "power4.out",
      });
    } else {
      // Return to original layout
      gsap.to(meshRef.current.position, {
        x: initialData.x,
        y: initialData.y,
        z: initialData.z,
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.to(meshRef.current.rotation, {
        z: initialData.rotation,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      });
    }
  }, [isFocused, initialData]);

  // Inertial 3D Rotation state
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isFocused) return;

    const onDown = (x: number, y: number) => { isDragging.current = true; lastMousePos.current = { x, y }; };
    const onMove = (x: number, y: number) => {
      if (isDragging.current) {
        const dx = (x - lastMousePos.current.x) * 0.005;
        const dy = (y - lastMousePos.current.y) * 0.005;
        rotationVelocity.current.y += dx;
        rotationVelocity.current.x += dy;
        lastMousePos.current = { x, y };
      }
    };
    const onUp = () => { isDragging.current = false; };

    const handleMouseDown = (e: MouseEvent) => onDown(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = onUp;

    const handleTouchStart = (e: TouchEvent) => onDown(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isFocused]);

  useFrame(() => {
    if (!innerRef.current) return;

    if (isFocused) {
      innerRef.current.rotation.y += rotationVelocity.current.y;
      innerRef.current.rotation.x += rotationVelocity.current.x;
      rotationVelocity.current.y *= 0.94;
      rotationVelocity.current.x *= 0.94;
    } else {
      // Hover parallax
      const targetZ = (hovered && !isAnyFocused) ? 0.8 : 0;
      innerRef.current.position.z = THREE.MathUtils.lerp(innerRef.current.position.z, targetZ, 0.1);

      const targetRot = (hovered && !isAnyFocused) ? -initialData.rotation * 0.3 : 0;
      innerRef.current.rotation.z = THREE.MathUtils.lerp(innerRef.current.rotation.z, targetRot, 0.1);

      innerRef.current.rotation.x = THREE.MathUtils.lerp(innerRef.current.rotation.x, 0, 0.1);
      innerRef.current.rotation.y = THREE.MathUtils.lerp(innerRef.current.rotation.y, 0, 0.1);
    }
  });

  return (
    <group
      ref={meshRef}
      position={[initialData.x, initialData.y, initialData.z]}
      rotation={[0, 0, initialData.rotation]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        // Allow switching focus by clicking another card or closing current
        if (isFocused) {
          setFocusedId(null);
        } else {
          setFocusedId(data.id);
        }
      }}
      onPointerOver={() => {
        // We still want to allow hover feedback if focused on something else?
        // Usually, in gallery apps, you only hover if nothing is focused.
        if (!isAnyFocused) {
          setHover(true);
          setHoveredId(data.id);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHover(false);
        setHoveredId(null);
        document.body.style.cursor = 'default';
      }}
    >
      <group ref={innerRef}>
        {/* Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 4.2, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>

        {/* Front */}
        <group position={[0, 0, 0.05]}>

          {/* MAIN IMAGE */}
          <DreiImage
            url={data.url}
            scale={[2.6, 2.6]}              // 🔽 image size reduced
            position={[0, 0.55, 0.01]}      // 🔼 top aligned
            transparent
            side={THREE.FrontSide}
          />

          {/* QR CODE */}
          <DreiImage
            url={data.url}
            scale={[0.7, 0.7]}
            position={[-0.9, -1.4, 0.01]}   // ⬅️ bottom-left
            transparent
            side={THREE.FrontSide}
          />

          {/* TITLE */}
          <Text
            position={[0, -1.2, 0.02]}
            fontSize={0.2}
            color="#222"
            maxWidth={2.6}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            overflowWrap="break-word"
            font="/fonts/DancingScript-Regular.ttf"
          >
            {data.title}
          </Text>

          {/* SUB TITLE */}
          <Text
            position={[0, -1.5, 0.02]}
            fontSize={0.12}
            color="#555"
            maxWidth={2.6}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            overflowWrap="break-word"
            font="/fonts/Poppins-Regular.ttf"
          >
            {data.subtitle}
          </Text>

          {/* TAGLINE */}
          <Text
            position={[0, -1.7, 0.02]}
            fontSize={0.09}
            color="#777"
            maxWidth={2.6}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            overflowWrap="break-word"
            font="/fonts/Poppins-Regular.ttf"
          >
            {data.tagline}
          </Text>


        </group>

        {/* Back */}
        <group rotation={[0, Math.PI, 0]} position={[0, 0, -0.045]}>
          <mesh>
            <planeGeometry args={[3.4, 4.2]} />
            <meshStandardMaterial color="#f9f9f9" roughness={0.6} />
          </mesh>
          <Text
            position={[0, 1.4, 0.01]}
            fontSize={0.25}
            color="#111"
            maxWidth={3}
            textAlign="center"
            anchorX="center"
            overflowWrap="break-word"
          >
            {data.title}
          </Text>

          <Text
            position={[0, 0.8, 0.01]}
            fontSize={0.12}
            color="#666"
            maxWidth={3}
            textAlign="center"
            anchorX="center"
          >
            {data.size}
          </Text>

          <Text
            position={[0, 0.6, 0.01]}
            fontSize={0.12}
            color="#666"
            maxWidth={3}
            textAlign="center"
            anchorX="center"
          >
            {data.tagline}
          </Text>

          <Text
            position={[0, -0.3, 0.01]}
            fontSize={0.14}
            color="#333"
            maxWidth={2.8}
            textAlign="center"
            anchorX="center"
            lineHeight={1.5}
            overflowWrap="break-word"
          >
            {data.description}
          </Text>

          <Text position={[0, -1.7, 0.01]} fontSize={0.09} color="#aaa" letterSpacing={0.3}>
            ARCHIVE NO. 00{data.id}
          </Text>
        </group>
      </group>
    </group>
  );
};

export default Polaroid;
