// server/service/uploadService.js
import supabase from '../util/supabaseClient.js'
import { uploadRepository } from '../repository/uploadRepository.js'

export const uploadService = {
  uploadProfilePic: async (userId, file) => {
    try {
      console.log('📸 Starting upload for user:', userId)

      // ✅ ดึงข้อมูล auth metadata
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      const authMetadata = {
        name: authUser?.user_metadata?.name,
        username: authUser?.user_metadata?.username,
      }

      let currentProfile
      try {
        currentProfile = await uploadRepository.getUserProfile(userId)
      } catch (err) {
        console.log('No existing profile found, continuing...')
      }

      if (currentProfile?.profile_pic) {
        const urlParts = currentProfile.profile_pic.split('/')
        const oldFileName = urlParts[urlParts.length - 1]
        console.log('🗑️ Deleting old picture:', oldFileName)

        try {
          await uploadRepository.deleteProfilePic(oldFileName)
        } catch (err) {
          console.log('Old picture delete failed (may not exist)')
        }
      }

      const fileName = `${userId}_${Date.now()}_${file.originalname}`
      console.log('⬆️ Uploading new picture:', fileName)

      const { data: storageData, error: storageError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        })

      if (storageError) {
        console.error('Storage error:', storageError)
        throw storageError
      }

      console.log('✅ Upload successful:', storageData)

      const SUPABASE_URL = process.env.SUPABASE_URL
      const profilePicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`
      console.log('🔗 Public URL:', profilePicUrl)

      // ✅ ส่ง authMetadata ไปด้วย
      await uploadRepository.upsertProfilePic(
        userId,
        profilePicUrl,
        authMetadata
      )

      const updatedProfile = await uploadRepository.getUserProfile(userId)
      console.log('✅ Profile updated:', updatedProfile)

      return updatedProfile
    } catch (error) {
      console.error('❌ Upload service error:', error)
      throw error
    }
  },

  getProfile: async (userId) => {
    try {
      return await uploadRepository.getUserProfile(userId)
    } catch (error) {
      console.error('❌ Get profile error:', error)
      throw error
    }
  },

  updateProfile: async (userId, { name, username }) => {
    try {
      console.log('📝 Updating profile for user:', userId, { name, username })

      await uploadRepository.updateUserInfo(userId, { name, username })

      const updatedProfile = await uploadRepository.getUserProfile(userId)
      console.log('✅ Profile info updated:', updatedProfile)

      return updatedProfile
    } catch (error) {
      console.error('❌ Update profile error:', error)
      throw error
    }
  },

  uploadPostImage: async (base64Data, originalName = 'image.jpg') => {
    try {
      console.log('📸 Processing base64 image upload')

      // ✅ แยก data URL (data:image/jpeg;base64,...)
      let buffer
      let mimeType = 'image/jpeg' // default

      if (base64Data.startsWith('data:')) {
        const matches = base64Data.match(/^data:(.+);base64,(.+)$/)
        if (!matches) {
          throw new Error('Invalid base64 format')
        }

        mimeType = matches[1]
        const base64String = matches[2]
        buffer = Buffer.from(base64String, 'base64')
      } else {
        // ถ้าไม่มี data: prefix
        buffer = Buffer.from(base64Data, 'base64')
      }

      console.log('📦 Buffer size:', buffer.length, 'bytes')
      console.log('📄 MIME type:', mimeType)

      // ✅ สร้างชื่อไฟล์ unique
      const timestamp = Date.now()
      const extension = mimeType.split('/')[1] || 'jpg'
      const fileName = `post_${timestamp}_${Math.random()
        .toString(36)
        .substring(7)}.${extension}`

      // ✅ Upload ไป Supabase
      const publicUrl = await uploadRepository.uploadImage(
        fileName,
        buffer,
        mimeType
      )

      console.log('✅ Upload completed:', publicUrl)

      return {
        url: publicUrl,
        fileName: fileName,
        mimeType: mimeType,
        size: buffer.length,
      }
    } catch (error) {
      console.error('❌ Upload post image error:', error)
      throw error
    }
  },

  deletePostImage: async (imageUrl) => {
    try {
      // ✅ Extract filename from URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]

      console.log('🗑️ Deleting image:', fileName)
      await uploadRepository.deleteImage(fileName)

      return true
    } catch (error) {
      console.error('Delete image error:', error)
      throw error
    }
  },
}
