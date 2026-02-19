'use client';

import { useRef, useMemo } from 'react';
import { Mesh, MeshStandardMaterial, BoxGeometry } from 'three';
import { useFrame } from '@react-three/fiber';
import { useComputerStore } from '@/store/computerStore';

export function Monitor() {
  const monitorRef = useRef<Mesh>(null);
  const screenRef = useRef<Mesh>(null);
  const screenMaterialRef = useRef<MeshStandardMaterial>(null);
  const powerLedRef = useRef<Mesh>(null);
  
  const { screenGlow, floatOffset, isPowered } = useComputerStore();

  // Animate screen glow
  useFrame((state) => {
    if (screenMaterialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + screenGlow;
      screenMaterialRef.current.emissiveIntensity = pulse;
    }
    
    // Power LED pulse
    if (powerLedRef.current) {
      const ledPulse = isPowered 
        ? Math.sin(state.clock.elapsedTime * 4) * 0.3 + 0.7 
        : 0.3;
      (powerLedRef.current.material as MeshStandardMaterial).emissiveIntensity = ledPulse;
    }
  });

  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;
    
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 384);
    
    // Scanlines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 384; i += 2) {
      ctx.fillRect(0, i, 512, 1);
    }
    
    // TURN ON text
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.fillText('TURN ON', 256, 192);
    
    // Screen curvature vignette
    const gradient = ctx.createRadialGradient(256, 192, 100, 256, 192, 250);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 384);
    
    const texture = new (require('three').CanvasTexture)(canvas);
    return texture;
  }, []);

  return (
    <group position={[0, floatOffset, 0]}>
      {/* Monitor Frame */}
      <mesh ref={monitorRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.4, 3, 1]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Bezel */}
      <mesh position={[0, 0, 0.51]} castShadow>
        <boxGeometry args={[3.2, 2.7, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
      </mesh>
      
      {/* Screen */}
      <mesh 
        ref={screenRef} 
        position={[0, 0.1, 0.56]} 
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[2.8, 2.3, 0.02]} />
        <meshStandardMaterial 
          ref={screenMaterialRef}
          map={screenTexture}
          color="#ffffff"
          emissive="#4a9eff"
          emissiveIntensity={screenGlow}
          emissiveMap={screenTexture}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Screen Glass Reflection */}
      <mesh position={[0, 0.1, 0.58]}>
        <boxGeometry args={[2.8, 2.3, 0.01]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent={true}
          opacity={0.05}
          roughness={0.0}
          metalness={0.9}
        />
      </mesh>
      
      {/* Brand Logo */}
      <mesh position={[0, -1.3, 0.52]}>
        <boxGeometry args={[0.8, 0.15, 0.02]} />
        <meshStandardMaterial color="#888888" roughness={0.7} />
      </mesh>
      
      {/* Power LED */}
      <mesh ref={powerLedRef} position={[1.4, -1.3, 0.52]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color={isPowered ? "#00ff00" : "#ff3333"}
          emissive={isPowered ? "#00ff00" : "#ff3333"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Monitor Stand Neck */}
      <mesh position={[0, -1.7, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.4]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.4} />
      </mesh>
      
      {/* Monitor Stand Base */}
      <mesh position={[0, -2, 0.1]} castShadow>
        <boxGeometry args={[1.8, 0.2, 1.2]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.4} />
      </mesh>
      
      {/* Control Buttons */}
      {[-0.6, -0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -1.3, 0.52]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
    </group>
  );
}
