import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface MorphingParticlesProps {
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

export const MorphingParticles = ({ progressRef }: MorphingParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size, mouse } = useThree()
  
  const count = 6000 // Dense particle count for premium look

  // Generate layouts for the morphing positions
  const { spherePositions, torusPositions, gridPositions } = useMemo(() => {
    const sphere = new Float32Array(count * 3)
    const torus = new Float32Array(count * 3)
    const grid = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // 1. Sphere positions (uniform distribution)
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 2.0
      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      sphere[i * 3 + 2] = r * Math.cos(phi)

      // 2. Torus Knot positions (p=2, q=3)
      const t = (i / count) * Math.PI * 2 * 3
      const p = 2
      const q = 3
      const rKnot = 0.6 * (2 + Math.sin(q * t))
      const tx = rKnot * Math.cos(p * t) * 0.9
      const ty = rKnot * Math.sin(p * t) * 0.9
      const tz = rKnot * Math.cos(q * t) * 0.9
      
      // Add random displacement to thick/volumize the knot
      const spread = 0.25
      torus[i * 3] = tx + (Math.random() - 0.5) * spread
      torus[i * 3 + 1] = ty + (Math.random() - 0.5) * spread
      torus[i * 3 + 2] = tz + (Math.random() - 0.5) * spread

      // 3. Grid / Wavy Plane positions
      const cols = Math.floor(Math.sqrt(count))
      const xIdx = i % cols
      const yIdx = Math.floor(i / cols)
      const gx = ((xIdx / cols) - 0.5) * 6.5
      const gy = ((yIdx / cols) - 0.5) * 6.5
      const gz = Math.sin(gx * 1.5) * Math.cos(gy * 1.5) * 0.4
      
      grid[i * 3] = gx
      grid[i * 3 + 1] = gy
      grid[i * 3 + 2] = gz
    }

    return {
      spherePositions: sphere,
      torusPositions: torus,
      gridPositions: grid
    }
  }, [])

  // Create customized shader uniforms
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uNoiseStrength: { value: 0.2 },
      uColor1: { value: new THREE.Color('#00f0ff') },
      uColor2: { value: new THREE.Color('#8b5cf6') },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMobile: { value: 0.0 }
    }
  }, [])

  // Check for mobile layout to adapt particle complexity/rendering
  useEffect(() => {
    if (materialRef.current) {
      const isMobile = window.innerWidth < 768
      materialRef.current.uniforms.uMobile.value = isMobile ? 1.0 : 0.0
    }
  }, [size])

  // Animate particles in R3F frame loop
  useFrame((state) => {
    const { clock, camera } = state
    const elapsed = clock.getElapsedTime()
    const targetParams = progressRef.current

    // Update uniform values from GSAP-controlled progressRef
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed
      
      // Interpolate progress & parameters
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uProgress.value,
        targetParams.progress,
        0.08
      )
      
      materialRef.current.uniforms.uNoiseStrength.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uNoiseStrength.value,
        targetParams.noiseStrength,
        0.08
      )

      // Smooth color transitions
      const c1 = materialRef.current.uniforms.uColor1.value
      const c2 = materialRef.current.uniforms.uColor2.value
      c1.lerp(new THREE.Color(targetParams.color1), 0.08)
      c2.lerp(new THREE.Color(targetParams.color2), 0.08)

      // Smooth mouse parallax in shader
      const targetMouseX = mouse.x * (window.innerWidth < 768 ? 0.1 : 0.6)
      const targetMouseY = mouse.y * (window.innerWidth < 768 ? 0.1 : 0.6)
      materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.x,
        targetMouseX,
        0.05
      )
      materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.y,
        targetMouseY,
        0.05
      )
    }

    // Slowly rotate the mesh
    if (pointsRef.current) {
      pointsRef.current.rotation.y += targetParams.rotationSpeed
      pointsRef.current.rotation.x = elapsed * 0.02
    }

    // Interpolate camera values smoothly
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetParams.cameraX, 0.08)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetParams.cameraY, 0.08)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetParams.cameraZ, 0.08)
  })

  // GLSL Shader code
  const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform float uNoiseStrength;
    uniform vec2 uMouse;
    uniform float uMobile;

    attribute vec3 aTorus;
    attribute vec3 aGrid;

    varying vec3 vPosition;
    varying float vProgress;

    // Simple pseudo-random 3D noise
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f*f*(3.0-2.0*f);
        float n = p.x + p.y*57.0 + 113.0*p.z;
        return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
                       mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
                   mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                       mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    }

    void main() {
        vec3 mixedPos = vec3(0.0);
        
        // Morph logic based on uProgress [0, 2]
        if (uProgress < 1.0) {
            mixedPos = mix(position, aTorus, uProgress);
        } else {
            mixedPos = mix(aTorus, aGrid, clamp(uProgress - 1.0, 0.0, 1.0));
        }
        
        // Vertex displacement noise
        vec3 dir = normalize(mixedPos);
        float n = noise(mixedPos * 1.2 + uTime * 0.35);
        mixedPos += dir * n * uNoiseStrength;
        
        // Add subtle mouse parallax (reduce on mobile)
        mixedPos.xy += uMouse * (uMobile > 0.5 ? 0.05 : 0.25);
        
        vec4 mvPosition = modelViewMatrix * vec4(mixedPos, 1.0);
        
        // Calculate point size + attenuation
        float baseSize = uMobile > 0.5 ? 7.0 : 13.0;
        gl_PointSize = (baseSize / -mvPosition.z) * (1.0 + n * 0.4);
        gl_Position = projectionMatrix * mvPosition;
        
        vPosition = mixedPos;
        vProgress = uProgress;
    }
  `

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    varying vec3 vPosition;
    varying float vProgress;

    void main() {
        // Draw soft circles instead of block squares
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        
        // Smooth radial edge alpha gradient
        float alpha = smoothstep(0.5, 0.1, dist);
        
        // Mix colors based on position
        vec3 col = mix(uColor1, uColor2, sin(vPosition.y * 0.4 + vPosition.x * 0.4) * 0.5 + 0.5);
        
        // Morph colors extra details for higher states
        if (vProgress > 1.0) {
            col = mix(col, vec3(1.0, 1.0, 1.0), (vProgress - 1.0) * 0.25);
        }
        
        gl_FragColor = vec4(col, alpha * 0.8);
    }
  `

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[spherePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTorus"
          args={[torusPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aGrid"
          args={[gridPositions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
