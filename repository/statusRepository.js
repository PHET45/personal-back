import supabase from "../util/supabaseClient.js";

export const StatusRepository = {
  async getAll() {
    const { data, error } = await supabase.from("statuses").select("*");
    if (error) throw error;
    return data;
  }
}