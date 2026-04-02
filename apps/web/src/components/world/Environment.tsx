"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment as DreiEnvironment } from "@react-three/drei";
import * as THREE from "three";

export function Environment() {
  const floorRef = useRef<THREE.Mesh>(null);
  const ceilingLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (ceilingLightRef.current) {
      // Subtle flicker for atmosphere
      ceilingLightRef.current.intensity = 0.6 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <>
      {/* Environment map for reflections */}
      <DreiEnvironment preset="night" />

      {/* ── Lighting ── */}
      <ambientLight intensity={0.15} color="#1a1040" />

      {/* Main overhead light */}
      <pointLight
        ref={ceilingLightRef}
        position={[0, 6, 0]}
        intensity={0.6}
        color="#c0a0ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
      />

      {/* Desk lamp warmth */}
      <pointLight position={[-4, 2, -3]} intensity={0.8} color="#ffd280" castShadow distance={8} />
      <pointLight position={[4, 2, -3]} intensity={0.5} color="#80d4ff" distance={6} />

      {/* Neon accent fill lights */}
      <pointLight position={[-8, 1, 0]} intensity={0.4} color="#7c3aed" distance={10} />
      <pointLight position={[8, 1, 0]} intensity={0.3} color="#0891b2" distance={10} />

      {/* ── Floor ── */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial
          color="#0d0d1a"
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Floor grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[30, 30, 1, 1]} />
        <meshBasicMaterial
          color="#a855f7"
          opacity={0.05}
          transparent
          wireframe
        />
      </mesh>

      {/* ── Ceiling ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#080810" roughness={1} metalness={0} />
      </mesh>

      {/* ── Walls ── */}
      {/* Back wall */}
      <mesh position={[0, 4, -10]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial
          color="#0a0a1a"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#080816" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Right wall */}
      <mesh position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#080816" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* ── Neon accent strips on walls ── */}
      <NeonStrip position={[-9.9, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} color="#7c3aed" />
      <NeonStrip position={[9.9, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} color="#0891b2" />
      <NeonStrip position={[0, 0.5, -9.9]} rotation={[0, 0, 0]} color="#a855f7" />

      {/* ── Decorative columns ── */}
      {[[-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8]].map((pos, i) => (
        <Column key={i} position={pos as [number, number, number]} />
      ))}

      {/* ── Ceiling light fixtures ── */}
      {[[-3, 7.8, -3], [3, 7.8, -3], [0, 7.8, 3]].map((pos, i) => (
        <CeilingLight key={i} position={pos as [number, number, number]} />
      ))}
    </>
  );
}

function NeonStrip({ position, rotation, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[16, 0.06]} />
      <meshBasicMaterial color={color} opacity={0.8} transparent />
    </mesh>
  );
}

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Neon ring */}
      <mesh position={[0, -3.5, 0]}>
        <torusGeometry args={[0.25, 0.03, 8, 32]} />
        <meshBasicMaterial color="#7c3aed" />
      </mesh>
    </group>
  );
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        <meshBasicMaterial color="#fffbe0" />
      </mesh>
    </group>
  );
}
