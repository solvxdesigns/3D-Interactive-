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
  const eyesRef = useRef<Group>(null);
  
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
    
    // r1 is the range 0 to 1 (full scroll)
    const r1 = scroll.range(0, 1);
    // section specific ranges
    const entrance = scroll.range(0, 1/4); // 0-25%
    const idle = scroll.range(1/4, 1/4); // 25-50%
    const gestures = scroll.range(2/4, 1/4); // 50-75%
    const exit = scroll.range(3/4, 1/4); // 75-100%
    const fall = scroll.range(0.95, 0.05); // End

    // --- 1. Entrance (0-25%) ---
    // Start at Y=-5, move to Y=0
    // Rotate Y 0 -> 360
    const entranceProgress = entrance;
    if (scroll.offset < 0.25) {
        group.current.position.y = THREE.MathUtils.lerp(5, -0.5, entranceProgress);
        group.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 2, entranceProgress);
        group.current.position.x = 0;
        group.current.scale.setScalar(1);
    }

    // --- 2. Idle (25-50%) ---
    // Float sine wave
    if (scroll.offset >= 0.25 && scroll.offset < 0.5) {
        group.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2; // Slow sway
        
        // Gentle arm wave
        if (rightArmRef.current) {
             rightArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
    }

    // --- 3. Gestures (50-75%) ---
    // Jump animation
    if (scroll.offset >= 0.5 && scroll.offset < 0.75) {
        const jumpProgress = (scroll.offset - 0.5) * 4; // 0 to 1 over this section
        // Simple jump sequence
        const jumpY = Math.abs(Math.sin(jumpProgress * Math.PI * 2)) * 1.5;
        group.current.position.y = -0.5 + jumpY;
        
        // Spin during jump
        group.current.rotation.y = jumpProgress * Math.PI * 2;
    }

    // --- 4. Move to Side (75-100%) ---
    if (scroll.offset >= 0.75 && scroll.offset < 0.95) {
        const exitProgress = (scroll.offset - 0.75) * 4;
        
        // Move to left (-3 viewport units roughly)
        group.current.position.x = THREE.MathUtils.lerp(0, -3.5, exitProgress);
        // Look at content (rotate right)
        group.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI / 4, exitProgress);
        // Scale down slightly to push back
        const s = THREE.MathUtils.lerp(1, 0.8, exitProgress);
        group.current.scale.set(s, s, s);
        group.current.position.y = -0.5; // Reset Y
    }

    // --- 5. Fall (The End) ---
    if (scroll.offset >= 0.95) {
       const fallProgress = (scroll.offset - 0.95) * 20; // Fast fall
       group.current.position.y = -0.5 - (fallProgress * 10);
       group.current.rotation.z = fallProgress * 5;
       group.current.rotation.x = fallProgress * 2;
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* HEAD */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        <Sphere args={[0.6, 32, 32]} material={ceramicMaterial} />
        {/* Antenna */}
        <group position={[0, 0.6, 0]}>
           <Cylinder args={[0.02, 0.02, 0.4]} material={jointMaterial} position={[0, 0.2, 0]} />
           <Sphere args={[0.08, 16, 16]} material={eyeMaterial} position={[0, 0.45, 0]} />
        </group>
        {/* Eyes Container */}
        <group ref={eyesRef} position={[0, 0.1, 0.5]}>
           <Sphere args={[0.12, 32, 32]} position={[-0.2, 0, 0]} material={eyeMaterial} scale={[1, 1, 0.5]} />
           <Sphere args={[0.12, 32, 32]} position={[0.2, 0, 0]} material={eyeMaterial} scale={[1, 1, 0.5]} />
        </group>
      </group>

      {/* BODY */}
      <group ref={bodyRef} position={[0, 0.3, 0]}>
        {/* Torso */}
        <RoundedBox args={[1, 1.2, 0.8]} radius={0.2} smoothness={4} material={ceramicMaterial} />
        {/* Chest Emblem */}
        <group position={[0, 0.2, 0.41]}>
             {/* Simple glowing plate for emblem */}
             <boxGeometry args={[0.4, 0.2, 0.05]} />
             <meshStandardMaterial color="#00F2FF" emissive="#00F2FF" emissiveIntensity={0.5} />
        </group>
      </group>

      {/* ARMS */}
      <group position={[-0.6, 0.6, 0]} ref={leftArmRef}>
         <group rotation={[0, 0, Math.PI / 8]}>
            <RoundedBox args={[0.25, 0.8, 0.25]} radius={0.1} position={[0, -0.3, 0]} material={ceramicMaterial} />
             {/* Hand */}
            <Sphere args={[0.15]} position={[0, -0.75, 0]} material={jointMaterial} />
         </group>
      </group>

      <group position={[0.6, 0.6, 0]} ref={rightArmRef}>
         <group rotation={[0, 0, -Math.PI / 8]}>
            <RoundedBox args={[0.25, 0.8, 0.25]} radius={0.1} position={[0, -0.3, 0]} material={ceramicMaterial} />
             {/* Hand */}
            <Sphere args={[0.15]} position={[0, -0.75, 0]} material={jointMaterial} />
         </group>
      </group>

      {/* LEGS */}
      <group position={[-0.3, -0.4, 0]}>
         <Cylinder args={[0.15, 0.15, 0.6]} material={ceramicMaterial} position={[0, -0.3, 0]} />
         <Sphere args={[0.2]} position={[0, -0.6, 0.1]} material={jointMaterial} />
      </group>
      <group position={[0.3, -0.4, 0]}>
         <Cylinder args={[0.15, 0.15, 0.6]} material={ceramicMaterial} position={[0, -0.3, 0]} />
         <Sphere args={[0.2]} position={[0, -0.6, 0.1]} material={jointMaterial} />
      </group>
    </group>
  );
}
