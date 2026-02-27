# Technology Deep Dive: React Three Fiber

> React Three Fiber (R3F) is a React renderer for Three.js, allowing 3D scenes to be built with React components.

---

## 🎯 What is React Three Fiber?

React Three Fiber is a React renderer for [Three.js](https://threejs.org/), the most popular WebGL library. It allows you to write Three.js code using React's declarative component model.

### Without R3F (Imperative)

```javascript
// Traditional Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  renderer.render(scene, camera);
}
animate();
```

### With R3F (Declarative)

```tsx
// React Three Fiber
function Cube() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <boxGeometry />
      <meshBasicMaterial color={0x00ff00} />
    </mesh>
  );
}

function Scene() {
  return (
    <Canvas>
      <Cube />
    </Canvas>
  );
}
```

---

## 🏗️ Core Concepts

### The Canvas

The `Canvas` component is the root of every R3F scene:

```tsx
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Scene contents */}
    </Canvas>
  );
}
```

### Native Three.js objects as JSX

```tsx
<mesh>           {/* THREE.Mesh */}
  <boxGeometry />           {/* THREE.BoxGeometry */}
  <meshStandardMaterial />  {/* THREE.MeshStandardMaterial */}
</mesh>
```

### Constructor arguments via args

```tsx
{/* new THREE.BoxGeometry(2, 2, 2) */}
<boxGeometry args={[2, 2, 2]} />

{/* new THREE.PerspectiveCamera(75, aspect, 0.1, 1000) */}
<perspectiveCamera args={[75, aspect, 0.1, 1000]} />
```

---

## 🎣 R3F Hooks

### useFrame

Run code every frame (animation loop):

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    // state.clock.elapsedTime - total time
    // delta - time since last frame
    
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### useThree

Access Three.js objects:

```tsx
import { useThree } from '@react-three/fiber';

function CameraController() {
  const { camera, scene, gl } = useThree();
  
  // camera - THREE.Camera
  // scene - THREE.Scene  
  // gl - THREE.WebGLRenderer
  
  return null;
}
```

### useLoader

Load external assets:

```tsx
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model() {
  const gltf = useLoader(GLTFLoader, '/model.glb');
  return <primitive object={gltf.scene} />;
}
```

---

## 📦 @react-three/drei

Drei is a collection of useful helpers for R3F:

```bash
npm install @react-three/drei
```

### Common Components

```tsx
import { 
  OrbitControls,  // Camera controls
  Stars,          // Starfield background
  PerspectiveCamera,
  Environment,
  useTexture,
  useGLTF
} from '@react-three/drei';

function Scene() {
  return (
    <>
      <OrbitControls enableZoom={false} />
      <Stars radius={100} depth={50} count={5000} />
      <Environment preset="city" />
    </>
  );
}
```

---

## 🎨 Materials and Lighting

### Material Types

```tsx
{/* Unlit, solid color */}
<meshBasicMaterial color="red" />

{/* PBR material, reacts to light */}
<meshStandardMaterial 
  color="red"
  roughness={0.5}
  metalness={0.8}
/>

{/* Physically based, more realistic */}
<meshPhysicalMaterial
  color="red"
  roughness={0.2}
  metalness={0.5}
  clearcoat={1}
/>
```

### Lights

```tsx
{/* Ambient - base illumination */}
<ambientLight intensity={0.5} />

{/* Directional - like sun */}
<directionalLight position={[5, 5, 5]} intensity={1} castShadow />

{/* Point - like light bulb */}
<pointLight position={[0, 2, 0]} intensity={1} color="#ff00ff" />

{/* Spot - cone of light */}
<spotLight position={[0, 5, 0]} angle={0.3} penumbra={0.5} />
```

---

## 🔄 Animation Patterns

### Lerp (Linear Interpolation)

Smooth transitions between values:

```tsx
import { Vector3 } from 'three';

function SmoothMovement() {
  const meshRef = useRef<THREE.Mesh>(null);
  const target = new Vector3(5, 0, 0);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly move toward target
      meshRef.current.position.lerp(target, delta * 2);
    }
  });
  
  return <mesh ref={meshRef} />;
}
```

### Sine Wave Animation

Oscillating movement:

```tsx
useFrame((state) => {
  const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  meshRef.current.position.y = floatY;
});
```

---

## 🎯 This Project's Usage

### Scene Component

```tsx
export function Scene() {
  const isPowered = useComputerStore((s) => s.isPowered);
  
  return (
    <Canvas camera={{ position: [0, 0.5, 6], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
      
      <Stars radius={100} depth={50} count={5000} />
      <FloatingParticles />
      <Computer />
      
      {isPowered && <CameraZoom isZooming={true} />}
      
      <OrbitControls enableRotate={!isPowered} />
    </Canvas>
  );
}
```

### Model Loading

```tsx
import { FBXLoader } from 'three-stdlib';

function ModelMonitor() {
  const fbx = useLoader(FBXLoader, '/models/crt-monitor.fbx');
  
  return <primitive object={fbx} scale={0.02} />;
}
```

---

## ⚠️ SSR Considerations

Three.js requires browser APIs. In Next.js:

```tsx
import dynamic from 'next/dynamic';

const Scene = dynamic(
  () => import('@/components/3d/Scene').then(mod => mod.Scene),
  { ssr: false }
);
```

---

## 🔗 Related Documentation

- [[06 - React Three Fiber Setup|React Three Fiber Setup]] — Scene architecture
- [[07 - The CRT Monitor Model|The CRT Monitor Model]] — Model loading
- [[08 - Scene Effects|Scene Effects]] — Particles and animation
- [R3F Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Documentation](https://github.com/pmndrs/drei)

---

## 📝 Best Practices

1. **Use `useFrame` sparingly** — Update only what needs animation
2. **Memoize expensive objects** — Use `useMemo` for geometries/materials
3. **Reuse materials** — Don't create new materials every render
4. **Profile performance** — Use `gl.stats` in development
5. **Lazy load heavy scenes** — Dynamic imports for code splitting
