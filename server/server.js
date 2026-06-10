import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './db.js';
import sharp from 'sharp';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';


dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, 'uploads');
const isPostgres = !!process.env.DATABASE_URL;

// Ensure uploads folder exists (skip/catch error if directory is read-only in serverless environments)
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
} catch (err) {
  console.warn('Could not create uploads directory (running in a read-only serverless environment):', err.message);
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'auracove_luxury_secret_key_2026';

// 1. Helmet HTTP Security Headers Configuration
app.use(helmet({
  contentSecurityPolicy: false, // Prevent HMR / Vite loading blocks
  crossOriginResourcePolicy: false // Allow the React app to display images served by the Express backend
}));

// Disable X-Powered-By header explicitly
app.disable('x-powered-by');

// 2. Global Rate Limiter to prevent brute force / DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again after 15 minutes.' }
});

// Apply rate limiting to all API endpoints
app.use('/api/', apiLimiter);

// 3. Login Endpoint Rate Limiter to prevent password guessing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Serve built static React frontend assets in production
const distDir = join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper function to write to activity logs
function logActivity(action, details, user) {
  const query = `INSERT INTO activity_logs (action, details, user) VALUES (?, ?, ?)`;
  db.run(query, [action, details, user || 'System'], (err) => {
    if (err) console.error('Error writing activity log:', err.message);
  });
}

// Multer Storage Configuration (use MemoryStorage in PostgreSQL/production serverless mode)
const storage = isPostgres
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
      }
    });

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit to prevent Denial of Service
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF, SVG) are allowed.'));
  }
});

// --- AUTHENTICATION MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired access token.' });
    }
    req.user = user;
    next();
  });
}

// --- CLIENT APIS ---

// 1. Submit Stay Inquiry from contact form
// Helper to send notifications (Telegram & Email) when a new stay inquiry is submitted
async function sendInquiryNotification(inquiry) {
  const { name, email, phone, eventType, guestCount, date, details } = inquiry;
  const messageText = `🔔 *New Aura Cove Stay Inquiry!*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📧 *Email:* ${email}\n` +
    `📞 *Phone:* ${phone || 'N/A'}\n` +
    `🏡 *Sanctuary:* ${eventType}\n` +
    `👥 *Guests:* ${guestCount || 'N/A'}\n` +
    `📅 *Date:* ${date || 'N/A'}\n` +
    `📝 *Details:* ${details || 'None'}`;

  // 1. Send Telegram Message if bot credentials are set
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  if (telegramToken && telegramChatId) {
    try {
      const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: messageText,
          parse_mode: 'Markdown'
        })
      });
      console.log('Telegram inquiry notification sent successfully.');
    } catch (err) {
      console.error('Failed to send Telegram notification:', err.message);
    }
  }

  // 2. Send Resend Email if API credentials are set
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (resendApiKey && notificationEmail) {
    try {
      const htmlContent = `
        <h2>🔔 New Aura Cove Stay Inquiry!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Accommodation:</strong> ${eventType}</p>
        <p><strong>Guests:</strong> ${guestCount || 'N/A'}</p>
        <p><strong>Proposed Date:</strong> ${date || 'N/A'}</p>
        <p><strong>Details:</strong> ${details || 'None'}</p>
        <hr/>
        <p>Log in to your <a href="${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:5000'}/admin">Admin Dashboard</a> to manage this lead.</p>
      `;
      
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Aura Cove Notifications <onboarding@resend.dev>', // Free tier default sender
          to: notificationEmail,
          subject: `🔔 New Aura Cove Inquiry - ${name}`,
          html: htmlContent
        })
      });
      console.log('Email inquiry notification sent successfully.');
    } catch (err) {
      console.error('Failed to send Email notification:', err.message);
    }
  }

  // 3. Send Twilio SMS if API credentials are set
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;
  const twilioTo = process.env.TWILIO_TO_NUMBER;
  if (twilioSid && twilioAuthToken && twilioFrom && twilioTo) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const bodyParams = new URLSearchParams({
        From: twilioFrom,
        To: twilioTo,
        Body: `🔔 New Aura Cove Stay Inquiry!\n\nGuest: ${name}\nAccommodation: ${eventType}\nDate: ${date || 'N/A'}\nPhone: ${phone || 'N/A'}\nEmail: ${email}`
      });

      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });
      console.log('Twilio SMS notification sent successfully.');
    } catch (err) {
      console.error('Failed to send Twilio SMS:', err.message);
    }
  }
}

