import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { gsap } from 'gsap'

interface LaptopProps {
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

export const Laptop = ({ progressRef }: LaptopProps) => {
  const laptopGroupRef = useRef<THREE.Group>(null)
  const hingeGroupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // 1. Offscreen Canvas for Screen Texture content
  const canvasSize = { width: 512, height: 352 }
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = canvasSize.width
    c.height = canvasSize.height
    return c
  }, [])

  const ctx = useMemo(() => {
    return canvas.getContext('2d')
  }, [canvas])

  // 2. Three.js Canvas Texture
  const screenTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    return texture
  }, [canvas])

  // 3. Keep a local interpolated progress value for smooth screen crossfades
  const animatedProgress = useRef(0.0)

  // 4. GSAP Screen Opening Animation on Mount
  useEffect(() => {
    if (hingeGroupRef.current) {
      // Set initial closed angle: screen flat on base facing down (Math.PI / 2)
      hingeGroupRef.current.rotation.x = Math.PI / 2

      // Animate opening rotation: eased up to tilt back slightly (-0.2 radians)
      gsap.to(hingeGroupRef.current.rotation, {
        x: -0.2,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.4
      })
    }
  }, [])

  // 5. Draw Loop & Animations inside useFrame
  useFrame((state) => {
    const { clock } = state
    const elapsed = clock.getElapsedTime()
    const targetParams = progressRef.current

    // Lerp progress value for smooth content transitions
    animatedProgress.current = THREE.MathUtils.lerp(
      animatedProgress.current,
      targetParams.progress,
      0.08
    )

    // Draw stylized desktop contents onto the canvas
    if (ctx) {
      drawScreen(ctx, canvasSize.width, canvasSize.height, animatedProgress.current, elapsed)
      screenTexture.needsUpdate = true
    }

    // Lerp Laptop Group Y-rotation driven by ScrollTrigger progressRef.current.rotationY
    if (laptopGroupRef.current) {
      const targetRotY = targetParams.rotationY ?? 0.0
      laptopGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        laptopGroupRef.current.rotation.y,
        targetRotY,
        0.06
      )

      // Add gentle idle bobbing and slight roll
      laptopGroupRef.current.position.y = Math.sin(elapsed * 1.8) * 0.08
      laptopGroupRef.current.rotation.z = Math.sin(elapsed * 1.2) * 0.015
    }

    // Camera position interpolation based on section transitions
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetParams.cameraX, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetParams.cameraY, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetParams.cameraZ, 0.06)
  })

  // 6. Materials
  // Premium Matte Metal body
  const bodyMaterial = (
    <meshPhysicalMaterial
      color="#e5e0d8" // Warm silver/platinum finish
      metalness={0.65}
      roughness={0.28}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
    />
  )

  // Screen Bezel (Dark plastic/metal)
  const bezelMaterial = (
    <meshStandardMaterial
      color="#1A1A2E"
      roughness={0.5}
      metalness={0.2}
    />
  )

  // Glowing Screen Texture
  const screenMaterial = (
    <meshBasicMaterial
      map={screenTexture}
      toneMapped={false}
    />
  )

  return (
    <group ref={laptopGroupRef} position={[0, -0.6, 0]}>
      {/* LAPTOP BASE */}
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <RoundedBox args={[3.2, 0.1, 2.2]} radius={0.04} smoothness={4}>
          {bodyMaterial}
        </RoundedBox>
      </mesh>

      {/* KEYBOARD INNER DEPTH (Stylized dark indentation) */}
      <mesh position={[0, 0.005, 0.1]}>
        <boxGeometry args={[2.8, 0.01, 1.1]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.6} />
      </mesh>

      {/* TRACKPAD OUTLINE */}
      <mesh position={[0, 0.005, 0.8]}>
        <boxGeometry args={[0.9, 0.01, 0.45]} />
        <meshStandardMaterial color="#d4cece" roughness={0.4} />
      </mesh>

      {/* HINGE AXIS & SCREEN LID GROUP */}
      <group ref={hingeGroupRef} position={[0, 0.05, -1.1]}>
        
        {/* Hinge bar */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.6, 12]} />
          <meshStandardMaterial color="#3A3A4E" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* SCREEN LID FRAME */}
        <mesh position={[0, 1.1, 0.04]} castShadow>
          <RoundedBox args={[3.2, 2.2, 0.08]} radius={0.04} smoothness={4}>
            {bodyMaterial}
          </RoundedBox>
        </mesh>

        {/* SCREEN INNER BEZEL */}
        <mesh position={[0, 1.1, 0.075]}>
          <boxGeometry args={[3.12, 2.12, 0.012]} />
          {bezelMaterial}
        </mesh>

        {/* GLOWING DISPLAY */}
        <mesh position={[0, 1.1, 0.082]}>
          <planeGeometry args={[2.98, 1.98]} />
          {screenMaterial}
        </mesh>
      </group>
    </group>
  )
}

