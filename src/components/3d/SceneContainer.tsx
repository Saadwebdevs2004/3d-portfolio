import { Canvas } from '@react-three/fiber'
import { MorphingParticles } from './MorphingParticles'

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
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <MorphingParticles progressRef={progressRef} />
      </Canvas>
    </div>
  )
}
export default SceneContainer
