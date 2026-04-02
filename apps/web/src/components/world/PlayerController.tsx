"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useWorldStore } from "@/store/useWorldStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RapierRigidBody = any;

const MOVE_SPEED = 5;
const SPRINT_SPEED = 9;
const ROTATION_SPEED = 0.003;
const CAMERA_DISTANCE = 4;
const CAMERA_HEIGHT = 1.8;

interface Keys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  shift: boolean;
}

interface PlayerControllerProps {
  onPositionChange?: (x: number, y: number, z: number, ry: number) => void;
}

export function PlayerController({ onPositionChange }: PlayerControllerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const cameraAngleY = useRef(0);
  const cameraAngleX = useRef(0.3);
  const keys = useRef<Keys>({ w: false, a: false, s: false, d: false, shift: false });
  const lastSentPosition = useRef({ x: 0, y: 0, z: 0, ry: 0 });
  const sendTimer = useRef(0);

  const { camera } = useThree();
  const { movementEnabled, setPointerLocked, activePanel } = useWorldStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW": keys.current.w = true; break;
      case "KeyA": keys.current.a = true; break;
      case "KeyS": keys.current.s = true; break;
      case "KeyD": keys.current.d = true; break;
      case "ShiftLeft":
      case "ShiftRight":
        keys.current.shift = true; break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW": keys.current.w = false; break;
      case "KeyA": keys.current.a = false; break;
      case "KeyS": keys.current.s = false; break;
      case "KeyD": keys.current.d = false; break;
      case "ShiftLeft":
      case "ShiftRight":
        keys.current.shift = false; break;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!document.pointerLockElement || !movementEnabled || activePanel) return;
      cameraAngleY.current -= e.movementX * ROTATION_SPEED;
      cameraAngleX.current = Math.max(
        0.1,
        Math.min(1.2, cameraAngleX.current + e.movementY * ROTATION_SPEED),
      );
    },
    [movementEnabled, activePanel],
  );

  const handlePointerLockChange = useCallback(() => {
    setPointerLocked(!!document.pointerLockElement);
  }, [setPointerLocked]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handlePointerLockChange]);

  useFrame((_state, delta) => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const pos = rb.translation();

    // Camera follow (third-person)
    const camX = pos.x + Math.sin(cameraAngleY.current) * CAMERA_DISTANCE * Math.cos(cameraAngleX.current);
    const camY = pos.y + CAMERA_HEIGHT + Math.sin(cameraAngleX.current) * CAMERA_DISTANCE;
    const camZ = pos.z + Math.cos(cameraAngleY.current) * CAMERA_DISTANCE * Math.cos(cameraAngleX.current);

    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.12);
    camera.lookAt(pos.x, pos.y + 1.2, pos.z);

    if (!movementEnabled || activePanel) return;

    // Movement
    const speed = keys.current.shift ? SPRINT_SPEED : MOVE_SPEED;
    const forward = new THREE.Vector3(
      -Math.sin(cameraAngleY.current),
      0,
      -Math.cos(cameraAngleY.current),
    );
    const right = new THREE.Vector3(
      Math.cos(cameraAngleY.current),
      0,
      -Math.sin(cameraAngleY.current),
    );

    const vel = new THREE.Vector3(0, 0, 0);
    if (keys.current.w) vel.add(forward);
    if (keys.current.s) vel.sub(forward);
    if (keys.current.a) vel.sub(right);
    if (keys.current.d) vel.add(right);

    if (vel.lengthSq() > 0) vel.normalize().multiplyScalar(speed);

    const currentVel = rb.linvel();
    rb.setLinvel({ x: vel.x, y: currentVel.y, z: vel.z }, true);

    // Throttled position sync (every 100ms)
    sendTimer.current += delta;
    if (sendTimer.current >= 0.1) {
      sendTimer.current = 0;
      const ry = cameraAngleY.current;
      const { x, y, z } = pos;

      const moved =
        Math.abs(x - lastSentPosition.current.x) > 0.01 ||
        Math.abs(y - lastSentPosition.current.y) > 0.01 ||
        Math.abs(z - lastSentPosition.current.z) > 0.01 ||
        Math.abs(ry - lastSentPosition.current.ry) > 0.02;

      if (moved) {
        lastSentPosition.current = { x, y, z, ry };
        onPositionChange?.(x, y, z, ry);
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 1.5, 0]}
      enabledRotations={[false, false, false]}
      type="dynamic"
      colliders={false}
      friction={0}
      linearDamping={10}
    >
      <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />

      {/* Player capsule mesh */}
      <group>
        {/* Body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.3} metalness={0.4} emissive="#3d1a7a" emissiveIntensity={0.3} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.2} metalness={0.5} emissive="#3d1a7a" emissiveIntensity={0.3} />
        </mesh>
        {/* Player marker glow */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 16]} />
          <meshBasicMaterial color="#a855f7" opacity={0.4} transparent />
        </mesh>
      </group>
    </RigidBody>
  );
}
