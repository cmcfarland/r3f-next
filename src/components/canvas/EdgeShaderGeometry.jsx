'use client';
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react';
import { Edges, shaderMaterial } from '@react-three/drei';
import { Color, DoubleSide } from 'three';
import { EdgesGeometry } from 'three';
import { extend, useFrame } from '@react-three/fiber'
import { useControls } from 'leva';
import { LineSegments } from 'three'
import { LineMaterial } from 'three-stdlib'
extend({ LineMaterial, LineSegments, EdgesGeometry })

const EdgeShaderGeometry = ({ mesh, angleThreshold, width = 1, uniforms, vertexShader, fragmentShader, }) => {
  const ref = useRef();
  const edges = new EdgesGeometry(mesh.geometry, angleThreshold);
  const geometry = new LineSegmentsGeometry.fromEdgesGeometry(edges);

  const ColorShiftMaterial = new shaderMaterial(
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
  const material = new shaderMaterial({
    side: DoubleSide,
    uniforms,
    vertexShader,
    fragmentShader,
  });

  return (
    <mesh ref={ref} geometry={geometry} material={material} />
  );
}; 
