'use client';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { Line, useCursor } from '@react-three/drei';
import { useRouter } from 'next/navigation';


export const Logo = ({ route = '/blob', ...props }) => {
  const router = useRouter();
  const [hovered, hover] = useState(false);
  useCursor(hovered);

  const mesh = useRef(null);
  const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8);
    mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8);
    mesh.current.rotation.z -= delta / 2;
  });

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
        <meshPhysicalMaterial roughness={0} color={'#1fb2f5'} />
      </mesh>
    </group>
  );
};
