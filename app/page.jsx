'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Spectrum = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Spectrum), { ssr: false })
const Cube = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Cube), { ssr: false })
const Logo = dynamic(() => import('@/components/canvas/Logo').then((mod) => mod.Logo), { ssr: false })

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {

  return (
    <>
      <div className='absolute left-0 top-0 h-full w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        {/* first row */}
        {/* <div className='relative h-48 w-full py-6 sm:w-1/2 md:my-12 md:mb-40'>
          <h2 className='mb-3 text-3xl font-bold leading-none text-gray-800'>Events are propagated</h2>
          <p className='mb-8 text-gray-600'>Drag, scroll, pinch, and rotate the canvas to explore the 3D scene.</p>
        </div> */}
        <div className='relative h-full w-full sm:w-full md:mb-40'>
          <View orbit className='relative h-full w-full sm:h-full sm:w-full'>
            <Suspense fallback={null}>
              <Cube />
              <Spectrum route='/blob' halfLength={100}
                scale={0.7} position={[0, 1, 0]} rotation={[-Math.PI / 4, 0, 0]} />
              <Common light posZ={150} />
            </Suspense>
          </View>
        </div>
      </div>

      {/* <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        <div className='w-full text-center md:w-3/5'>
          <View className='flex h-48 w-48 flex-col items-center justify-center'>
            <Suspense >
              <Logo route='/blob' scale={0.6} position={[0, 0, 0]} />
              <Common light />
            </Suspense>
          </View>
        </div>
      </div> */}
    </>
  )
}
