import { loginUser, registerUser} from "../service/authService.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function register(req, res) {
  const { name, username, email, password } = req.body;

  try {
    const user = await registerUser(name, username, email, password);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function profile(req, res) {
  res.json({ user: req.user });
}

