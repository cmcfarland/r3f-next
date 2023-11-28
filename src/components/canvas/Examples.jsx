'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'
import { extend } from '@react-three/fiber'
import { shaderMaterial, Edges } from '@react-three/drei'
import { useControls } from 'leva'
import { Segments, Outlines } from '@react-three/drei'
import { DoubleSide, Color } from 'three'
import { LineSegmentsGeometry, EdgesGeometry } from 'three'

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
//   const geometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
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
      u_colorA: { value: new Color("#FFE486") },
      u_colorB: { value: new Color("#FEB3D9") },
    }), []
  )

  const uniformsEdge = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_colorA: { value: new Color('#1FB2C4') },
    }), []
  )

  const { wireframe, edges, edgeColor, edgeScale } = useControls({
    wireframe: false, edges: true, edgeColor: uniformsEdge.u_colorA.value,
    edgeScale: { value: 1.0, step: 0.1, min: 1.0, max: 2.0 },
  })
  const { meshScale } = useControls({
    meshScale: { value: 5.0, step: 0.1, min: 1.0, max: 10.0 },
  })

  const vertexShader = `
    uniform float u_time;

    varying float vZ;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      modelPosition.y += sin(modelPosition.x * 5.0 + u_time * 3.0) * 0.1;
      modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;

      vZ = modelPosition.y;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
    `
  const fragmentShader = `
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

    void main() {
      gl_FragColor = vec4(u_colorA, 1.0);
    }
    `
  const mesh = useRef(null)
  const edge = useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.material.uniforms.u_time.value = t;
    edge.current.material.uniforms.u_time.value = t;
    edge.current.material.uniforms.u_colorA.value = edgeColor
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={meshScale} >
      {/* <mesh ref={mesh} {...props} castShadow receiveShadow> */}
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial wireframe={wireframe} side={DoubleSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
      {/* <EdgeShaderGeometry mesh={mesh}
        uniforms={uniformsEdge}
        vertexShader={vertexShader}
        fragmentShader={fragmentShaderEdge}
      /> */}
      <Edges ref={edge} scale={edgeScale} visible={edges}
        color={edgeColor} >
        {/* geometry={mesh.linesFromGeometry()}> */}
        <shaderMaterial side={DoubleSide}
          uniforms={uniformsEdge}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderEdge}
        />
      </ Edges>
      {/* <Outlines color={color} thickness={thickness} transparent={!outlines} opacity={0} /> */}
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