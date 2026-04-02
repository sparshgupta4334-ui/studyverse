"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh } from "three";

interface OtherPlayerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  name: string;
  emote: string;
}

export function OtherPlayer({ position, rotation, color, name, emote }: OtherPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);

  // Animate idle bob
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (emote === "idle") {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.04;
    } else if (emote === "walking") {
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * 0.08;
    }

    // Head bob
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1.0, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.1, 0.95, 0.22]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.95, 0.22]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Name tag — rendered as a billboard plane with canvas texture */}
      <NameTag name={name} />
    </group>
  );
}

function NameTag({ name }: { name: string }) {
  return (
    <group position={[0, 1.4, 0]}>
      <mesh>
        <planeGeometry args={[name.length * 0.12 + 0.2, 0.3]} />
        <meshBasicMaterial color="#000000" opacity={0.6} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
