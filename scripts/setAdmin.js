import supabase from "../util/supabaseClient.js"

async function setAdmin(email) {
  // หา user ด้วย email
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) throw error

  const user = users.find(u => u.email === email)
  if (!user) {
    console.log("User not found")
    return
  }

  // อัพเดท role = admin
  const { data, error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { app_metadata: { role: 'admin' } }
  )

  if (updateError) throw updateError
  console.log("Updated:", data)
}

setAdmin("admin@gmail.com")
