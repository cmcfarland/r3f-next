'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useMemo, useContext } from 'react'
import { extend } from '@react-three/fiber'
import { shaderMaterial, Edges } from '@react-three/drei'
import { useControls } from 'leva'
import { Segments, Outlines } from '@react-three/drei'
import { DoubleSide, Color } from 'three'
import { LineSegments, EdgesGeometry } from 'three'
import { LineMaterial } from 'three-stdlib'
extend({ LineMaterial, LineSegments, EdgesGeometry })
// const EdgeShaderGeometry = ({ mesh, angleThreshold, width = 1,
//   uniforms, vertexShader, fragmentShader, }) => {
//   const ref = useRef();
//   // const uniforms = useMemo(
//   //   () => ({
//   //     u_time: { value: 0.0 },
//   //     u_colorA: { value: new Color('#1FB2C4') },
//   //   }), []
//   // )
//   const edges = new EdgesGeometry(mesh.geometry, angleThreshold);
//   const geometry = new LineSegmentsGeometry.fromEdgesGeometry(edges);
//   const material = new shaderMaterial({
//     side: DoubleSide,
//     uniforms,
//     vertexShader,
//     fragmentShader,
//   });

//   return (
//     <mesh ref={ref} geometry={geometry} material={material} />
//   );
// };

export const Spectrum = ({ halfLength = 1, ...props }) => {

  const ColorShiftMaterial = shaderMaterial(
    { time: 0, color: new Color(0.2, 0.0, 0.1) },
    `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
      }
    `)
  // const material = new ColorShiftMaterial({ color: new Color("hotpink") })
  // material.time = 1

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_amplitude: { value: 1.0 },
      u_colorA: { value: new Color("#FFE486") },
      u_colorB: { value: new Color("#FEB3D9") },
    }), []
  )

  const uniformsEdge = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_amplitude: { value: 1.0 },
      u_colorA: { value: new Color('#1FB2C4') },
    }), []
  )

  // Color gets converted from 255-int to 1.0-float in shader
  const shaderColor = ((color) => {
    if (typeof (color) === 'object') {
      const colorInt = Object.values(color)
      const colorFloat = colorInt.map((x) => x / 255.0)
      return colorFloat
    }
    return color
  })
  // Leva controls output color as '#f00' or {r:,g:,b:,a:}
  const levaColor = ((color) => {
    console.log('leva in:', color)
    let colorDict = { r: 0, g: 0, b: 255 }
    if (color.r) {
      Object.keys(colorDict).forEach(key => {
        colorDict[key] = Math.trunc(color[key] * 255)
      })
      console.log('leva out:', colorDict)
    }
    return colorDict
  })

  const { pause } = useControls({
    pause: false
  })
  const { wireframe, amplitude, meshScale, meshColor1, meshColor2 } = useControls({
    wireframe: false,
    amplitude: { value: 1.0, step: 0.1, min: 1.0, max: 10.0 },
    meshScale: { value: 1.0, step: 0.1, min: 1.0, max: 10.0 },
    meshColor1: {
      value: levaColor(uniforms.u_colorA.value),
      onChange: (c) => {
        console.log('meshColor2', c)
        uniforms.u_colorA.value = shaderColor(c)
      },
    },
    meshColor2: {
      value: levaColor(uniforms.u_colorB.value),
      onChange: (c) => {
        console.log('meshColor2', c)
        uniforms.u_colorB.value = shaderColor(c)
      },
    },
  })
  const { edges, edgeColor, edgeWidth } = useControls({
    edges: true,
    edgeColor: {
      value: levaColor(uniformsEdge.u_colorA.value),
      onChange: (c) => {
        console.log('edgeColor', c)
        uniformsEdge.u_colorA.value = shaderColor(c)
      },
    },
    edgeWidth: { value: 1.0, step: 0.1, min: 1.0, max: 10.0 },
  })

  const vertexShader = `
    uniform float u_time;
    uniform float u_amplitude;
    varying float vZ;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      modelPosition.y += sin(modelPosition.x * 5.0 + u_time * 3.0) * 0.1;
      modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;
      
      vZ = modelPosition.y;
      modelPosition.y *= u_amplitude;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
    `
  const fragmentShader = `
    uniform float u_amplitude;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    varying float vZ;

    void main() {
      vec3 color = mix(u_colorA, u_colorB, vZ * 2.0 + 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
    `
  const fragmentShaderEdge = `
    uniform vec3 u_colorA;
    varying float vZ;
    // varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(u_colorA, 1.0);
    }
    `
  const mesh = useRef(null)
  const edge = useRef(null)
  const edgeMatl = useRef(null)

  useFrame((state, delta) => {
    if (!pause) {
      const t = state.clock.getElapsedTime()
      uniforms.u_time.value = t
      uniformsEdge.u_time.value = t
    }

    uniforms.u_amplitude.value = amplitude
    uniformsEdge.u_amplitude.value = amplitude

  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={meshScale} >
      {/* <mesh ref={mesh} {...props} castShadow receiveShadow> */}
      <planeGeometry args={[5, 5, 75, 75]} />
      <shaderMaterial wireframe={wireframe} side={DoubleSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
      <Edges ref={edge} visible={edges} lineWidth={edgeWidth}>
        <shaderMaterial ref={edgeMatl} side={DoubleSide}
          uniforms={uniformsEdge}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderEdge}
        />
      </ Edges>
      {/* <Outlines color={edgeColor} thickness={edgeWidth} visible={edges} /> */}
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
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial color={0xff0000} wireframe={wireframe} />
      <Outlines color={color}
        thickness={thickness} transparent={!outlines} opacity={0} />
    </mesh>
  )
}