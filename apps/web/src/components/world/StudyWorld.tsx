"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Stats, Preload } from "@react-three/drei";
import { Environment } from "./Environment";
import { PlayerController } from "./PlayerController";
import { InteractableObject } from "./InteractableObject";
import { OtherPlayer } from "./OtherPlayer";
import { sendPlayerMove } from "./MultiplayerProvider";
import { useWorldStore } from "@/store/useWorldStore";
import type { PanelType } from "@studyverse/shared";

// World objects layout
const WORLD_OBJECTS = [
  {
    id: "desk",
    label: "Study Desk",
    icon: "📝",
    color: "#4a3728",
    panel: "notes" as PanelType,
    position: [-4, 0.6, -3] as [number, number, number],
    rotation: [0, 0.4, 0] as [number, number, number],
    geometry: "desk" as const,
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    icon: "📚",
    color: "#3d2b1f",
    panel: "resources" as PanelType,
    position: [5, 1.2, -7] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    geometry: "shelf" as const,
  },
  {
    id: "whiteboard",
    label: "Research Board",
    icon: "🔬",
    color: "#2a2a3e",
    panel: "research" as PanelType,
    position: [0, 1.5, -9] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    geometry: "whiteboard" as const,
  },
  {
    id: "terminal",
    label: "AI Terminal",
    icon: "🤖",
    color: "#1a2a1a",
    panel: "ai-chat" as PanelType,
    position: [-5, 1.1, -6] as [number, number, number],
    rotation: [0, 0.6, 0] as [number, number, number],
    geometry: "monitor" as const,
  },
];

export function StudyWorld() {
  const { setActivePanel, remotePlayers } = useWorldStore();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 8], fov: 65, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: 2, // ACESFilmic
        toneMappingExposure: 1.2,
      }}
      onPointerDown={(e) => {
        // Request pointer lock on canvas click (not on UI elements)
        if (e.target === e.currentTarget) {
          (e.target as HTMLCanvasElement).requestPointerLock?.();
        }
      }}
      style={{ background: "linear-gradient(to bottom, #050508, #0a0a1a)" }}
    >
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 20, 60]} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} debug={false}>
          <Environment />

          {/* Floor collider */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial visible={false} />
          </mesh>

          <PlayerController
            onPositionChange={(x, y, z, ry) => {
              sendPlayerMove(x, y, z, ry);
            }}
          />
        </Physics>

        {/* Interactive world objects */}
        {WORLD_OBJECTS.map((obj) => (
          <InteractableObject
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            label={obj.label}
            icon={obj.icon}
            color={obj.color}
            geometry={obj.geometry}
            onInteract={() => setActivePanel(obj.panel)}
          />
        ))}

        {/* Remote players */}
        {Array.from(remotePlayers.values()).map((player) => (
          <OtherPlayer
            key={player.id}
            position={[player.position.x, player.position.y, player.position.z]}
            rotation={[player.rotation.x, player.rotation.y, player.rotation.z]}
            color={player.color}
            name={player.name}
            emote={player.emote}
          />
        ))}

        <Preload all />
      </Suspense>

      {process.env.NODE_ENV === "development" && <Stats />}
    </Canvas>
  );
}
