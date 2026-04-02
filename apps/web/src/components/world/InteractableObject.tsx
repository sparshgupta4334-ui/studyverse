"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface InteractableObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  label: string;
  icon: string;
  color: string;
  onInteract: () => void;
  geometry: "box" | "desk" | "shelf" | "monitor" | "whiteboard";
}

export function InteractableObject({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  label,
  icon,
  color,
  onInteract,
  geometry,
}: InteractableObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (hovered) {
      meshRef.current.position.y = position[1] + Math.sin(t * 3) * 0.03;
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered ? 0.15 + Math.sin(t * 4) * 0.05 : 0;
    }
  });

  const getGeometry = () => {
    switch (geometry) {
      case "desk":
        return (
          <group>
            {/* Desk top */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.4, 0.1, 1.2]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Legs */}
            {[[-1.0, -0.55, -0.5], [1.0, -0.55, -0.5], [-1.0, -0.55, 0.5], [1.0, -0.55, 0.5]].map((legPos, i) => (
              <mesh key={i} position={legPos as [number, number, number]} castShadow>
                <boxGeometry args={[0.08, 1.0, 0.08]} />
                <meshStandardMaterial color={color} roughness={0.5} />
              </mesh>
            ))}
          </group>
        );

      case "shelf":
        return (
          <group>
            {/* Bookshelf panels */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.1, 2.5, 1.2]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            <mesh position={[0.95, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 2.5, 1.2]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {[-0.9, -0.3, 0.3, 0.9].map((y, i) => (
              <mesh key={i} position={[0.45, y, 0]} castShadow>
                <boxGeometry args={[1.0, 0.08, 1.2]} />
                <meshStandardMaterial color={color} roughness={0.5} />
              </mesh>
            ))}
          </group>
        );

      case "monitor":
        return (
          <group>
            {/* Screen */}
            <mesh castShadow>
              <boxGeometry args={[1.6, 1.0, 0.06]} />
              <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Screen glow */}
            <mesh position={[0, 0, 0.04]}>
              <planeGeometry args={[1.45, 0.88]} />
              <meshBasicMaterial color="#0a1628" />
            </mesh>
            {/* Screen content lines */}
            {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
              <mesh key={i} position={[0, y, 0.05]}>
                <planeGeometry args={[1.0, 0.04]} />
                <meshBasicMaterial color={i % 2 === 0 ? "#a855f7" : "#3b82f6"} opacity={0.8} transparent />
              </mesh>
            ))}
            {/* Stand */}
            <mesh position={[0, -0.65, 0.1]}>
              <boxGeometry args={[0.12, 0.3, 0.12]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0, -0.82, 0.1]}>
              <boxGeometry args={[0.5, 0.06, 0.3]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        );

      case "whiteboard":
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[2.8, 1.8, 0.06]} />
              <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.1} />
            </mesh>
            {/* Whiteboard surface */}
            <mesh position={[0, 0, 0.04]}>
              <planeGeometry args={[2.6, 1.6]} />
              <meshBasicMaterial color="#0d1117" />
            </mesh>
            {/* Lines on whiteboard */}
            {[-0.4, 0, 0.4].map((y, i) => (
              <mesh key={i} position={[(i - 1) * 0.3, y, 0.05]}>
                <planeGeometry args={[1.8, 0.03]} />
                <meshBasicMaterial color="#a855f7" opacity={0.6} transparent />
              </mesh>
            ))}
            {/* Frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.9, 0.06, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
          </mesh>
        );
    }
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Hover glow sphere */}
      <mesh ref={glowRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={color} opacity={0} transparent side={THREE.BackSide} />
      </mesh>

      {/* Main object */}
      <mesh
        ref={meshRef}
        onClick={onInteract}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[0, 0, 0]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Actual geometry — not raycasted directly, handled by the invisible mesh above */}
      <group
        onClick={onInteract}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {getGeometry()}
      </group>

      {/* Label */}
      {hovered && (
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {`${icon} ${label}`}
        </Text>
      )}

      {/* Floating icon always visible */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.35}
        anchorX="center"
        anchorY="middle"
        color={hovered ? "#ffffff" : "#aaaaaa"}
      >
        {icon}
      </Text>
    </group>
  );
}
