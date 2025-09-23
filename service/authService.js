import {
  supabaseSignIn,
  supabaseSignUp,
  supabaseGetUser,
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
