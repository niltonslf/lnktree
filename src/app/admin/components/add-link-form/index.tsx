'use client'

import clsx from 'clsx'
import {useRef} from 'react'
import {useForm} from 'react-hook-form'
import * as z from 'zod'

import {Link} from '@/models'
import {zodResolver} from '@hookform/resolvers/zod'

type AddLinkFormProps = {
  saveLink: (args: any) => Promise<typeof args>
  link: Link
}

const httpRegex = new RegExp(
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
)

const schema = z.object({
  url: z
    .string()
    .regex(httpRegex, 'Value must be a valid url. e.g. https://google.com '),
  label: z.string().min(1, {message: 'Required field'}),
  id: z.string(),
})

export const AddLinkForm = ({saveLink, link}: AddLinkFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm<Link>({
    resolver: zodResolver(schema),
    defaultValues: link,
  })

  watch('url')

  return (
    <div className='flex w-full flex-row gap-5 rounded-lg '>
      <form
        ref={formRef}
        onKeyDown={e => {
          if (e.code == 'Enter') {
            formRef.current?.requestSubmit()
          }
        }}
        onSubmit={handleSubmit(saveLink)}
        className='flex flex-1 flex-col gap-2'>
        <input type='hidden' {...register('id', {required: true})} />

        <input
          placeholder='Type the label'
          {...register('label', {required: true})}
          className={clsx(
            'border-1 w-full rounded-md border border-gray-500 bg-gray-900 p-2 text-gray-200',
            errors.label && 'outline-red-400',
            errors.label && 'border-red-400',
          )}
        />
        {errors.label && (
          <p className='mt-0 text-sm text-red-600'>{errors.label.message}</p>
        )}

        <input
          placeholder='Type the url'
          {...register('url', {required: true})}
          className={clsx(
            'border-1 w-full rounded-md border border-gray-500 bg-gray-900 p-2 text-gray-200',
            errors.url && 'outline-red-400',
            errors.url && 'border-red-400',
          )}
        />
        {errors.url && (
          <p className='mt-0 text-sm text-red-600'>{errors.url.message}</p>
        )}
      </form>
    </div>
  )
}
