'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { extend } from '@react-three/fiber'
import { PlaneGeometry, shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import { Outlines } from '@react-three/drei'
import { DoubleSide } from 'three'

// import dynamic from 'next/dynamic'
// const Outlines = dynamic(() => import('@react-three/drei').then((mod) => mod.Outlines), { ssr: false })
// const useControls = dynamic(() =>
// import dynamic from 'next/dynamic'
// const Outlines = dynamic(() => import('@react-three/drei').then((mod) => mod.Outlines), { ssr: false })
// const useControls = dynamic(() => import('leva').then((mod) => mod.useControls), { ssr: false })

// FFT plane visualizer
export const Spectrum = ({ halfLength = 512, ...props }) => {
  // const halfLength = this.timeArray.length / 8;
  // const ColorShiftMaterial = shaderMaterial(
  //   { time: 0, color: '#1fb2f5' },
  //   /* vertex shader, glsl*/`
  //     varying vec2 vUv;
  //     void main() {
  //       vUv = uv;
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //     }
  //   `,
  //   /* fragment shader, glsl*/`
  //     uniform float time;
  //     uniform vec3 color;
  //     varying vec2 vUv;
  //     #pragma glslify: random = require(glsl-random)

  //     void main() {
  //       gl_FragColor.rgba = vec4(color + sin(time) * 0.2, 1.0);
  //     }
  //   `,
  // )
  // extend({ ColorShiftMaterial })

  const mesh = useRef(null)
  const { wireframe, outlines, color, thickness } = useControls({
    wireframe: false, outlines: true, color: 'white',
    thickness: { value: 0.5, step: 0.1, min: 0, max: 4 },
  })

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 2
  })

  return (
    <mesh ref={mesh} {...props} castShadow receiveShadow>
      <Outlines color={color}
        thickness={thickness} transparent={!outlines} opacity={0} />
      <planeGeometry args={[halfLength, halfLength]} />
      <meshBasicMaterial color={'#1fb2c4'} wireframe={wireframe} />
    </mesh>
  )
}

export const Cube = ({ ...props }) => {
  const mesh = useRef(null)
  const { wireframe, outlines, color, thickness } = useControls({
    wireframe: false, outlines: true, color: 'white',
    thickness: { value: 0.5, step: 0.1, min: 0, max: 4 },
  })

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 2
  })

  return (
    <mesh ref={mesh} {...props} castShadow receiveShadow>
      <Outlines color={color}
        thickness={thickness} transparent={!outlines} opacity={0} />
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial color={0xff0000} wireframe={wireframe} />
    </mesh>
  )
}