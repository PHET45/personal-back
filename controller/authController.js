
// server/controller/authController.js
import supabase from "../util/supabaseClient.js";
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


export const authController = {
  
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      console.log('🔐 Change password request:', { userId });

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current password and new password are required"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters"
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          message: "New password must be different from current password"
        });
      }

      // Get user email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        console.log('❌ Current password incorrect');
        return res.status(401).json({
          message: "Current password is incorrect"
        });
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('❌ Password update error:', updateError);
        throw updateError;
      }

      console.log('✅ Password changed successfully');

      res.json({
        message: "Password changed successfully"
      });
    } catch (err) {
      console.error('❌ Change password error:', {
        message: err.message,
        code: err.code
      });
      next(err);
    }
  },
};