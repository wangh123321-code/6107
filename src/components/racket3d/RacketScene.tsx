import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Racket from './Racket';

function AnimatedRacket() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.02;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
      <group ref={groupRef}>
        <Racket />
      </group>
    </Float>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#a0b4d0" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.4}
        color="#ff8844"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight
        position={[-4, 3, -4]}
        intensity={0.6}
        color="#4488ff"
      />
      <pointLight
        position={[0, -2, 2]}
        intensity={0.3}
        color="#ffffff"
      />
      <spotLight
        position={[0, 6, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.5}
        color="#ffeecc"
        castShadow
      />
    </>
  );
}

export default function RacketScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.5, 3.2], fov: 40, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        localClippingEnabled: true,
      }}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#12131a']} />
      <fog attach="fog" args={['#12131a', 5, 15]} />

      <SceneLights />

      <Suspense fallback={null}>
        <AnimatedRacket />
        <Environment preset="city" />
      </Suspense>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, -0.3]}
      />

      <EffectComposer>
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
