'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Spectrum = dynamic(() => import('@/components/canvas/FFTShader').then((mod) => mod.Spectrum), { ssr: false })
const Cube = dynamic(() => import('@/components/canvas/FFTShader').then((mod) => mod.Cube), { ssr: false })
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
        <div className='relative h-full w-full sm:w-full md:mb-40'>
          <View orbit className='relative h-full w-full sm:h-full sm:w-full'>
            <Suspense fallback={null}>
              {/* <Cube /> */}
              <Spectrum route='/blob'
              />
              <Common color='#000000' position={[0, 6, 6]} />
            </Suspense>
          </View>
        </div>
      </div>
    </>
  )
}
