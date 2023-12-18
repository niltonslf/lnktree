import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import {authStore} from '@/app/auth/context/auth-store'
import {firebaseStorage} from '@/libs/firebase'

export const useWallpaperUploader = () => {
  const user = authStore.user

  const upload = async (
    imageFile: Blob | Uint8Array | ArrayBuffer,
  ): Promise<string> => {
    if (!user) throw new Error('user is not authenticated')

    const fileRef = `wallpapers/${user.userName}/wallpaper.jpg`
    const storageRef = ref(firebaseStorage, fileRef)

    await uploadBytes(storageRef, imageFile)
    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  }

  return {
    upload,
  }
}
