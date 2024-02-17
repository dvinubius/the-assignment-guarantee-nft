import InfuraLogo from '@/components/InfuraLogo'
import React from 'react'

function ListingsLoadingPage() {
  return (
    <div className='h-[80vh] flex flex-col items-center justify-center gap-8'>
      <div>POWERED BY</div>
      <InfuraLogo/>
      <div className='animate-pulse text-2xl text-gray-700'>Loading...</div>
    </div>
  )
}

export default ListingsLoadingPage