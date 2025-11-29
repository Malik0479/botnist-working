const supabase = require('../supabaseClient');

// 1. LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({ 
      message: 'Login successful', 
      session: data.session,
      user: data.user 
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// 2. SIGNUP (Updated with Email Check)
exports.signup = async (req, res) => {
  const { email, password, username, companyName, phoneNumber } = req.body;

  try {
    // --- STEP 1: CHECK IF EMAIL EXISTS ---
    // We check the public 'users' table first
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // --- STEP 2: CREATE AUTH USER ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          company_name: companyName,
          phone_number: phoneNumber
        }
      }
    });

    if (error) throw error;

    // --- STEP 3: HANDLE POTENTIAL DUPLICATES ---
    // Sometimes Supabase returns a user but with a null session if email config is strict.
    // We check if the user ID was actually created new or matched an existing one.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    res.json({ 
      message: 'Signup successful. Check email for verification.', 
      user: data.user 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// 3. FORGOT PASSWORD
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password`,
    });

    if (error) throw error;

    res.json({ message: 'Password reset email sent' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id; 

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: password }
    );

    if (error) throw error;

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. GOOGLE OAUTH
exports.googleLogin = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard`,
      },
    });

    if (error) throw error;

    if (data.url) {
      res.redirect(data.url);
    } else {
      throw new Error('No OAuth URL returned');
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};