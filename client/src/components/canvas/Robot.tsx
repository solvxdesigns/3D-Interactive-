import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, RoundedBox, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Group } from "three";

export function Robot() {
  const group = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const faceRef = useRef<Group>(null);
  
  const scroll = useScroll();

  // Materials
  const ceramicMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#FFFFFF",
    roughness: 0.1,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  }), []);

  const screenMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111111",
    roughness: 0.2,
    metalness: 0.8
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00F2FF",
    emissive: "#00F2FF",
    emissiveIntensity: 2
  }), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const offset = scroll.offset;

    // Reset logic: when scrolling back up, the robot "stands up" or re-enters.
    // The sequence is fully reactive to scroll.offset.

    // --- 1. Hero / Entrance (0-25%) ---
    if (offset < 0.25) {
        const p = offset * 4;
        group.current.position.y = THREE.MathUtils.lerp(8, 0, p);
        group.current.rotation.y = p * Math.PI * 2;
        group.current.position.x = 0;
        group.current.scale.setScalar(1);
        group.current.rotation.z = 0;
        group.current.rotation.x = 0;
    }

    // --- 2. Floating & Hovering (25-50%) ---
    else if (offset >= 0.25 && offset < 0.5) {
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        group.current.position.x = 0;
        group.current.scale.setScalar(1);
        
        // Arm movement
        if (rightArmRef.current) rightArmRef.current.rotation.z = -Math.PI/6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        if (leftArmRef.current) leftArmRef.current.rotation.z = Math.PI/6 + Math.cos(state.clock.elapsedTime * 2) * 0.1;
    }

    // --- 3. Interaction & Move Aside (50-75%) ---
    else if (offset >= 0.5 && offset < 0.75) {
        const p = (offset - 0.5) * 4;
        group.current.position.x = THREE.MathUtils.lerp(0, -3.5, p);
        group.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI / 6, p);
        group.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.8, p));
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    // --- 4. Fall & Reset Sequence (0.75 - 1.0) ---
    else if (offset >= 0.75) {
        const p = (offset - 0.75) * 4; // Normalized 0-1 for this section
        
        if (p < 0.4) {
            // Wobble before fall
            const wobbleP = p / 0.4;
            group.current.rotation.z = Math.sin(wobbleP * 20) * 0.2;
        } else {
            // Falling down
            const fallP = (p - 0.4) / 0.6;
            group.current.position.y = -(fallP * fallP * 30);
            group.current.rotation.x += delta * 5;
            group.current.rotation.z += delta * 3;
        }
    }

    // Head following mouse subtly
    if (headRef.current && offset < 0.75) {
        const targetX = (state.mouse.x * Math.PI) / 10;
        const targetY = (state.mouse.y * Math.PI) / 10;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetY, 0.1);
    }
  });

  return (
    <group ref={group}>
      {/* HEAD - Matching the image provided */}
      <group ref={headRef} position={[0, 1.2, 0]}>
        {/* Main Head Casing */}
        <RoundedBox args={[1.4, 1.1, 0.8]} radius={0.3} smoothness={4} material={ceramicMaterial} />
        
        {/* Face Screen */}
        <group position={[0, 0, 0.35]}>
          <RoundedBox args={[1.1, 0.7, 0.1]} radius={0.15} smoothness={4} material={screenMaterial} />
          {/* Eyes */}
          <group position={[0, 0, 0.06]}>
             <Sphere args={[0.08, 16, 16]} position={[-0.25, 0.05, 0]} material={eyeMaterial} scale={[1.4, 1, 1]} />
             <Sphere args={[0.08, 16, 16]} position={[0.25, 0.05, 0]} material={eyeMaterial} scale={[1.4, 1, 1]} />
             {/* Mouth/Smile */}
             <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI]}>
               <torusGeometry args={[0.1, 0.02, 16, 32, Math.PI / 2]} />
               <meshStandardMaterial color="#00F2FF" emissive="#00F2FF" emissiveIntensity={2} />
             </mesh>
          </group>
        </group>
        
        {/* Ears/Side Details */}
        <Cylinder args={[0.2, 0.2, 0.2]} rotation={[0, 0, Math.PI / 2]} position={[-0.7, 0, 0]} material={ceramicMaterial} />
        <Cylinder args={[0.2, 0.2, 0.2]} rotation={[0, 0, Math.PI / 2]} position={[0.7, 0, 0]} material={ceramicMaterial} />
      </group>

      {/* BODY */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        <Sphere args={[0.7, 32, 32]} material={ceramicMaterial} scale={[1, 1.1, 0.8]} />
        {/* Chest Line */}
        <mesh position={[0, -0.1, 0.55]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.6, 0.02]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      </group>

      {/* ARMS */}
      <group position={[-0.8, 0.2, 0]} ref={leftArmRef}>
        <RoundedBox args={[0.3, 0.8, 0.3]} radius={0.15} position={[0, -0.3, 0]} material={ceramicMaterial} />
      </group>
      <group position={[0.8, 0.2, 0]} ref={rightArmRef}>
        <RoundedBox args={[0.3, 0.8, 0.3]} radius={0.15} position={[0, -0.3, 0]} material={ceramicMaterial} />
      </group>
    </group>
  );
}

function Cylinder(props: any) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={props.args} />
      {props.material && <primitive object={props.material} attach="material" />}
    </mesh>
  );
}
