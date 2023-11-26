'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { Line, Plane, useCursor, MeshDistortMaterial } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import { extend, Canvas } from '@react-three/fiber'

export const Blob = ({ route = '/', ...props }) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}

export const Logo = ({ route = '/blob', ...props }) => {
  const mesh = useRef(null)
  const router = useRouter()

  const [hovered, hover] = useState(false)
  const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

  useCursor(hovered)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 2
  })

  return (
    <group ref={mesh} {...props}>
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#b2b21f' lineWidth={0.05} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1ff5b2' lineWidth={0.05} rotation={[0, 0, 1]} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#f51ff5' lineWidth={0.05} rotation={[0, 0, -1]} />
      <mesh onClick={() => router.push(route)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial roughness={0} color={hovered ? 'hotpink' : '#1fb2f5'} />
      </mesh>
    </group>
  )
}

// FFT plane visualizer
export const Spectrum = ({ halfLength = 512, defaultColor = '#b2b21f', ...props }) => {
  // const halfLength = this.timeArray.length / 8;
  const ColorShiftMaterial = shaderMaterial(
    { time: 0, color: defaultColor },
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
  const mesh = useRef()

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    // mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 2
    // mesh.current.color = 'green'
  })

  return (
    // <Plane ref={mesh} args={[halfLength, halfLength]} color='#f51ff5' side={THREE.DoubleSide} {...props} />
    <mesh ref={mesh}>
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial color={0xff0000} wireframe />
    </mesh>
  )
}

const Cube = () => {
  const mesh = useRef();

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[100, 100, 100]} />
      <meshBasicMaterial color={0xff0000} />
    </mesh>
  );
};