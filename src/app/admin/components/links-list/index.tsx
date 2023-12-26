'use client'

import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  addDoc,
  setDoc,
} from 'firebase/firestore'
import {Plus} from 'lucide-react'
import {useCallback, useEffect, useState} from 'react'

import {useSmartphone} from '@/app/admin/context'
import {db} from '@/libs/firebase'
import {Link, User} from '@/models'

import {AddLinkForm} from '..'

import {useDebounce} from '@/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {LinkCardItem} from './link-card-item'

type LinksListProps = {
  user: User
}

export const LinksList = ({user}: LinksListProps) => {
  const {reloadSmartphoneList} = useSmartphone()
  const reloadSmartphoneListDebounced = useDebounce(() => {
    reloadSmartphoneList()
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [links, setLinks] = useState<Required<Link>[]>([])

  const getLastOrder = () => {
    return links.reduce((prev, cur) => Math.max(prev, cur.order + 1), 0)
  }

  const handleAddNewLink = async () => {
    const res = await doc(db, 'users', user.uid)
    const emptyLink: Link = {label: '', url: '', order: getLastOrder()}
    addDoc(collection(res, 'links'), emptyLink)
  }

  const handleSaveLink = async (data: Link) => {
    if (data.id) setDoc(doc(db, 'users', user.uid, 'links', data.id), data)
  }

  const handleSubmitForm = async (data: Link) => {
    await handleSaveLink(data)
    reloadSmartphoneListDebounced()
  }

  const deleteLink = (link: Link) => {
    if (link.id) deleteDoc(doc(db, 'users', user.uid, 'links', link.id))
    reloadSmartphoneList()
  }

  const fetchData = useCallback(() => {
    const customQuery = query(collection(db, 'users', user.uid, 'links'))
    const unsubscribe = onSnapshot(customQuery, querySnapshot => {
      setLinks([])

      let newLinks: Required<Link>[] = []

      querySnapshot.forEach((doc: any) =>
        newLinks.push({...doc.data(), id: doc.id}),
      )

      newLinks = newLinks.sort((prev, next) => next.order - prev.order)

      setLinks(newLinks)
    })

    return unsubscribe
  }, [user.uid])

  const updateSort = (
    links: Required<Link>[],
    oldIndex: number,
    newIndex: number,
  ): void => {
    // MOVING DOWN
    if (oldIndex < newIndex) {
      const [start, end] = [oldIndex, newIndex - 1]

      handleSaveLink({...links[newIndex], order: links[end].order})

      for (let index = start; index <= end; index++) {
        const link: Link = {...links[index], order: links[index].order + 1}
        handleSaveLink(link)
      }

      return reloadSmartphoneListDebounced()
    }

    // MOVING UP
    const [start, end] = [newIndex + 1, oldIndex]

    handleSaveLink({...links[newIndex], order: links[start].order})

    for (let index = start; index <= end; index++) {
      const link: Link = {...links[index], order: links[index].order - 1}
      handleSaveLink(link)
    }
    return reloadSmartphoneListDebounced()
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event

    if (active.id != over?.id) {
      setLinks(items => {
        const oldIndex = items.findIndex(item => item.id == active.id)
        const newIndex = items.findIndex(item => item.id == over?.id)
        const newArr = arrayMove(items, oldIndex, newIndex)

        updateSort(newArr, oldIndex, newIndex)
        return newArr
      })
    }
  }

  useEffect(() => {
    const unsubscribe = fetchData()
    return () => unsubscribe()
  }, [fetchData])

  return (
    <section className='flex w-full flex-col gap-5 px-0 py-3'>
      <div className='flex flex-1 flex-col gap-5'>
        <button
          onClick={handleAddNewLink}
          className='danger btn solid md w-full'>
          Add link
          <Plus size={18} />
        </button>

        <ul className='flex flex-1 flex-col gap-3'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={links}
              key='links-list'
              strategy={verticalListSortingStrategy}>
              {links.map(link => (
                <LinkCardItem key={link.id} onDelete={deleteLink} link={link}>
                  <AddLinkForm saveLink={handleSubmitForm} link={link} />
                </LinkCardItem>
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      </div>
    </section>
  )
}
