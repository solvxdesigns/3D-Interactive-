import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, RoundedBox, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { Group } from "three";

export function Robot() {
  const group = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const antennaOrbRef = useRef<THREE.Mesh>(null);
  
  const scroll = useScroll();

  // Materials
  const ceramicMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#FFFFFF",
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00F2FF",
    emissive: "#00F2FF",
    emissiveIntensity: 2
  }), []);
  
  const jointMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333333",
    roughness: 0.7,
    metalness: 0.5
  }), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const offset = scroll.offset;

    // --- 1. Entrance (0-25%) ---
    if (offset < 0.25) {
        const p = offset * 4;
        group.current.position.y = THREE.MathUtils.lerp(10, 0, p);
        group.current.rotation.y = p * Math.PI * 2;
        group.current.position.x = 0;
        group.current.scale.setScalar(1);
        group.current.rotation.z = 0;
    }

    // --- 2. Idle & Floating (25-50%) ---
    if (offset >= 0.25 && offset < 0.5) {
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -Math.PI/8 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        if (leftArmRef.current) leftArmRef.current.rotation.z = Math.PI/8 + Math.cos(state.clock.elapsedTime * 3) * 0.2;
    }

    // --- 3. Gestures & Jump (50-75%) ---
    if (offset >= 0.5 && offset < 0.75) {
        const p = (offset - 0.5) * 4;
        const jumpY = Math.abs(Math.sin(p * Math.PI)) * 2;
        group.current.position.y = jumpY;
        
        // Squash and Stretch
        const squash = 1 - Math.sin(p * Math.PI) * 0.3;
        const stretch = 1 + Math.sin(p * Math.PI) * 0.3;
        group.current.scale.set(stretch, squash, stretch);
    }

    // --- 4. Move Aside (75-100%) ---
    if (offset >= 0.75 && offset < 0.9) {
        const p = (offset - 0.75) * (1 / 0.15);
        group.current.position.x = THREE.MathUtils.lerp(0, -4, p);
        group.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI / 4, p);
        group.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.7, p));
        group.current.position.y = 0;
    }

    // --- 5. Fall Sequence (0.9 - 1.0) ---
    if (offset >= 0.9) {
        const p = (offset - 0.9) * 10;
        
        // Wobble
        const wobble = Math.sin(p * 20) * (0.3 * (1 - p));
        group.current.rotation.z = wobble;
        
        // Eyes to X
        if (leftEyeRef.current) leftEyeRef.current.scale.set(1.5, 0.2, 1);
        if (rightEyeRef.current) rightEyeRef.current.scale.set(1.5, 0.2, 1);

        // Actual Fall
        if (p > 0.5) {
            const fallP = (p - 0.5) * 2;
            group.current.position.y = -(fallP * fallP * 20);
            group.current.rotation.x += delta * 10;
            group.current.rotation.z += delta * 5;
        }
    } else {
        // Reset eye scale if not falling
        if (leftEyeRef.current) leftEyeRef.current.scale.set(1, 1, 1);
        if (rightEyeRef.current) rightEyeRef.current.scale.set(1, 1, 1);
    }

    // Universal animations
    if (antennaOrbRef.current) {
        const mat = antennaOrbRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* HEAD */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        <Sphere args={[0.6, 32, 32]} material={ceramicMaterial} />
        <group position={[0, 0.6, 0]}>
           <Cylinder args={[0.02, 0.02, 0.4]} material={jointMaterial} position={[0, 0.2, 0]} />
           <Sphere ref={antennaOrbRef} args={[0.08, 16, 16]} material={eyeMaterial} position={[0, 0.45, 0]} />
        </group>
        <group position={[0, 0.1, 0.5]}>
           <mesh ref={leftEyeRef} position={[-0.2, 0, 0]} material={eyeMaterial}>
             <sphereGeometry args={[0.12, 32, 32]} />
           </mesh>
           <mesh ref={rightEyeRef} position={[0.2, 0, 0]} material={eyeMaterial}>
             <sphereGeometry args={[0.12, 32, 32]} />
           </mesh>
        </group>
      </group>

      {/* BODY */}
      <group ref={bodyRef} position={[0, 0.3, 0]}>
        <RoundedBox args={[1, 1.2, 0.8]} radius={0.2} smoothness={4} material={ceramicMaterial} />
        <group position={[0, 0.2, 0.41]}>
             <mesh position={[0, 0, 0]}>
               <planeGeometry args={[0.4, 0.2]} />
               <meshStandardMaterial color="#00F2FF" emissive="#00F2FF" emissiveIntensity={1} transparent opacity={0.8} />
             </mesh>
        </group>
      </group>

      {/* ARMS */}
      <group position={[-0.6, 0.6, 0]} ref={leftArmRef}>
        <RoundedBox args={[0.25, 0.8, 0.25]} radius={0.1} position={[0, -0.3, 0]} material={ceramicMaterial} />
      </group>
      <group position={[0.6, 0.6, 0]} ref={rightArmRef}>
        <RoundedBox args={[0.25, 0.8, 0.25]} radius={0.1} position={[0, -0.3, 0]} material={ceramicMaterial} />
      </group>

      {/* LEGS */}
      <group position={[-0.3, -0.4, 0]}>
         <Cylinder args={[0.15, 0.15, 0.6]} material={ceramicMaterial} position={[0, -0.3, 0]} />
      </group>
      <group position={[0.3, -0.4, 0]}>
         <Cylinder args={[0.15, 0.15, 0.6]} material={ceramicMaterial} position={[0, -0.3, 0]} />
      </group>
    </group>
  );
}