// 1. Submit Stay Inquiry from contact form
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, eventType, guestCount, date, details } = req.body;
  
  if (!name || !email || !eventType) {
    return res.status(400).json({ error: 'Name, email, and accommodation choice (eventType) are required.' });
  }

  const query = `
    INSERT INTO inquiries (name, email, phone, eventType, guestCount, date, details, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.run(query, [name, email, phone, eventType, guestCount, date, details], async function (err) {
    if (err) {
      console.error('Error inserting inquiry:', err.message);
      return res.status(500).json({ error: 'Failed to save stay inquiry.' });
    }
    
    logActivity('New Inquiry', `Inquiry received from ${name} for ${eventType}.`, 'Client Form');
    
    // Await the notifications so they are sent instantly on serverless platforms before the function responds
    await sendInquiryNotification({ name, email, phone, eventType, guestCount, date, details });
    
    res.status(201).json({
      message: 'Sanctuary stay inquiry submitted successfully.',
      id: this.lastID
    });
  });
});

// 2. Submit Estimator Budget Calculations
app.post('/api/estimates', (req, res) => {
  const { roomType, nights, guests, season, addons, minBudget, maxBudget } = req.body;

  if (!roomType || !minBudget || !maxBudget) {
    return res.status(400).json({ error: 'Accommodation type and estimated budget ranges are required.' });
  }

  const addonsString = Array.isArray(addons) ? addons.join(', ') : (addons || '');

  const query = `
    INSERT INTO estimates (roomType, nights, guests, season, addons, minBudget, maxBudget)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [roomType, nights, guests, season, addonsString, minBudget, maxBudget], function (err) {
    if (err) {
      console.error('Error inserting estimate:', err.message);
      return res.status(500).json({ error: 'Failed to save budget calculation.' });
    }

    res.status(201).json({
      message: 'Budget estimate saved successfully.',
      id: this.lastID
    });
  });
});


// --- GLOBAL SETTINGS APIS ---
app.get('/api/settings', (req, res) => {
  db.all(`SELECT * FROM settings`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(row => { settings[row.key] = row.value; });
    res.json(settings);
  });
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const settings = req.body;
  db.serialize(() => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`);
    Object.entries(settings).forEach(([key, value]) => {
      stmt.run(key, String(value));
    });
    stmt.finalize((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update settings.' });
      }
      logActivity('Update Company Settings', 'Updated company profile and contact settings.', req.user.username);
      res.json({ message: 'Settings updated successfully.' });
    });
  });
});


// --- PAGE CONTENT CMS APIS ---
app.get('/api/content/:pageId', (req, res) => {
  const { pageId } = req.params;
  db.all(`SELECT * FROM page_content WHERE page_id = ?`, [pageId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const content = {};
    rows.forEach(row => {
      if (!content[row.section_id]) content[row.section_id] = {};
      content[row.section_id][row.element_id] = row.content_value;
    });
    res.json(content);
  });
});

app.put('/api/content/:pageId', authenticateToken, (req, res) => {
  const { pageId } = req.params;
  const sections = req.body;
  db.serialize(() => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO page_content (page_id, section_id, element_id, content_value) VALUES (?, ?, ?, ?)`);
    Object.entries(sections).forEach(([sectionId, elements]) => {
      Object.entries(elements).forEach(([elementId, value]) => {
        stmt.run(pageId, sectionId, elementId, String(value));
      });
    });
    stmt.finalize((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update page content.' });
      }
      logActivity('Update Page Content', `Edited text elements on the ${pageId} page.`, req.user.username);
      res.json({ message: `Page content for ${pageId} updated successfully.` });
    });
  });
});


