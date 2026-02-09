import { Canvas } from "@react-three/fiber";
import { Environment, ScrollControls, Scroll, Stars } from "@react-three/drei";
import { Robot } from "./Robot";
import Hero from "../sections/Hero";
import RobotIntro from "../sections/RobotIntro";
import Features from "../sections/Features";
import ChatInterface from "../sections/ChatInterface";

export default function Scene() {
  return (
    <div className="h-screen w-full bg-background">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
        <color attach="background" args={["#050505"]} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} color="#00F2FF" castShadow />
        <pointLight position={[-10, -10, -10]} intensity={50} color="#FF00E5" />
        <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        <ScrollControls pages={4} damping={0.2}>
          {/* 3D Content tied to scroll */}
          <Robot />

          {/* DOM Overlay Content */}
          <Scroll html style={{ width: "100%" }}>
             <Hero />
             <RobotIntro />
             <Features />
             <ChatInterface />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
