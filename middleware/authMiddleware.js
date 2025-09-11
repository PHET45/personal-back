export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" })
  }

  // 👉 ตรงนี้คุณสามารถ verify JWT หรือ Supabase auth ได้จริง
  // เช่น decode JWT แล้วเอามาใส่ req.user
  req.user = { id: "demo-user-id", role: "admin" }

  next()
}
