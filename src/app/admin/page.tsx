'use client'

import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'

import {Modal, Smartphone} from '@/app/components'
import {parseUserPageUrl} from '@/utils'

import {authStore} from '../auth/context/auth-store'
import {AdminBaseLayout, PageLoader} from './components'
import {LinksSection} from './components/links-section'
import {useSmartphone} from './context/smartphone-context'

const Admin = observer(() => {
  const user = authStore.user

  const {iframeRef, reloadSmartphoneList, key} = useSmartphone()
  const [showUsernameModal, setShowUsernameModal] = useState(false)

  const onSubmitUsername = async (username: string) => {
    await authStore.updateUser({username})
    reloadSmartphoneList()
    setShowUsernameModal(false)
  }

  useEffect(() => {
    if (user != undefined && !user?.username) {
      setShowUsernameModal(true)
    } else {
      setShowUsernameModal(false)
    }
  }, [user, user?.username])

  if (!user) return <PageLoader />

  return (
    <>
      <AdminBaseLayout>
        <AdminBaseLayout.Content>
          <h1 className='mb-8 text-2xl font-semibold'>Your links</h1>

          <LinksSection user={user} />
        </AdminBaseLayout.Content>

        <AdminBaseLayout.PagePreview>
          <Smartphone
            key={key}
            ref={iframeRef}
            iframeUrl={parseUserPageUrl(user?.username)}
          />
        </AdminBaseLayout.PagePreview>
      </AdminBaseLayout>

      <Modal onSave={onSubmitUsername} initialOpen={showUsernameModal} />
    </>
  )
})

export default Admin
