import { BellIcon } from 'lucide-react'
import React from 'react'

const NoNotificationFound = () => {
  return (
    <div className='flex flex-col justify-center min-h-screen items-center py-16 text-center'>
      <div className='size-16 rounded-full bg-base-300 flex items-center justify-center mb-4'>
        <BellIcon className='size-8 text-base-content opacity-40'/>
      </div>
      <h3 className='text-lg font-semibold mb-2'>No notifiactions yet</h3>
      <p className='opacity-70 text-base-content max-w-md'>When you receive friend requests or message, they'll appear here. </p>
    </div>
  )
}

export default NoNotificationFound