// --- SERVICES APIS ---
app.get('/api/services', (req, res) => {
  db.all(`SELECT * FROM services ORDER BY display_order ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsedRows = rows.map(row => ({
      ...row,
      features: row.features ? JSON.parse(row.features) : [],
      target_audience: row.target_audience ? JSON.parse(row.target_audience) : []
    }));
    res.json(parsedRows);
  });
});

app.post('/api/services', authenticateToken, (req, res) => {
  const { name, description, scope, cta_text, image_url, is_visible, display_order, features, target_audience, subtitle, coords } = req.body;
  const query = `
    INSERT INTO services (name, description, scope, cta_text, image_url, is_visible, display_order, features, target_audience, subtitle, coords)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const featStr = Array.isArray(features) ? JSON.stringify(features) : '[]';
  const audStr = Array.isArray(target_audience) ? JSON.stringify(target_audience) : '[]';
  db.run(query, [name, description, scope, cta_text, image_url, is_visible ?? 1, display_order ?? 0, featStr, audStr, subtitle, coords], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Create Service', `Created new experience: ${name}`, req.user.username);
    res.status(201).json({ id: this.lastID, message: 'Experience created successfully.' });
  });
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, scope, cta_text, image_url, is_visible, display_order, features, target_audience, subtitle, coords } = req.body;
  const query = `
    UPDATE services
    SET name = ?, description = ?, scope = ?, cta_text = ?, image_url = ?, is_visible = ?, display_order = ?, features = ?, target_audience = ?, subtitle = ?, coords = ?
    WHERE id = ?
  `;
  const featStr = Array.isArray(features) ? JSON.stringify(features) : '[]';
  const audStr = Array.isArray(target_audience) ? JSON.stringify(target_audience) : '[]';
  db.run(query, [name, description, scope, cta_text, image_url, is_visible, display_order, featStr, audStr, subtitle, coords, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Update Service', `Modified experience details for: ${name}`, req.user.username);
    res.json({ message: 'Experience updated successfully.' });
  });
});

app.delete('/api/services/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get(`SELECT name FROM services WHERE id = ?`, [id], (err, service) => {
    if (err || !service) return res.status(404).json({ error: 'Experience not found.' });
    db.run(`DELETE FROM services WHERE id = ?`, [id], function (delErr) {
      if (delErr) return res.status(500).json({ error: delErr.message });
      logActivity('Delete Experience', `Permanently deleted experience: ${service.name}`, req.user.username);
      res.json({ message: 'Experience deleted successfully.' });
    });
  });
});


