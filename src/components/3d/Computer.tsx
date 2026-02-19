'use client';

import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useComputerStore } from '@/store/computerStore';
import { ModelMonitor } from './ModelMonitor';

export function Computer() {
  const groupRef = useRef<Group>(null);
  const setFloatOffset = useComputerStore((state) => state.setFloatOffset);

  useFrame((state) => {
    const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    setFloatOffset(floatY);
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={0.6} position={[0, -0.5, 0]}>
      <ModelMonitor />
    </group>
  );
}
