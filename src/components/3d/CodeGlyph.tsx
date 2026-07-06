import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface CodeGlyphProps {
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

export const CodeGlyph = ({ progressRef }: CodeGlyphProps) => {
  const glyphGroupRef = useRef<THREE.Group>(null)
  const leftBracketRef = useRef<THREE.Group>(null)
  const slashRef = useRef<THREE.Mesh>(null)
  const rightBracketRef = useRef<THREE.Group>(null)
  
  const { camera } = useThree()

  // Generate 40 tiny sparse star meshes for background depth
  const stars = useMemo(() => {
    const arr = []
    const count = 40
    for (let i = 0; i < count; i++) {
      // Positioned far behind the glyph to act as subtle decor
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 8 - 4
      const scale = Math.random() * 0.4 + 0.6
      const opacity = Math.random() * 0.25 + 0.05
      arr.push({ position: [x, y, z] as [number, number, number], scale, opacity })
    }
    return arr
  }, [])

  // Create state variables for smooth lerping
  const currentSplit = useRef(0.0)

  useFrame((state) => {
    const { clock } = state
    const elapsed = clock.getElapsedTime()
    const targetParams = progressRef.current
    const p = targetParams.progress

    // Calculate dynamic split target based on the scroll progress
    let targetSplit = 0.0
    if (p <= 0.2) {
      // Hero / Contact: fully assembled
      targetSplit = 0.0
    } else if (p <= 1.0) {
      // About: gradual, subtle breathing split
      targetSplit = 0.15 * ((p - 0.2) / 0.8)
    } else if (p <= 1.2) {
      // Transition to Project 1: open up wide
      targetSplit = 0.15 + 0.65 * ((p - 1.0) / 0.2)
    } else if (p <= 1.6) {
      // Project 2: hold wider split
      targetSplit = 0.8 + 0.3 * ((p - 1.2) / 0.4)
    } else if (p <= 1.9) {
      // Project 3: slightly narrow back
      targetSplit = 1.1 - 0.3 * ((p - 1.6) / 0.3)
    } else if (p <= 2.2) {
      // Experience: reassembling
      targetSplit = 0.8 - 0.5 * ((p - 1.9) / 0.3)
    } else {
      targetSplit = 0.3
    }

    // Smoothly interpolate the split factor
    currentSplit.current = THREE.MathUtils.lerp(currentSplit.current, targetSplit, 0.08)
    const split = currentSplit.current

    // 1. Position/Animate Left Bracket Group "<"
    if (leftBracketRef.current) {
      leftBracketRef.current.position.x = -1.25 - split * 1.6
      leftBracketRef.current.position.y = split * 0.2
      leftBracketRef.current.position.z = -split * 0.3
      // Add subtle rotation response
      leftBracketRef.current.rotation.y = split * 0.5
      leftBracketRef.current.rotation.z = split * 0.1
    }

    // 2. Position/Animate Right Bracket Group ">"
    if (rightBracketRef.current) {
      rightBracketRef.current.position.x = 1.25 + split * 1.6
      rightBracketRef.current.position.y = -split * 0.2
      rightBracketRef.current.position.z = -split * 0.3
      // Mirror the rotation
      rightBracketRef.current.rotation.y = -split * 0.5
      rightBracketRef.current.rotation.z = -split * 0.1
    }

    // 3. Position/Animate Slash "/"
    if (slashRef.current) {
      // Slash sinks backwards and rotates slightly
      slashRef.current.position.z = -split * 1.8
      slashRef.current.position.y = -split * 0.4
      slashRef.current.rotation.x = split * 0.3
      slashRef.current.rotation.y = Math.PI / 10 + split * 0.6
    }

    // 4. Global Glyphs group rotations
    if (glyphGroupRef.current) {
      // Slow auto rotation on Y axis + scroll tilt
      glyphGroupRef.current.rotation.y = elapsed * 0.08
      glyphGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        glyphGroupRef.current.rotation.x,
        split * 0.2 + Math.sin(elapsed * 0.5) * 0.03, // Add subtle floating breath
        0.05
      )
      glyphGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        glyphGroupRef.current.rotation.z,
        Math.cos(elapsed * 0.3) * 0.02,
        0.05
      )
    }

    // 5. Interpolate camera view matching current section
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetParams.cameraX, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetParams.cameraY, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetParams.cameraZ, 0.06)
  })

  // Glass MeshTransmissionMaterial parameters for premium look
  const glassParams = {
    backside: true,
    backsideThickness: 0.15,
    thickness: 0.45,
    roughness: 0.03,
    transmission: 0.98,
    ior: 1.45,
    chromaticAberration: 0.04,
    anisotropy: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    distortion: 0.05,
    distortionScale: 0.2,
    temporalDistortion: 0.0
  }

  return (
    <>
      {/* Background stars */}
      <group>
        {stars.map((star, i) => (
          <mesh key={i} position={star.position}>
            <sphereGeometry args={[0.014, 5, 5]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={star.opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Main Developer Glyph Group */}
      <group ref={glyphGroupRef} position={[0, 0, 0]}>
        
        {/* LEFT BRACKET "<" */}
        <group ref={leftBracketRef}>
          {/* Upper Rod */}
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <capsuleGeometry args={[0.085, 0.85, 8, 16]} />
            <MeshTransmissionMaterial {...glassParams} />
          </mesh>
          {/* Lower Rod */}
          <mesh position={[0, -0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
            <capsuleGeometry args={[0.085, 0.85, 8, 16]} />
            <MeshTransmissionMaterial {...glassParams} />
          </mesh>
        </group>

        {/* CENTER SLASH "/" (Brushed Metal) */}
        <mesh ref={slashRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 10]}>
          <capsuleGeometry args={[0.075, 1.85, 8, 16]} />
          <meshPhysicalMaterial 
            color="#2a2e38" 
            metalness={0.95} 
            roughness={0.12} 
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* RIGHT BRACKET ">" */}
        <group ref={rightBracketRef}>
          {/* Upper Rod */}
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
            <capsuleGeometry args={[0.085, 0.85, 8, 16]} />
            <MeshTransmissionMaterial {...glassParams} />
          </mesh>
          {/* Lower Rod */}
          <mesh position={[0, -0.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <capsuleGeometry args={[0.085, 0.85, 8, 16]} />
            <MeshTransmissionMaterial {...glassParams} />
          </mesh>
        </group>

      </group>
    </>
  )
}
export default CodeGlyph
