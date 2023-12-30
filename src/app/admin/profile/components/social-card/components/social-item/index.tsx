import {Trash} from 'lucide-react'
import {SocialIcon} from 'react-social-icons'

import {socialOptions} from '@/data/social-options'
import {displayUrlShort} from '@/utils'

type SocialItemProps = {
  social: {
    social: string
    url: string
  }
}

export const SocialItem = ({social}: SocialItemProps) => {
  return (
    <div className='flex flex-row flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg bg-background-100 px-4 py-2'>
      <span className='flex flex-row flex-wrap items-center justify-between gap-2 text-sm md:text-base'>
        <SocialIcon
          url={social?.url}
          className='!h-8 !w-8'
          as='span'
          fgColor='white'
          bgColor='transparent'
        />
        <span className='text-slate-300'>
          {socialOptions[social?.social]?.label ?? social?.social}
        </span>
      </span>

      <div className='flex w-full flex-row items-center justify-between gap-3 md:w-auto md:flex-1 md:justify-end'>
        <p className='max-w-[80%] overflow-hidden overflow-ellipsis whitespace-nowrap text-right font-normal'>
          {displayUrlShort(social.url, true)}
        </p>
        <button className='rounded-md p-2 text-background-900 hover:bg-primary-500'>
          <Trash size={18} />
        </button>
      </div>
    </div>
  )
}
