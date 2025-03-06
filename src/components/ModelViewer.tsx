import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} />;
}

export const ModelViewer = ({ url }: { url: string }) => {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "400px" }}>
      <Canvas>
        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5}>
            <Model url={url} />
          </Stage>
          <OrbitControls autoRotate enableZoom={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};
