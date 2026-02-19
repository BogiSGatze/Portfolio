'use client';

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Mesh, MeshStandardMaterial, CanvasTexture, Group, DoubleSide } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { FBXLoader } from 'three-stdlib';
import { useComputerStore } from '@/store/computerStore';

function ModelContent() {
  const groupRef = useRef<Group>(null);
  const iconRef = useRef<Mesh>(null);
  const router = useRouter();

  const fbx = useLoader(FBXLoader, '/models/crt-monitor.fbx');
  const { floatOffset, isPowered, turnOn } = useComputerStore();

  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          if (mesh.material) {
            const oldMat = mesh.material as any;
            if (Array.isArray(oldMat)) {
              mesh.material = oldMat.map((m: any) => {
                return new MeshStandardMaterial({
                  color: m.color || 0xd4d4d4,
                  roughness: m.roughness || 0.4,
                  metalness: m.metalness || 0.1,
                });
              });
            } else {
              mesh.material = new MeshStandardMaterial({
                color: oldMat.color || 0xd4d4d4,
                roughness: oldMat.roughness || 0.4,
                metalness: oldMat.metalness || 0.1,
              });
            }
          }
        }
      });
    }
  }, [fbx]);

  useFrame((state) => {
    if (iconRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      iconRef.current.scale.setScalar(breathe);
    }
  });

  const handleScreenClick = () => {
    if (!isPowered) {
      turnOn();
      setTimeout(() => router.push('/desktop'), 150);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleScreenClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPowered, turnOn, router]);

  const iconColor = isPowered ? "#00ff00" : "#ffffff";

  const iconTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    ctx.clearRect(0, 0, 256, 256);
    ctx.shadowColor = iconColor;
    ctx.shadowBlur = 30;
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.arc(128, 140, 80, 240 * Math.PI / 180, 300 * Math.PI / 180, true);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(128, 10);
    ctx.lineTo(128, 65);
    ctx.stroke();
    
    ctx.shadowBlur = 15;
    ctx.lineWidth = 12;
    
    ctx.beginPath();
    ctx.arc(128, 140, 80, 240 * Math.PI / 180, 300 * Math.PI / 180, true);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(128, 10);
    ctx.lineTo(128, 65);
    ctx.stroke();
    
    return new CanvasTexture(canvas);
  }, [iconColor]);

  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 384);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 384; i += 2) {
      ctx.fillRect(0, i, 512, 1);
    }
    
    const gradient = ctx.createRadialGradient(256, 192, 100, 256, 192, 250);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 384);
    
    return new CanvasTexture(canvas);
  }, []);

  return (
    <group ref={groupRef} position={[0, floatOffset, 0]}>
      {fbx && <primitive object={fbx} scale={0.02} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />}
      
      <mesh position={[0, 1.05, 0.28]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.4]} />
        <meshStandardMaterial 
          map={screenTexture}
          color="#ffffff"
          roughness={0.2}
          metalness={0.1}
          side={DoubleSide}
        />
      </mesh>
      
      <mesh 
        ref={iconRef}
        position={[0.02, 1.05, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={handleScreenClick}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial 
          map={iconTexture}
          transparent={true}
          color="#ffffff"
          emissive={iconColor}
          emissiveIntensity={0.5}
          toneMapped={false}
          alphaTest={0.1}
        />
      </mesh>
    </group>
  );
}

export function ModelMonitor() {
  return (
    <Suspense fallback={null}>
      <ModelContent />
    </Suspense>
  );
}
