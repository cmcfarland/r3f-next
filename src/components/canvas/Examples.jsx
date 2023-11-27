'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useCursor } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
// import { Outlines } from '@react-three/drei'
import { useControls } from 'leva'
import dynamic from 'next/dynamic'
const Outlines = dynamic(() => import('@react-three/drei').then((mod) => mod.Outlines), { ssr: false })
// const useControls = dynamic(() => import('leva').then((mod) => mod.useControls), { ssr: false })

// FFT plane visualizer
export const Spectrum = ({ route = '/blob', halfLength = 512, ...props }) => {
  const router = useRouter()
  // const [hovered, hover] = useRef(false)
  const [hovered, hover] = useState(false)
  useCursor(hovered)

  // const halfLength = this.timeArray.length / 8;
  const ColorShiftMaterial = shaderMaterial(
    { time: 0, color: '#1fb2f5' },
    /* vertex shader, glsl*/`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    /* fragment shader, glsl*/`
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      #pragma glslify: random = require(glsl-random)

      void main() {
        gl_FragColor.rgba = vec4(color + sin(time) * 0.2, 1.0);
      }
    `,
  )
  extend({ ColorShiftMaterial })

  const mesh = useRef(null)
  const { wireframe } = useControls({ wireframe: false })
  const { outlines, color, thickness, angle } = useControls({
    outlines: true,
    color: 'white',
    thickness: { value: 0.5, step: 0.1, min: 0, max: 4 },
    angle: { value: 0.0, step: 0.1, min: 0, max: Math.PI },
  })
  // const color = '#ffffff'
  // const thickness = 1.0
  // const outlines = true
  // const wireframe = false

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    // mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 2
    // mesh.current.color = 'green'
  })

  return (
    // <Plane ref={mesh} args={[halfLength, halfLength]} color='#f51ff5' side={THREE.DoubleSide} {...props} />
    <mesh ref={mesh} {...props} castShadow receiveShadow>
      <Outlines color={wireframe ? color : '#aaffaa'}
        thickness={thickness} angle={angle}
        transparent={!outlines} opacity={0} />
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial color={0xff0000} wireframe={wireframe} />
    </mesh>
  )
}