// 7. Offscreen Canvas Screen Layout Drawing Function
const drawScreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  elapsed: number
) => {
  // Base backdrop animation gradient
  const grad = ctx.createLinearGradient(0, 0, width, height)
  const t = elapsed * 0.4
  
  // Choose gradient colors depending on active scroll section
  let color1 = `hsl(${(200 + Math.sin(t) * 30) % 360}, 75%, 90%)`
  let color2 = `hsl(${(280 + Math.cos(t) * 30) % 360}, 80%, 90%)`
  
  if (progress > 2.5) {
    // Contact: Warm Coral-Red gradient glow
    color1 = `hsl(${(15 + Math.sin(t) * 15) % 360}, 85%, 92%)`
    color2 = `hsl(${(340 + Math.cos(t) * 15) % 360}, 80%, 90%)`
  } else if (progress > 1.85 && progress <= 2.5) {
    // Experience: Sky-Teal gradient glow
    color1 = `hsl(${(160 + Math.sin(t) * 20) % 360}, 70%, 90%)`
    color2 = `hsl(${(220 + Math.cos(t) * 20) % 360}, 75%, 90%)`
  }

  grad.addColorStop(0, color1)
  grad.addColorStop(1, color2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Top Window Controls
  ctx.fillStyle = '#ff5f56'
  ctx.beginPath(); ctx.arc(20, 20, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffbd2e'
  ctx.beginPath(); ctx.arc(36, 20, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#27c93f'
  ctx.beginPath(); ctx.arc(52, 20, 5, 0, Math.PI * 2); ctx.fill()

  // Draw content depending on interpolated progress section
  if (progress < 0.5) {
    // --- HERO: Stylized Code Editor ---
    ctx.fillStyle = 'rgba(26, 26, 46, 0.05)'
    ctx.fillRect(10, 40, 90, height - 55)

    // Sidebar lines
    ctx.fillStyle = 'rgba(26, 26, 46, 0.15)'
    ctx.fillRect(20, 60, 70, 8)
    ctx.fillRect(20, 76, 50, 8)
    ctx.fillRect(20, 92, 60, 8)
    ctx.fillRect(20, 108, 40, 8)

    // Main editor panel syntax highlighted lines
    const startX = 125
    let startY = 60
    const codeLines = [
      { indent: 0, col: '#FF6B4A', len: 70 },
      { indent: 1, col: '#9D8DF1', len: 140 },
      { indent: 2, col: '#4ECDC4', len: 100 },
      { indent: 2, col: '#FFC93C', len: 180 },
      { indent: 2, col: '#4ECDC4', len: 150 },
      { indent: 1, col: '#9D8DF1', len: 90 },
      { indent: 0, col: '#FF6B4A', len: 50 },
    ]

    codeLines.forEach((line) => {
      ctx.fillStyle = line.col
      ctx.fillRect(startX + line.indent * 18, startY, line.len, 9)
      startY += 20
    })

    // Blinking cursor
    if (Math.floor(elapsed * 2.5) % 2 === 0) {
      ctx.fillStyle = '#1A1A2E'
      ctx.fillRect(startX + 55, startY, 7, 9)
    }

  } else if (progress < 1.05) {
    // --- ABOUT: User Profile Dashboard ---
    // Avatar outline
    ctx.fillStyle = '#FF6B4A'
    ctx.beginPath(); ctx.arc(75, 95, 30, 0, Math.PI * 2); ctx.fill()

    // Dashboard title
    ctx.fillStyle = '#1A1A2E'
    ctx.fillRect(130, 75, 140, 12)
    ctx.fillStyle = '#4A4A6A'
    ctx.fillRect(130, 95, 200, 7)
    ctx.fillRect(130, 110, 170, 7)

    // Performance bar chart indicators
    const skills = [
      { name: 'MERN Stack', color: '#9D8DF1', val: 0.85 },
      { name: 'TypeScript', color: '#4ECDC4', val: 0.8 },
      { name: 'SEO Strategy', color: '#FFC93C', val: 0.75 }
    ]

    let barY = 150
    skills.forEach((skill) => {
      ctx.fillStyle = '#1A1A2E'
      ctx.fillRect(40, barY, 80, 8)
      ctx.fillStyle = 'rgba(26, 26, 46, 0.08)'
      ctx.fillRect(145, barY - 2, 260, 12)
      ctx.fillStyle = skill.color
      ctx.fillRect(145, barY - 2, 260 * skill.val, 12)
      barY += 30
    })

  } else if (progress < 1.3) {
    // --- PROJECTS 1: Renovation-Connect ---
    ctx.fillStyle = '#9D8DF1'
    ctx.fillRect(40, 50, 200, 14)
    ctx.fillStyle = '#4A4A6A'
    ctx.fillRect(40, 74, 280, 8)

    // Wireframe layout
    ctx.fillStyle = 'rgba(26, 26, 46, 0.08)'
    ctx.fillRect(40, 105, 180, 110)
    ctx.fillRect(240, 105, 180, 110)

    ctx.fillStyle = '#FF6B4A'
    ctx.fillRect(55, 230, 130, 12)
    ctx.fillStyle = '#4ECDC4'
    ctx.fillRect(255, 230, 130, 12)

  } else if (progress < 1.65) {
    // --- PROJECTS 2: Weather Dashboard ---
    ctx.fillStyle = '#4ECDC4'
    ctx.fillRect(40, 50, 180, 14)

    // Rotating Sun graphic
    ctx.fillStyle = '#FFC93C'
    ctx.beginPath(); ctx.arc(120, 130, 25, 0, Math.PI * 2); ctx.fill()

    ctx.strokeStyle = '#FFC93C'
    ctx.lineWidth = 3.5
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + elapsed * 0.25
      ctx.beginPath()
      ctx.moveTo(120 + Math.cos(angle) * 32, 130 + Math.sin(angle) * 32)
      ctx.lineTo(120 + Math.cos(angle) * 42, 130 + Math.sin(angle) * 42)
      ctx.stroke()
    }

    // Weather data text bars
    ctx.fillStyle = '#1A1A2E'
    ctx.fillRect(190, 105, 80, 22)
    ctx.fillStyle = '#4A4A6A'
    ctx.fillRect(190, 140, 160, 8)
    ctx.fillRect(190, 155, 120, 8)

  } else if (progress < 1.95) {
    // --- PROJECTS 3: To-Do App ---
    ctx.fillStyle = '#9D8DF1'
    ctx.fillRect(40, 50, 140, 14)

    const list = [
      { ok: true, len: 140 },
      { ok: true, len: 180 },
      { ok: false, len: 110 },
      { ok: false, len: 160 }
    ]

    let itemY = 95
    list.forEach((item) => {
      // Checkbox
      ctx.fillStyle = item.ok ? '#4ECDC4' : 'rgba(26, 26, 46, 0.15)'
      ctx.fillRect(45, itemY, 14, 14)
      if (item.ok) {
        ctx.strokeStyle = '#FAF7F2'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(47, itemY + 7)
        ctx.lineTo(51, itemY + 11)
        ctx.lineTo(56, itemY + 3)
        ctx.stroke()
      }

      // Striking line or normal line
      ctx.fillStyle = item.ok ? 'rgba(26, 26, 46, 0.35)' : '#1A1A2E'
      ctx.fillRect(75, itemY + 3, item.len, 9)
      itemY += 30
    })

  } else if (progress < 2.5) {
    // --- EXPERIENCE: Timeline Graph ---
    ctx.fillStyle = '#4ECDC4'
    ctx.fillRect(40, 50, 240, 14)

    // Chart axes
    ctx.strokeStyle = '#1A1A2E'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(60, 240)
    ctx.lineTo(380, 240)
    ctx.moveTo(60, 90)
    ctx.lineTo(60, 240)
    ctx.stroke()

    // Pulsing career path graph lines
    ctx.strokeStyle = '#FF6B4A'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(60, 190 + Math.sin(elapsed + 0) * 12)
    for (let x = 60; x <= 380; x += 15) {
      const y = 170 + Math.sin(x * 0.04 + elapsed * 1.6) * 22
      ctx.lineTo(x, y)
    }
    ctx.stroke()

  } else {
    // --- CONTACT: Envelope Mailbox ---
    // Envelope body
    ctx.fillStyle = '#FF6B4A'
    ctx.fillRect(140, 90, 160, 100)

    // Folded flaps
    ctx.fillStyle = '#e85a37'
    ctx.beginPath()
    ctx.moveTo(140, 90)
    ctx.lineTo(220, 145)
    ctx.lineTo(300, 90)
    ctx.fill()

    // Title status
    ctx.fillStyle = '#1A1A2E'
    ctx.fillRect(140, 210, 160, 14)
    ctx.fillStyle = '#4A4A6A'
    ctx.fillRect(110, 235, 220, 8)
  }
}

export default Laptop
