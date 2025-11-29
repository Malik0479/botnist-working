const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');

// 1. GET PROFILE (Powers the Dashboard)
// Fetches user details + subscription status
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users') // Matches the table we created in SQL
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. UPDATE PROFILE (Powers Settings Page)
router.put('/profile', requireAuth, async (req, res) => {
  const { company_name, phone_number } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ company_name, phone_number, updated_at: new Date() })
      .eq('id', req.user.id)
      .select();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;