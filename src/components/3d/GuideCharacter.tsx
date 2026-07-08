import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface GuideCharacterProps {
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

export const GuideCharacter = ({ progressRef }: GuideCharacterProps) => {
  const outerGroupRef = useRef<THREE.Group>(null)
  const characterRef = useRef<THREE.Group>(null)
  
  const headRef = useRef<THREE.Mesh>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftFootRef = useRef<THREE.Mesh>(null)
  const rightFootRef = useRef<THREE.Mesh>(null)
  
  const { camera } = useThree()

  // Generate 40 background depth stars (same design as glyph for vertical space)
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

  // Blinking timer state
  const lastBlink = useRef(0)
  const blinkDuration = 0.12 // seconds
  const [blinkScaleY, setBlinkScaleY] = useState(1.0)

  useFrame((state) => {
    const { clock } = state
    const elapsed = clock.getElapsedTime()
    const targetParams = progressRef.current
    const p = targetParams.progress

    // --- Blinking Logic ---
    const timeSinceBlink = elapsed - lastBlink.current
    if (timeSinceBlink > 3.5) { // Blink every 3.5 seconds
      if (timeSinceBlink < 3.5 + blinkDuration) {
        setBlinkScaleY(0.1) // Closed eye
      } else {
        setBlinkScaleY(1.0) // Open eye
        lastBlink.current = elapsed
      }
    }

    if (leftEyeRef.current) leftEyeRef.current.scale.y = blinkScaleY
    if (rightEyeRef.current) rightEyeRef.current.scale.y = blinkScaleY

    // --- Character Posture/Movement States based on progress (p) ---
    // Target position, rotation and limb poses
    let targetX = 0.0
    let targetY = 0.0
    let targetZ = 0.0
    let targetRotY = 0.0
    let targetRotX = 0.0
    
    // Arm rotation targets
    let leftArmRotZ = -0.5
    let leftArmRotX = 0.0
    let rightArmRotZ = 0.5
    let rightArmRotX = 0.0

    // Foot positions/rotations
    let leftFootY = -0.6
    let rightFootY = -0.6

    // Gentle breathing floating oscillation
    const breathingOffset = Math.sin(elapsed * 2.5) * 0.05
    targetY += breathingOffset

    if (p <= 0.2) {
      // --- Hero State: Greeting wave ---
      targetX = 0.0
      targetRotY = Math.sin(elapsed * 0.5) * 0.15 // Gentle scanning rotation
      
      // Wave left arm
      leftArmRotZ = Math.sin(elapsed * 8) * 0.35 + 1.2
      leftArmRotX = 0.2
      
      // Keep right arm relaxed
      rightArmRotZ = 0.4
      rightArmRotX = 0.0
    }
    else if (p <= 1.0) {
      // --- About State: Float & Introduce ---
      // Transitioning posture
      const factor = (p - 0.2) / 0.8
      targetRotY = -0.2 * factor
      targetRotX = 0.08 * factor // Lean forward slightly as if walking
      
      // Arms swing back and forth as if floating/walking
      leftArmRotX = Math.sin(elapsed * 6) * 0.4
      leftArmRotZ = -0.3
      rightArmRotX = -Math.sin(elapsed * 6) * 0.4
      rightArmRotZ = 0.3

      // Stumpy legs moving slightly
      leftFootY = -0.6 + Math.sin(elapsed * 6) * 0.06
      rightFootY = -0.6 - Math.sin(elapsed * 6) * 0.06
    }
    else if (p <= 1.8) {
      // --- Projects State: Pointing to project cards ---
      // We point depending on which slide (Chapter 1, 2, 3) we are in
      if (p <= 1.2) {
        // Slide 1 (Text left): point left (raise right arm)
        targetRotY = -0.6 // Look left
        rightArmRotZ = -1.35 // Point straight left
        rightArmRotX = 0.0
        leftArmRotZ = -0.2
      } 
      else if (p <= 1.6) {
        // Slide 2 (Text right): point right (raise left arm)
        targetRotY = 0.6 // Look right
        leftArmRotZ = 1.35 // Point straight right
        leftArmRotX = 0.0
        rightArmRotZ = 0.2
      } 
      else {
        // Slide 3 (Text left): point left
        targetRotY = -0.6
        rightArmRotZ = -1.35
        rightArmRotX = 0.0
        leftArmRotZ = -0.2
      }
    } 
    else if (p <= 2.2) {
      // --- Experience State: Leaning/Sustaining ---
      targetRotX = -0.12 // Lean back slightly as if relaxing
      targetRotY = -0.15
      
      // Arms resting down
      leftArmRotZ = -0.15
      rightArmRotZ = 0.15
    } 
    else {
      // --- Contact State: Double hand waving goodbye ---
      targetRotY = Math.sin(elapsed * 0.5) * 0.1
      leftArmRotZ = Math.sin(elapsed * 12) * 0.3 + 1.2
      rightArmRotZ = -Math.sin(elapsed * 12) * 0.3 - 1.2
    }

    // --- Apply Smooth Interpolations (Lerp) to Meshes ---
    if (characterRef.current) {
      characterRef.current.position.y = THREE.MathUtils.lerp(characterRef.current.position.y, targetY, 0.08)
      characterRef.current.position.x = THREE.MathUtils.lerp(characterRef.current.position.x, targetX, 0.08)
      characterRef.current.position.z = THREE.MathUtils.lerp(characterRef.current.position.z, targetZ, 0.08)
      
      characterRef.current.rotation.y = THREE.MathUtils.lerp(characterRef.current.rotation.y, targetRotY, 0.08)
      characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, targetRotX, 0.08)
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, leftArmRotZ, 0.1)
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, leftArmRotX, 0.1)
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, rightArmRotZ, 0.1)
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rightArmRotX, 0.1)
    }

    if (leftFootRef.current) leftFootRef.current.position.y = THREE.MathUtils.lerp(leftFootRef.current.position.y, leftFootY, 0.1)
    if (rightFootRef.current) rightFootRef.current.position.y = THREE.MathUtils.lerp(rightFootRef.current.position.y, rightFootY, 0.1)

    // --- Camera position interpolations matching current section scroll ---
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetParams.cameraX, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetParams.cameraY, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetParams.cameraZ, 0.06)
  })

  // Material setup: clean, premium matte-pastel body combined with glowing neon cyan/white
  const bodyMaterial = (
    <meshPhysicalMaterial 
      color="#e4e4e7" // Light zinc/grey
      roughness={0.4}
      metalness={0.15}
      clearcoat={0.3}
      clearcoatRoughness={0.2}
    />
  )

  const darkMaterial = (
    <meshStandardMaterial 
      color="#18181b" // Dark zinc/black accent
      roughness={0.6}
      metalness={0.2}
    />
  )

  const glowMaterial = (
    <meshStandardMaterial 
      color="#00f0ff"
      emissive="#00f0ff"
      emissiveIntensity={1.5}
    />
  )

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

      {/* Main Character Host */}
      <group ref={outerGroupRef} position={[0, 0, 0]}>
        <group ref={characterRef}>

          {/* CAPSULE BODY */}
          <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.32, 0.7, 16]} />
            {bodyMaterial}
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            {bodyMaterial}
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.32, 16, 16]} />
            {bodyMaterial}
          </mesh>

          {/* HEAD */}
          <group ref={headRef} position={[0, 0.65, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.36, 20, 20]} />
              {bodyMaterial}
            </mesh>

            {/* SLEEK GLASS/GLOWING MASK FACEPLATE */}
            <mesh position={[0, 0, 0.28]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[0.42, 0.22, 0.08]} />
              {darkMaterial}
            </mesh>

            {/* GLOWING CYAN BLINKING EYES */}
            <mesh ref={leftEyeRef} position={[-0.11, 0, 0.32]}>
              <sphereGeometry args={[0.038, 12, 12]} />
              {glowMaterial}
            </mesh>
            <mesh ref={rightEyeRef} position={[0.11, 0, 0.32]}>
              <sphereGeometry args={[0.038, 12, 12]} />
              {glowMaterial}
            </mesh>

            {/* NEON GLOWING HALO (Floating futuristic tour host detail) */}
            <mesh position={[0, 0.52, -0.05]} rotation={[Math.PI / 2 + 0.15, 0, 0]}>
              <torusGeometry args={[0.22, 0.018, 8, 24]} />
              {glowMaterial}
            </mesh>
          </group>

          {/* LEFT ARM (Floating side shoulder + arm capsule) */}
          <group ref={leftArmRef} position={[-0.45, 0.1, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.075, 0.065, 0.32, 8]} />
              {bodyMaterial}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              {bodyMaterial}
            </mesh>
            {/* Hand sphere */}
            <mesh position={[0, -0.32, 0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              {glowMaterial}
            </mesh>
          </group>

          {/* RIGHT ARM (Floating side shoulder + arm capsule) */}
          <group ref={rightArmRef} position={[0.45, 0.1, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.075, 0.065, 0.32, 8]} />
              {bodyMaterial}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              {bodyMaterial}
            </mesh>
            {/* Hand sphere */}
            <mesh position={[0, -0.32, 0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              {glowMaterial}
            </mesh>
          </group>

          {/* STUMPY LEGS/FEET */}
          <mesh ref={leftFootRef} position={[-0.14, -0.6, 0.02]} castShadow>
            <sphereGeometry args={[0.095, 12, 12]} />
            {darkMaterial}
          </mesh>
          <mesh ref={rightFootRef} position={[0.14, -0.6, 0.02]} castShadow>
            <sphereGeometry args={[0.095, 12, 12]} />
            {darkMaterial}
          </mesh>

        </group>
      </group>
    </>
  )
}
export default GuideCharacter