// --- PROJECTS (ACCOMMODATIONS) APIS ---
app.get('/api/projects', (req, res) => {
  db.all(`SELECT * FROM projects ORDER BY display_order ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsedRows = rows.map(row => ({
      ...row,
      specs: row.specs ? JSON.parse(row.specs) : {},
      gallery: row.gallery ? JSON.parse(row.gallery) : []
    }));
    res.json(parsedRows);
  });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { catalog, title, category, image_url, location, coords, specs, description, gallery, is_featured, is_visible, display_order } = req.body;
  const query = `
    INSERT INTO projects (catalog, title, category, image_url, location, coords, specs, description, gallery, is_featured, is_visible, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const specsStr = specs ? JSON.stringify(specs) : '{}';
  const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : '[]';
  db.run(query, [catalog, title, category, image_url, location, coords, specsStr, description, galleryStr, is_featured ?? 0, is_visible ?? 1, display_order ?? 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Create Accommodation', `Created new sanctuary: ${title}`, req.user.username);
    res.status(201).json({ id: this.lastID, message: 'Accommodation created successfully.' });
  });
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { catalog, title, category, image_url, location, coords, specs, description, gallery, is_featured, is_visible, display_order } = req.body;
  const query = `
    UPDATE projects
    SET catalog = ?, title = ?, category = ?, image_url = ?, location = ?, coords = ?, specs = ?, description = ?, gallery = ?, is_featured = ?, is_visible = ?, display_order = ?
    WHERE id = ?
  `;
  const specsStr = specs ? JSON.stringify(specs) : '{}';
  const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : '[]';
  db.run(query, [catalog, title, category, image_url, location, coords, specsStr, description, galleryStr, is_featured, is_visible, display_order, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Update Accommodation', `Modified accommodation: ${title}`, req.user.username);
    res.json({ message: 'Accommodation updated successfully.' });
  });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get(`SELECT title FROM projects WHERE id = ?`, [id], (err, project) => {
    if (err || !project) return res.status(404).json({ error: 'Accommodation not found.' });
    db.run(`DELETE FROM projects WHERE id = ?`, [id], function (delErr) {
      if (delErr) return res.status(500).json({ error: delErr.message });
      logActivity('Delete Accommodation', `Deleted accommodation: ${project.title}`, req.user.username);
      res.json({ message: 'Accommodation deleted successfully.' });
    });
  });
});


// --- TESTIMONIALS APIS ---
app.get('/api/testimonials', (req, res) => {
  db.all(`SELECT * FROM testimonials ORDER BY display_order ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/testimonials', authenticateToken, (req, res) => {
  const { client_name, location, rating, review_text, is_visible, display_order } = req.body;
  const query = `
    INSERT INTO testimonials (client_name, location, rating, review_text, is_visible, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [client_name, location, rating ?? 5, review_text, is_visible ?? 1, display_order ?? 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Create Testimonial', `Added testimonial from ${client_name}`, req.user.username);
    res.status(201).json({ id: this.lastID, message: 'Testimonial created successfully.' });
  });
});

app.put('/api/testimonials/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { client_name, location, rating, review_text, is_visible, display_order } = req.body;
  const query = `
    UPDATE testimonials
    SET client_name = ?, location = ?, rating = ?, review_text = ?, is_visible = ?, display_order = ?
    WHERE id = ?
  `;
  db.run(query, [client_name, location, rating, review_text, is_visible, display_order, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Update Testimonial', `Edited testimonial from ${client_name}`, req.user.username);
    res.json({ message: 'Testimonial updated successfully.' });
  });
});

app.delete('/api/testimonials/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get(`SELECT client_name FROM testimonials WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Testimonial not found.' });
    db.run(`DELETE FROM testimonials WHERE id = ?`, [id], function (delErr) {
      if (delErr) return res.status(500).json({ error: delErr.message });
      logActivity('Delete Testimonial', `Deleted testimonial from ${row.client_name}`, req.user.username);
      res.json({ message: 'Testimonial deleted successfully.' });
    });
  });
});


