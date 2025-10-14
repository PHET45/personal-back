// server/repository/uploadRepository.js
import supabase from '../util/supabaseClient.js'

export const uploadRepository = {
  // ✅ Upsert with auth metadata syn
  upsertProfilePic: async (userId, profilePicUrl, authMetadata = {}) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      const userData = {
        id: userId,
        profile_pic: profilePicUrl,
        username:
          authMetadata.username ||
          existingUser?.username ||
          `user_${Date.now()}`,
        name: authMetadata.name || existingUser?.name || 'User',
        role: existingUser?.role || 'user',
      }

      const { data, error } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error in upsertProfilePic:', err.message)
      throw err
    }
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // ✅ Update และ sync กับ Supabase Auth
  updateUserInfo: async (userId, { name, username }) => {
    try {
      // 1. Update ใน users table
      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            id: userId,
            name,
            username,
            role: 'user',
          },
          {
            onConflict: 'id',
            ignoreDuplicates: false,
          }
        )
        .select()
        .single()

      if (error) throw error

      // 2. ✅ Update ใน Supabase Auth user_metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name,
          username,
        },
      })

      if (authError) {
        console.error('Failed to sync with auth:', authError)
        // ไม่ throw error เพราะ users table อัปเดตสำเร็จแล้ว
      }

      return data
    } catch (err) {
      console.error('Error in updateUserInfo:', err.message)
      throw err
    }
  },

  deleteProfilePic: async (fileName) => {
    const { error } = await supabase.storage.from('avatars').remove([fileName])

    return true
  },

  uploadImage: async (fileName, buffer, mimeType) => {
    try {
      console.log('⬆️ Uploading image to Supabase:', fileName)

      const { data, error } = await supabase.storage
        .from('images') 
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: false,
        })

      if (error) throw error

      const SUPABASE_URL = process.env.SUPABASE_URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${fileName}`

      console.log('✅ Image uploaded:', publicUrl)
      return publicUrl
    } catch (err) {
      console.error('Error uploading image:', err)
      throw err
    }
  },

  deleteImage: async (fileName) => {
    try {
      const { error } = await supabase.storage
        .from('post-images')
        .remove([fileName])

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error deleting image:', err)
      throw err
    }
  },
}
