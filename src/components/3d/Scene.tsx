'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Computer } from './Computer';
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

export function Scene() {
  return (
    <div className={styles.canvasContainer}>
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
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0.5, 0]}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}