// --- MEDIA LIBRARY APIS ---
app.get('/api/media', (req, res) => {
  db.all(`SELECT * FROM media ORDER BY uploaded_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/media/upload', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file was uploaded.' });
  
  const category = req.body.category || 'general';
  let filepath;
  let size = req.file.size;
  
  if (isPostgres) {
    // Serverless mode: Optimize image in memory using Sharp and save as base64 string directly in database
    try {
      let imageBuffer = req.file.buffer;
      
      if (req.file.mimetype.startsWith('image/')) {
        let pipeline = sharp(imageBuffer)
          .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true });
        
        if (req.file.mimetype === 'image/png') {
          pipeline = pipeline.png({ quality: 75, compressionLevel: 8 });
        } else if (req.file.mimetype === 'image/webp') {
          pipeline = pipeline.webp({ quality: 75 });
        } else {
          pipeline = pipeline.jpeg({ quality: 75, progressive: true });
        }
        
        imageBuffer = await pipeline.toBuffer();
        size = imageBuffer.length;
      }
      
      const base64Data = imageBuffer.toString('base64');
      filepath = `data:${req.file.mimetype};base64,${base64Data}`;
    } catch (err) {
      console.error('Sharp in-memory image optimization failed, using original file buffer:', err);
      const base64Data = req.file.buffer.toString('base64');
      filepath = `data:${req.file.mimetype};base64,${base64Data}`;
    }
  } else {
    // Local SQLite mode: Save file to local uploads directory
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const originalPath = req.file.path;
        const tempPath = originalPath + '-opt';
        
        let pipeline = sharp(originalPath)
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true });
        
        if (req.file.mimetype === 'image/png') {
          pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
        } else if (req.file.mimetype === 'image/webp') {
          pipeline = pipeline.webp({ quality: 80 });
        } else {
          pipeline = pipeline.jpeg({ quality: 82, progressive: true });
        }
        
        await pipeline.toFile(tempPath);
        
        // Replace original file with compressed one
        fs.unlinkSync(originalPath);
        fs.renameSync(tempPath, originalPath);
        
        // Update file size metadata
        const stats = fs.statSync(originalPath);
        size = stats.size;
      } catch (err) {
        console.error('Sharp image optimization failed, using original file:', err);
      }
    }
    filepath = `/uploads/${req.file.filename}`;
  }

  const query = `
    INSERT INTO media (filename, filepath, mimetype, size, category)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [req.file.originalname, filepath, req.file.mimetype, size, category], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    logActivity('Media Upload', `Uploaded image: ${req.file.originalname}`, req.user.username);
    res.status(201).json({
      id: this.lastID,
      filename: req.file.originalname,
      filepath: filepath,
      message: 'File uploaded successfully.'
    });
  });
});


app.delete('/api/media/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM media WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Media not found.' });
    
    if (isPostgres) {
      // Serverless: No local file to unlink
      db.run(`DELETE FROM media WHERE id = ?`, [id], function (delErr) {
        if (delErr) return res.status(500).json({ error: delErr.message });
        logActivity('Media Delete', `Deleted media file: ${row.filename}`, req.user.username);
        res.json({ message: 'Media file deleted successfully.' });
      });
    } else {
      // Local: Delete file from local disk
      const filepathOnDisk = join(__dirname, row.filepath.replace('/uploads/', 'uploads/'));
      fs.unlink(filepathOnDisk, (unlinkErr) => {
        if (unlinkErr) console.warn('Could not delete file from disk:', unlinkErr.message);
        
        db.run(`DELETE FROM media WHERE id = ?`, [id], function (delErr) {
          if (delErr) return res.status(500).json({ error: delErr.message });
          logActivity('Media Delete', `Deleted media file: ${row.filename}`, req.user.username);
          res.json({ message: 'Media file deleted successfully.' });
        });
      });
    }
  });
});


// --- AUTHENTICATION APIS ---

// Admin Login (Protected by rate limiting)
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], (err, user) => {
    if (err) {
      console.error('Login database error:', err.message);
      return res.status(500).json({ error: 'An error occurred during authentication.' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
});

// Check Session / Current User
app.get('/api/admin/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


// --- ADMIN APIS (SECURED) ---

// 1. Retrieve all Inquiries (sorted newest first)
app.get('/api/admin/inquiries', authenticateToken, (req, res) => {
  const query = `SELECT * FROM inquiries ORDER BY created_at DESC`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching inquiries:', err.message);
      return res.status(500).json({ error: 'Failed to fetch inquiries.' });
    }
    res.json(rows);
  });
});

