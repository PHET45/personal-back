import supabase from '../util/supabaseClient.js'

export const CategoryRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },
}
