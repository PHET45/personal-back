import supabase from "../util/supabaseClient.js";


export async function supabaseSignIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function supabaseSignUp(email, password) {
  return await supabase.auth.signUp({ email, password });
}

export async function supabaseGetUser(token) {
  return await supabase.auth.getUser(token);
}
