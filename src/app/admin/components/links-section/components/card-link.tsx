import {Grip, Trash} from 'lucide-react'
import {ReactNode} from 'react'

import {Link} from '@/models'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

type CardLinkProps = {
  link: Required<Link>
  onDelete: (link: Link) => void
  children: ReactNode
}

export const CardLink = ({link, onDelete, children}: CardLinkProps) => {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id: link.id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className='relative flex w-full flex-nowrap items-center justify-center gap-2 rounded-xl bg-neutral px-3  py-2 font-medium shadow-md md:px-5 md:py-3'>
      <button
        className='flex touch-none flex-col items-center'
        {...attributes}
        {...listeners}>
        <span>
          <Grip width={20} height={20} className='text-neutral-400' />
        </span>
      </button>

      {children}

      <div
        onClick={() => onDelete(link)}
        className='cursor-pointer'
        data-testid='delete-link-btn'>
        <Trash
          width={20}
          height={20}
          className='text-neutral-400 hover:text-neutral-200'
        />
      </div>
    </li>
  )
}
