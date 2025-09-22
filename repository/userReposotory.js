import supabase from '../util/supabaseClient.js'

export const UserRepository = {
  async getByid(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },
}