// 2. Update Inquiry Status (Pending -> Contacted -> Booked)
app.put('/api/admin/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const query = `UPDATE inquiries SET status = ? WHERE id = ?`;

  db.run(query, [status, id], function (err) {
    if (err) {
      console.error('Error updating status:', err.message);
      return res.status(500).json({ error: 'Failed to update inquiry status.' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    logActivity('Update Lead Status', `Updated lead status to ${status}.`, req.user.username);

    res.json({ message: 'Inquiry status updated successfully.' });
  });
});

// 3. Delete Inquiry
app.delete('/api/admin/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM inquiries WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error('Error deleting inquiry:', err.message);
      return res.status(500).json({ error: 'Failed to delete inquiry.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    logActivity('Delete Lead', `Deleted lead record ID: ${id}`, req.user.username);

    res.json({ message: 'Inquiry deleted successfully.' });
  });
});

// 4. Get Admin Dashboard Metrics
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  const stats = {
    totalInquiries: 0,
    pendingInquiries: 0,
    contactedInquiries: 0,
    bookedInquiries: 0,
    totalEstimates: 0,
    averageMinEstimate: 0,
    averageMaxEstimate: 0,
    activeProjects: 0,
    completedProjects: 0,
    lastContentUpdate: '',
    roomBreakdown: {},
    seasonBreakdown: {}
  };

  db.serialize(() => {
    // 1. Inquiry counts by status
    db.all(`SELECT status, COUNT(*) as count FROM inquiries GROUP BY status`, [], (err, rows) => {
      if (err) console.error(err);
      if (rows) {
        rows.forEach(row => {
          const count = row.count;
          stats.totalInquiries += count;
          if (row.status === 'Pending') stats.pendingInquiries = count;
          else if (row.status === 'Contacted') stats.contactedInquiries = count;
          else if (row.status === 'Booked') stats.bookedInquiries = count;
        });
      }
    });

    // 2. Estimate counts and budget averages
    db.get(`SELECT COUNT(*) as count, AVG(minBudget) as avgMin, AVG(maxBudget) as avgMax FROM estimates`, [], (err, row) => {
      if (err) console.error(err);
      if (row) {
        stats.totalEstimates = row.count || 0;
        stats.averageMinEstimate = Math.round(row.avgMin || 0);
        stats.averageMaxEstimate = Math.round(row.avgMax || 0);
      }
    });

    // 3. Project counts (active vs completed)
    db.get(`
      SELECT 
        SUM(case when is_visible = 1 then 1 else 0 end) as active,
        SUM(case when is_visible = 0 then 1 else 0 end) as completed
      FROM projects
    `, [], (err, row) => {
      if (err) console.error(err);
      if (row) {
        stats.activeProjects = row.active || 0;
        stats.completedProjects = row.completed || 0;
      }
    });

    // 4. Last content update timestamp from activity logs
    db.get(`SELECT timestamp FROM activity_logs ORDER BY timestamp DESC LIMIT 1`, [], (err, row) => {
      if (err) console.error(err);
      if (row && row.timestamp) {
        stats.lastContentUpdate = row.timestamp;
      } else {
        stats.lastContentUpdate = new Date().toISOString();
      }
    });

    // 5. Accommodation counts breakdown from inquiries
    db.all(`SELECT eventType, COUNT(*) as count FROM inquiries GROUP BY eventType`, [], (err, rows) => {
      if (err) console.error(err);
      if (rows) {
        rows.forEach(row => {
          stats.roomBreakdown[row.eventType] = row.count;
        });
      }
    });

    // 6. Season count breakdown from estimates
    db.all(`SELECT season, COUNT(*) as count FROM estimates WHERE season IS NOT NULL GROUP BY season`, [], (err, rows) => {
      if (err) console.error(err);
      if (rows) {
        rows.forEach(row => {
          stats.seasonBreakdown[row.season] = row.count;
        });
      }
      res.json(stats);
    });
  });
});

// 5. Get Activity Logs (Secured)
app.get('/api/admin/logs', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100`, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch logs.' });
    }
    res.json(rows);
  });
});

// Catch-all route to serve the React frontend index.html for client-side routing in production
if (fs.existsSync(distDir)) {
  app.get('*', (req, res, next) => {
    // Skip if it is an API call or request for uploaded static media
    if (req.url.startsWith('/api') || req.url.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(join(distDir, 'index.html'));
  });
}

// Global error handling middleware for handling multer errors and general server errors securely without exposing stack traces
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Maximum size allowed is 10MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Aura Cove luxury backend running on http://localhost:${PORT}`);
  });
}

export default app;
