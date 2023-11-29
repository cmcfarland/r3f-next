'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

export const Common = ({ color, position = [0, 0, 10], light }) => (
  <Suspense >
    {color && <color attach='background' args={[color]} />}

    {light && <ambientLight intensity={0.5} />}
    {light && <pointLight position={[20, 30, 10]} intensity={1} />}
    {light && <pointLight position={[-10, -10, -10]} color='blue' />}

    <PerspectiveCamera makeDefault fov={40} position={position} />
  </Suspense>
)

const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls target={[0, 0, 0]} />}

        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
