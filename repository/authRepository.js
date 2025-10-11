import supabase from "../util/supabaseClient.js";


export async function supabaseSignIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function supabaseSignUp(name, username,email, password) {
  return await supabase.auth.signUp({ options: { data: { name, username } }, email, password });
}

export async function supabaseGetUser(token) {
  return await supabase.auth.getUser(token);
}

export async function supabaseUpdateAvatar(userId, avatarUrl) {
  // 🔹 update user_metadata ใน auth.users
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { avatar_url: avatarUrl },
  });

  if (error) throw new Error(error.message);
  return data.user;
}


