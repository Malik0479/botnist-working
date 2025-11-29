const supabase = require('../supabaseClient');

const requireAuth = async (req, res, next) => {
  try {
    // 1. Get the token from headers
    const token = req.headers.authorization?.split(' ')[1]; // Reads "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 3. Attach user to request so next functions can use it
    req.user = user;
    next();
    
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: "Internal Server Error during Auth" });
  }
};

module.exports = requireAuth;