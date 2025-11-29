const { ApifyClient } = require('apify-client');
const supabase = require('../supabaseClient');
const crypto = require('crypto');
const axios = require('axios');

// Initialize Client
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

// --- HELPER: Formats JSON into AI-Ready Text ---
const convertToEmbeddingText = (items) => {
    let fullText = "";

    items.forEach(item => {
        // Skip if content is too short (likely an error page or empty)
        if (!item.text || item.text.length < 50) return;

        fullText += `SOURCE_URL: ${item.url}\n`;
        fullText += `TITLE: ${item.title || 'No Title'}\n`;
        
        // If description exists, add it
        if (item.description) {
            fullText += `SUMMARY: ${item.description}\n`;
        }

        // Clean up the main content:
        // 1. Remove excessive newlines
        // 2. Trim whitespace
        let cleanContent = item.text
            .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single
            .replace(/\[.*?\]/g, '')   // Remove markdown links [text] if needed
            .trim();

        fullText += `CONTENT:\n${cleanContent}\n`;
        fullText += `\n--------------------------------------------------\n\n`;
    });

    return fullText;
};

// --- CORE LOGIC ---
const runScrapingJob = async (url) => {
    console.log(`[Apify] Configured for Product/Info extraction: ${url}`);

    const input = {
        "startUrls": [{ "url": url }],
        "crawlerType": "playwright:adaptive", // Handles dynamic JS stores
        "maxCrawlDepth": 5, // Go deep to find products
        "maxCrawlPages": 50, // Adjust based on plan
        
        // 1. IGNORE BLOGS & NEWS
        "excludeUrlGlobs": [
            "**/blog/**", 
            "**/news/**", 
            "**/article/**", 
            "**/posts/**",
            "**/press/**"
        ],

        // 2. REMOVE CLUTTER (Nav, Footer, Ads)
        // This makes the text much cleaner for embeddings
        "removeElementsCssSelector": "nav, footer, script, style, .ad, .advertisement, .cookie-consent, .sidebar, header",

        // 3. OUTPUT SETTINGS
        "htmlTransformer": "readableText", // Extracts only meaningful text
        "readableTextCharThreshold": 100,  // Ignore tiny text snippets
        "saveHtml": false,
        "saveMarkdown": false, // We use 'text' field for raw cleaner data
        "proxyConfiguration": { "useApifyProxy": true }
    };

    // Run the Website Content Crawler
    const run = await client.actor("apify/website-content-crawler").call(input);
    
    // Fetch results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    if (items && items.length > 0) {
        return { 
            items: items, 
            source: "Apify Smart Crawler", 
            count: items.length 
        };
    }

    throw new Error("Scraper finished but returned no valid items.");
};

// --- API ENDPOINT ---
exports.scrapeUrl = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;
  
  // Create filename with .txt extension
  const jobHash = crypto.randomBytes(8).toString('hex');
  const fileName = `${jobHash}.txt`;

  try {
    // 1. Log Processing
    await supabase.from('scraping_jobs').insert([{ 
        user_id: userId, 
        job_hash: jobHash, 
        target_url: url, 
        status: 'processing' 
    }]);

    // 2. Run Scrape
    const jobResult = await runScrapingJob(url);

    // 3. TRANSFORM: JSON -> Clean Text
    const formattedText = convertToEmbeddingText(jobResult.items);

    // 4. Upload .txt to Storage
    const { error: uploadError } = await supabase
      .storage
      .from('scrapes')
      .upload(fileName, formattedText, {
        contentType: 'text/plain', // Important for browsers/AI to read correctly
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 5. Save Reference
    await supabase.from('scraped_data').insert([{
        job_hash: jobHash,
        data: { 
            storage_path: fileName,
            source: jobResult.source,
            page_count: jobResult.count,
            file_type: "text/plain",
            scraped_at: new Date().toISOString()
        }
    }]);

    // 6. Complete
    await supabase.from('scraping_jobs')
      .update({ status: 'completed', row_count: jobResult.count })
      .eq('job_hash', jobHash);

    console.log(`[Success] Saved clean text to ${fileName}`);

    res.json({ 
        success: true, 
        jobHash: jobHash, 
        message: "Analysis complete. Text ready for embedding."
    });

  } catch (error) {
    console.error("[Scrape Error]", error.message);
    await supabase.from('scraping_jobs').update({ status: 'failed' }).eq('job_hash', jobHash);
    res.status(500).json({ error: 'Scraping failed', details: error.message });
  }
};

// --- REST OF CONTROLLERS (History, etc) ---
exports.getHistory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scraping_jobs')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobDetails = async (req, res) => {
  const { hash } = req.params;
  try {
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .select('id')
      .eq('job_hash', hash)
      .eq('user_id', req.user.id)
      .single();

    if (jobError || !job) return res.status(404).json({ error: "Job not found or access denied" });

    const { data: result, error: dataError } = await supabase
      .from('scraped_data')
      .select('data, scraped_at')
      .eq('job_hash', hash)
      .single();

    if (dataError) throw dataError;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteBot = async (req, res) => {
  const { hash } = req.params;
  const userId = req.user.id;
  
  // 1. Construct the filename (Critical: must match extension used in scrapeUrl)
  const fileName = `${hash}.txt`;

  try {
    // 2. Verify Ownership first
    const { data: job } = await supabase
      .from('scraping_jobs')
      .select('id')
      .eq('job_hash', hash)
      .eq('user_id', userId)
      .single();
      
    if (!job) return res.status(403).json({error: "Not authorized"});

    // 3. Delete File from Storage Bucket 'scrapes'
    const { error: storageError } = await supabase.storage
        .from('scrapes')
        .remove([fileName]);

    if (storageError) {
        console.error("Storage delete warning:", storageError);
        // We continue to delete the DB row even if storage fails
    }

    // 4. Delete from Database
    await supabase.from('scraping_jobs').delete().eq('job_hash', hash);

    res.json({ message: "Bot and associated files deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};