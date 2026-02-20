'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Vector3 } from 'three';
import { Computer } from './Computer';
import { useComputerStore } from '@/store/computerStore';
import styles from '@/styles/retro-ui.module.scss';

function FloatingParticles() {
  const particlesRef = useRef<any>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const size = Math.random() * 0.05 + 0.02;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial color="#4a9eff" transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// Camera zoom animation component
function CameraZoom({ isZooming }: { isZooming: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new Vector3(0.3, 0.9, 0));
  const initialPos = useRef(new Vector3(0, 0.5, 6));
  
  useFrame((state, delta) => {
    if (isZooming) {
      // Zoom into the screen position
      camera.position.lerp(targetPos.current, delta * 3);
      
      // Also animate FOV for a more dramatic effect
      const targetFOV = 20;
      if ((camera as any).fov > targetFOV) {
        (camera as any).fov -= delta * 30;
        (camera as any).updateProjectionMatrix();
      }
    }
  });
  
  return null;
}

// Screen flash effect when entering
function ScreenFlash({ isZooming }: { isZooming: boolean }) {
  const flashRef = useRef<HTMLDivElement>(null);
  
  useFrame(() => {
    if (isZooming && flashRef.current) {
      flashRef.current.style.opacity = '1';
    }
  });
  
  return (
    <div 
      ref={flashRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#00ff41',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease-out',
        zIndex: 9999,
      }}
    />
  );
}

export function Scene() {
  const isPowered = useComputerStore((s) => s.isPowered);
  const [isZooming, setIsZooming] = useState(false);
  
  // Start zoom animation when powered on
  useState(() => {
    if (isPowered && !isZooming) {
      setIsZooming(true);
    }
  });
  
  return (
    <div className={styles.canvasContainer}>
      {isZooming && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#00ff41',
          opacity: isPowered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.5s ease-in',
          zIndex: 9999,
        }} />
      )}
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 7]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4a9eff" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#ffaa77" />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={0.5}
        />
        
        <FloatingParticles />
        <Computer />
        
        {isPowered && <CameraZoom isZooming={true} />}
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0.5, 0]}
          enableRotate={!isPowered}
        />
      </Canvas>
    </div>
  );
}
