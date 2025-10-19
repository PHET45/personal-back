//repository/categoryRepository.js
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
  async getById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', id)
      .single() // รับแค่ record เดียว
    if (error) throw error
    return data
  },
  async create(name) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()
    if (error) throw error
    return data[0]
  },

  async update(id, name) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async remove(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    return true
  },
}
