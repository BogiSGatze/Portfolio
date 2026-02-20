'use client';

import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Mesh, MeshStandardMaterial, Group, CanvasTexture, DoubleSide } from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { FBXLoader } from 'three-stdlib';
import { useComputerStore } from '@/store/computerStore';

// Final positioned text parameters
const TEXT_POSITION: [number, number, number] = [0.0, 2.1, 0.3];
const TEXT_ROTATION: [number, number, number] = [0, 1.7 * Math.PI / 180, 0];

// Camera animation component
function CameraZoomAnimation({ isAnimating, onComplete }: { isAnimating: boolean; onComplete: () => void }) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const initialPos = useRef(camera.position.clone());
  const targetPos = useRef(new (require('three').Vector3)(0.4, 0.9, 0));
  
  useFrame((state, delta) => {
    if (isAnimating) {
      progressRef.current += delta * 0.8; // Animation speed (slower)
      
      if (progressRef.current >= 1) {
        progressRef.current = 1;
        onComplete();
      }
      
      // Easing function for smooth animation
      const t = progressRef.current;
      const easeIn = t * t * t;
      
      // Interpolate camera position
      camera.position.lerpVectors(initialPos.current, targetPos.current, easeIn);
      
      // Zoom FOV
      const startFOV = 45;
      const endFOV = 10;
      (camera as any).fov = startFOV + (endFOV - startFOV) * easeIn;
      (camera as any).updateProjectionMatrix();
    }
  });
  
  return null;
}

function ModelContent() {
  const groupRef = useRef<Group>(null);
  const textMeshRef = useRef<Mesh>(null);
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenRef = useRef<Mesh>(null);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  const fbx = useLoader(FBXLoader, '/models/crt-monitor.fbx');
  const { floatOffset, isPowered, turnOn } = useComputerStore();

  useEffect(() => {
    if (!fbx) return;

    fbx.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const meshName = (mesh.name || '').toLowerCase();
        const matName = mesh.material && (mesh.material as any).name
          ? (mesh.material as any).name.toLowerCase()
          : '';

        if (meshName.includes('screen') || matName.includes('screen') || matName.includes('win')) {
          mesh.visible = false;
          return;
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const oldMat = mesh.material as any;
          if (Array.isArray(oldMat)) {
            mesh.material = oldMat.map((m: any) => new MeshStandardMaterial({
              color: m.color || 0xd4d4d4,
              roughness: m.roughness || 0.4,
              metalness: m.metalness || 0.1,
            }));
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
  }, [fbx]);

  // Start animation when powered
  useEffect(() => {
    if (isPowered && !isAnimating) {
      setIsAnimating(true);
    }
  }, [isPowered, isAnimating]);

  useFrame((state, delta) => {
    // Animate the blinking cursor
    if (!isPowered && textCanvasRef.current) {
      const canvas = textCanvasRef.current;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const t = state.clock.elapsedTime;
      const cursorOn = Math.floor(t * 2) % 2 === 0;
      ctx.font = 'bold 48px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#00ff41';
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 25;
      const text = `Press ENTER to turn on${cursorOn ? ' _' : ''}`;
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      
      (textTexture as CanvasTexture).needsUpdate = true;
    }

    // Animation: shrink/morph text into screen during transition
    if (isAnimating && textMeshRef.current && screenRef.current) {
      textMeshRef.current.scale.lerp(new (require('three').Vector3)(0.1, 0.1, 0.1), delta * 1.5);
      textMeshRef.current.position.lerp(new (require('three').Vector3)(0.4, 0.9, 0), delta * 1.5);
    }
  });

  const handleTextClick = () => {
    if (!isPowered) {
      turnOn();
    }
  };

  const handleAnimationComplete = () => {
    if (!hasNavigated) {
      setHasNavigated(true);
      router.push('/desktop');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isPowered) {
        turnOn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPowered, turnOn]);

  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 120;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 25;
    ctx.fillText('Press ENTER to turn on _', canvas.width / 2, canvas.height / 2);
    
    textCanvasRef.current = canvas;
    return new CanvasTexture(canvas);
  }, []);

  return (
    <>
      {isAnimating && (
        <CameraZoomAnimation 
          isAnimating={isAnimating} 
          onComplete={handleAnimationComplete}
        />
      )}
      <group ref={groupRef} position={[0, floatOffset, 0]}>
        {/* FBX Model */}
        {fbx && <primitive object={fbx} scale={0.02} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />}
        
        {/* Screen glow effect during transition */}
        {isAnimating && (
          <mesh ref={screenRef} position={[0.35, 0.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.4, 1.0]} />
            <meshStandardMaterial
              color="#00ff41"
              emissive="#00ff41"
              emissiveIntensity={5}
              toneMapped={false}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
        
        {/* Positioned text prompt */}
        {!isPowered && (
          <mesh
            ref={textMeshRef}
            position={TEXT_POSITION}
            rotation={TEXT_ROTATION}
            onClick={handleTextClick}
          >
            <planeGeometry args={[3.2, 0.45]} />
            <meshStandardMaterial
              map={textTexture}
              color="#ffffff"
              roughness={0.2}
              metalness={0.0}
              side={DoubleSide}
              emissive="#00ff41"
              emissiveMap={textTexture}
              emissiveIntensity={0.5}
              toneMapped={false}
              transparent={true}
            />
          </mesh>
        )}
      </group>
    </>
  );
}

export function ModelMonitor() {
  return (
    <Suspense fallback={null}>
      <ModelContent />
    </Suspense>
  );
}
