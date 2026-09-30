import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Palette = { primary: string; secondary: string; metal: string };

function Sculpture({ colors, reducedMotion }: { colors: Palette; reducedMotion: boolean }) {
  const core = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const dots = useMemo(() => {
    const positions = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      const angle = i * 2.399963;
      const radius = 2.2 + (i % 9) * 0.19;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.75;
      positions[i * 3 + 2] = Math.sin(i * 1.71) * 1.15;
    }
    return positions;
  }, []);

  useFrame((state, rawDelta) => {
    if (reducedMotion) return;
    const dt = Math.min(rawDelta, 0.05);
    if (core.current) {
      core.current.rotation.y += dt * 0.16;
      core.current.rotation.x += dt * 0.06;
    }
    if (outer.current) {
      outer.current.rotation.z -= dt * 0.055;
      outer.current.rotation.y += dt * 0.035;
      outer.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 4, 5]} color={colors.primary} intensity={25} />
      <pointLight position={[-4, -2, 2]} color={colors.secondary} intensity={15} />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} color={colors.secondary} position={[-5, 0, 1]} scale={[3, 8, 1]} />
      </Environment>

      <group ref={outer} rotation={[0.28, -0.2, -0.28]}>
        <mesh rotation={[0.38, 0.2, 0.1]}>
          <torusGeometry args={[2.25, 0.012, 6, 180]} />
          <meshBasicMaterial color={colors.primary} transparent opacity={0.58} />
        </mesh>
        <mesh rotation={[1.17, 0.42, 0.3]}>
          <torusGeometry args={[2.7, 0.009, 6, 180]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[0.5, 1.2, 0.8]}>
          <torusGeometry args={[1.83, 0.008, 6, 180]} />
          <meshBasicMaterial color={colors.metal} transparent opacity={0.35} />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dots, 3]} />
          </bufferGeometry>
          <pointsMaterial color={colors.secondary} size={0.025} transparent opacity={0.7} sizeAttenuation />
        </points>
      </group>

      <group ref={core} rotation={[0.3, 0.4, 0.12]}>
        <mesh>
          <icosahedronGeometry args={[1.33, 2]} />
          <meshPhysicalMaterial color={colors.metal} metalness={0.8} roughness={0.28} flatShading transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh scale={1.01}>
          <icosahedronGeometry args={[1.33, 2]} />
          <meshBasicMaterial color={colors.primary} wireframe transparent opacity={0.65} />
        </mesh>
        <mesh rotation={[0.3, 0.4, 0]}>
          <icosahedronGeometry args={[0.73, 1]} />
          <meshPhysicalMaterial color={colors.secondary} metalness={0.65} roughness={0.2} flatShading />
        </mesh>
      </group>
    </>
  );
}

export function HeroScene() {
  const [colors, setColors] = useState<Palette | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    setColors({
      primary: styles.getPropertyValue("--scene-primary").trim(),
      secondary: styles.getPropertyValue("--scene-secondary").trim(),
      metal: styles.getPropertyValue("--scene-metal").trim(),
    });
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div aria-hidden="true" className="hero-scene pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[59%]">
      {colors && (
        <Canvas camera={{ position: [0, 0, 8.5], fov: 48 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} frameloop={reducedMotion ? "demand" : "always"}>
          <Sculpture colors={colors} reducedMotion={reducedMotion} />
        </Canvas>
      )}
    </div>
  );
}