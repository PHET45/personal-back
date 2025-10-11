import {
  supabaseSignIn,
  supabaseSignUp,
  supabaseGetUser,
  supabaseUpdateAvatar ,
} from "../repository/authRepository.js";


export async function loginUser(email, password) {
  const { data, error } = await supabaseSignIn(email, password);
  if (error) throw new Error(error.message);

  return {
    token: data.session.access_token,
    user: data.user,
  };
}

export async function registerUser(name, username, email, password) {
  const { data, error } = await supabaseSignUp(name, username, email, password);
  if (error) throw new Error(error.message);

  return data.user;
}

export async function getUserByToken(token) {
  const { data, error } = await supabaseGetUser(token);
  if (error) throw new Error(error.message);

  return data.user;
}

export async function updateAvatar(userId, file) {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;

  // 🔹 Upload ไป Supabase Storage (bucket: "avatars")
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  // 🔹 Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // 🔹 Update user_metadata
  const updatedUser = await supabaseUpdateAvatar(userId, publicUrl);

  return { avatarUrl: publicUrl, updatedUser };
}