import {forwardRef} from 'react'

type SmartphoneProps = {
  iframeUrl: string
}

export const Smartphone = forwardRef<HTMLIFrameElement, SmartphoneProps>(
  ({iframeUrl}, ref) => {
    return (
      <div
        className='after:content-[" "] before:content-[" "]
      ` 
      relative 
      my-6 
      box-border  
      flex 
     aspect-[9/19] 
     max-h-[100%] 
     max-w-[300px] 
     items-center 
     justify-center 
     overflow-hidden 
     rounded-[40px] 
     bg-blue-400 
     shadow-[0px_0px_0px_11px_#1f1f1f,0px_0px_0px_13px_#191919,0px_0px_0px_20px_#111111] 
     before:absolute 
     before:left-[calc(50%-28%)] 
     before:top-0 
     before:z-50 
     before:h-[30px]
     before:w-[56%]
     before:rounded-[0px_0px_40px_40px]
     before:bg-gradient-to-b
     before:from-[#1f1f1f] 
     before:via-[#1f1f1f] 
     before:to-[#111] 
     after:absolute 
     after:bottom-2 
     after:left-[calc(50%-20%)] 
     after:h-1  after:w-[40%]
     after:rounded-full
     after:bg-white
     after:shadow-md'>
        <iframe
          ref={ref}
          src={iframeUrl}
          className='h-full w-full object-cover'
        />
      </div>
    )
  },
)