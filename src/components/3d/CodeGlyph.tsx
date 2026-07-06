import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center, MeshTransmissionMaterial } from '@react-three/drei'
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
    rotationY?: number
  }>
}

export const CodeGlyph = ({ progressRef }: CodeGlyphProps) => {
  const outerGroupRef = useRef<THREE.Group>(null)
  const innerGroupRef = useRef<THREE.Group>(null)
  
  const leftBracketRef = useRef<THREE.Group>(null)
  const slashRef = useRef<THREE.Group>(null)
  const rightBracketRef = useRef<THREE.Group>(null)
  
  const { camera } = useThree()

  // Generate 40 tiny sparse star meshes for background depth
  const stars = useMemo(() => {
    const arr = []
    const count = 40
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 8 - 4
      const scale = Math.random() * 0.4 + 0.6
      const opacity = Math.random() * 0.25 + 0.05
      arr.push({ position: [x, y, z] as [number, number, number], scale, opacity })
    }
    return arr
  }, [])

  // Ref to track split progress smoothly
  const currentSplit = useRef(0.0)

  useFrame((state) => {
    const { clock } = state
    const elapsed = clock.getElapsedTime()
    const targetParams = progressRef.current
    const p = targetParams.progress

    // Calculate dynamic split target based on the scroll progress
    let targetSplit = 0.0
    if (p <= 0.2) {
      targetSplit = 0.0
    } else if (p <= 1.0) {
      targetSplit = 0.15 * ((p - 0.2) / 0.8)
    } else if (p <= 1.2) {
      targetSplit = 0.15 + 0.65 * ((p - 1.0) / 0.2)
    } else if (p <= 1.6) {
      targetSplit = 0.8 + 0.3 * ((p - 1.2) / 0.4)
    } else if (p <= 1.9) {
      targetSplit = 1.1 - 0.3 * ((p - 1.6) / 0.3)
    } else if (p <= 2.2) {
      targetSplit = 0.8 - 0.5 * ((p - 1.9) / 0.3)
    } else {
      targetSplit = 0.3
    }

    // Smoothly interpolate the split factor
    currentSplit.current = THREE.MathUtils.lerp(currentSplit.current, targetSplit, 0.08)
    const split = currentSplit.current

    // Translate left and right brackets, push slash backwards
    if (leftBracketRef.current) {
      leftBracketRef.current.position.x = -0.85 - split * 1.5
      leftBracketRef.current.position.y = split * 0.1
      leftBracketRef.current.position.z = -split * 0.2
    }
    if (rightBracketRef.current) {
      rightBracketRef.current.position.x = 0.85 + split * 1.5
      rightBracketRef.current.position.y = -split * 0.1
      rightBracketRef.current.position.z = -split * 0.2
    }
    if (slashRef.current) {
      slashRef.current.position.z = -split * 1.8
      slashRef.current.position.y = -split * 0.3
    }

    // 1. GSAP-driven outer group animation (strictly rotation.y and position/camera)
    if (outerGroupRef.current) {
      const targetRotY = targetParams.rotationY ?? 0.0
      outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        outerGroupRef.current.rotation.y,
        targetRotY,
        0.08
      )
    }

    // 2. Separate inner group for slow at-rest continuous rotation (no property conflicts)
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.y = elapsed * 0.08
      // Gentle floating motion
      innerGroupRef.current.position.y = Math.sin(elapsed * 0.6) * 0.06
    }

    // 3. Interpolate camera view matching current section
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetParams.cameraX, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetParams.cameraY, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetParams.cameraZ, 0.06)
  })

  // Conservative MeshTransmissionMaterial settings for premium visual and performance stability
  const glassParams = {
    backside: true,
    backsideThickness: 0.15,
    thickness: 0.5,
    roughness: 0.1,
    transmission: 0.98,
    ior: 1.45,
    chromaticAberration: 0.02,
    anisotropy: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    distortion: 0.0,
    distortionScale: 0.0,
    temporalDistortion: 0.0
  }

  const fontPath = "/helvetiker_regular.typeface.json"

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

      {/* Main Developer Glyph Groups */}
      <group ref={outerGroupRef} position={[0, 0, 0]}>
        <group ref={innerGroupRef}>

          {/* LEFT BRACKET "<" (Glass) */}
          <group ref={leftBracketRef}>
            <Center>
              <Text3D
                font={fontPath}
                size={1.3}
                height={0.16}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.012}
                bevelOffset={0}
                bevelSegments={5}
              >
                {"<"}
                <MeshTransmissionMaterial {...glassParams} />
              </Text3D>
            </Center>
          </group>

          {/* CENTER SLASH "/" (Brushed Titanium) */}
          <group ref={slashRef}>
            <Center>
              <Text3D
                font={fontPath}
                size={1.3}
                height={0.14}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.012}
                bevelOffset={0}
                bevelSegments={5}
              >
                {"/"}
                <meshPhysicalMaterial 
                  color="#262a33" 
                  metalness={0.92} 
                  roughness={0.15} 
                  clearcoat={1.0}
                  clearcoatRoughness={0.1}
                />
              </Text3D>
            </Center>
          </group>

          {/* RIGHT BRACKET ">" (Glass) */}
          <group ref={rightBracketRef}>
            <Center>
              <Text3D
                font={fontPath}
                size={1.3}
                height={0.16}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.012}
                bevelOffset={0}
                bevelSegments={5}
              >
                {">"}
                <MeshTransmissionMaterial {...glassParams} />
              </Text3D>
            </Center>
          </group>

        </group>
      </group>
    </>
  )
}
export default CodeGlyph
