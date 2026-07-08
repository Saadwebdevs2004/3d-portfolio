import { Canvas } from '@react-three/fiber'
import { GuideCharacter } from './GuideCharacter'
import { Environment, ContactShadows } from '@react-three/drei'

interface SceneContainerProps {
  progressRef: React.MutableRefObject<{
    progress: number
    cameraX: number
    cameraY: number
    cameraZ: number
    noiseStrength: number
    rotationSpeed: number
    color1: string
    color2: string
  }>
}

export const SceneContainer = ({ progressRef }: SceneContainerProps) => {
  const isLowEndOrRetina = typeof window !== 'undefined' && 
    (window.devicePixelRatio > 1.5 || window.innerWidth < 768)

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: !isLowEndOrRetina, 
          alpha: true, 
          powerPreference: "high-performance" 
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        {/* Three-point Studio Lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Key Light (Upper Left) */}
        <directionalLight 
          position={[-6, 6, 6]} 
          intensity={2.8} 
        />
        
        {/* Fill Light (Soft Right) */}
        <directionalLight 
          position={[6, 2, 4]} 
          intensity={0.8} 
        />
        
        {/* Rim Light (Behind, creates glowing highlights on glass edges) */}
        <directionalLight 
          position={[0, 4, -8]} 
          intensity={3.2} 
        />

        <GuideCharacter progressRef={progressRef} />

        {/* Soft Contact Shadows below the Glyph */}
        <ContactShadows 
          position={[0, -2.1, 0]} 
          opacity={0.45} 
          scale={7} 
          blur={2.4} 
          far={3.5} 
        />

        {/* Studio environment preset for realistic glass/metal reflections */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
export default SceneContainer
