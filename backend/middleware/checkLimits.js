const supabase = require('../supabaseClient');

const checkLimits = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // 1. Get User's Plan Type
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (userError || !user) throw new Error('User not found');

    // 2. Get the Limits for that Plan
    const { data: plan } = await supabase
      .from('plans')
      .select('daily_scrape_limit')
      .ilike('name', user.user_type)
      .single();

    const limit = plan ? plan.daily_scrape_limit : 5; 

    // 3. Count Usage Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from('scraping_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (countError) throw countError;

    // 4. The Decision
    if (count >= limit) {
      return res.status(403).json({ 
        error: 'Daily limit reached', 
        message: `You have used ${count}/${limit} scrapes today. Upgrade for more.` 
      });
    }

    next();

  } catch (err) {
    console.error("Limit check failed:", err);
    res.status(500).json({ error: "Could not verify limits" });
  }
};

module.exports = checkLimits;