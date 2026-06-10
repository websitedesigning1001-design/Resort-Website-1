import sqlite3 from 'sqlite3';
import pkg from 'pg';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const isPostgres = !!process.env.DATABASE_URL;
let db;

if (isPostgres) {
  console.log('Using PostgreSQL database client (Neon/Supabase)...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Query translation helper to run SQLite-style queries on PostgreSQL
  const translateQuery = (sql) => {
    let query = sql;
    
    // 1. Replace SQLite auto-increment syntax
    query = query.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
    
    // 2. Replace SQLite DATETIME with PostgreSQL TIMESTAMP
    query = query.replace(/\bDATETIME\b/gi, 'TIMESTAMP');
    
    // 3. Replace INSERT OR REPLACE / INSERT OR IGNORE with PostgreSQL upserts
    if (query.toUpperCase().includes('INSERT OR REPLACE INTO SETTINGS')) {
      query = `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
    } else if (query.toUpperCase().includes('INSERT OR REPLACE INTO PAGE_CONTENT')) {
      query = `INSERT INTO page_content (page_id, section_id, element_id, content_value) VALUES ($1, $2, $3, $4) ON CONFLICT (page_id, section_id, element_id) DO UPDATE SET content_value = EXCLUDED.content_value`;
    } else if (query.toUpperCase().includes('INSERT OR IGNORE INTO PAGE_CONTENT')) {
      query = `INSERT INTO page_content (page_id, section_id, element_id, content_value) VALUES ($1, $2, $3, $4) ON CONFLICT (page_id, section_id, element_id) DO NOTHING`;
    }
    
    // 4. Replace SQLite placeholder ? with PostgreSQL placeholder $1, $2, $3...
    let paramCounter = 0;
    query = query.replace(/\?/g, () => `$${++paramCounter}`);
    
    // 5. Append RETURNING id for non-conflict INSERT queries to mimic SQLite's lastID behavior
    if (query.trim().toUpperCase().startsWith('INSERT INTO ') && !query.toUpperCase().includes('RETURNING')) {
      if (!query.toUpperCase().includes('INTO SETTINGS') && !query.toUpperCase().includes('INTO PAGE_CONTENT')) {
        query += ' RETURNING id';
      }
    }
    
    return query;
  };

  db = {
    all(sql, params, cb) {
      if (typeof params === 'function') {
        cb = params;
        params = [];
      }
      const pgSql = translateQuery(sql);
      pool.query(pgSql, params, (err, res) => {
        if (cb) cb(err, res ? res.rows : null);
      });
    },
    
    get(sql, params, cb) {
      if (typeof params === 'function') {
        cb = params;
        params = [];
      }
      const pgSql = translateQuery(sql);
      pool.query(pgSql, params, (err, res) => {
        if (cb) cb(err, res && res.rows.length > 0 ? res.rows[0] : null);
      });
    },
    
    run(sql, params, cb) {
      if (typeof params === 'function') {
        cb = params;
        params = [];
      }
      const pgSql = translateQuery(sql);
      pool.query(pgSql, params, function (err, res) {
        const context = {
          lastID: res && res.rows && res.rows[0] ? res.rows[0].id : 0,
          changes: res ? res.rowCount : 0
        };
        if (cb) cb.call(context, err);
      });
    },
    
    serialize(cb) {
      cb();
    },
    
    prepare(sql) {
      const pgSql = translateQuery(sql);
      return {
        run(params, cb) {
          if (typeof params === 'function') {
            cb = params;
            params = [];
          }
          pool.query(pgSql, params, function (err, res) {
            const context = {
              lastID: res && res.rows && res.rows[0] ? res.rows[0].id : 0,
              changes: res ? res.rowCount : 0
            };
            if (cb) cb.call(context, err);
          });
        },
        finalize(cb) {
          if (cb) cb();
        }
      };
    }
  };
  
  setTimeout(() => {
    initializeTables();
  }, 0);
} else {
  console.log('Using SQLite local database...');
  const dbPath = join(__dirname, 'database.sqlite');
  const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database at:', dbPath);
      initializeTables();
    }
  });
  db = sqliteDb;
}

function initializeTables() {
  db.serialize(() => {
    // 1. Inquiries table (Leads)
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        eventType TEXT NOT NULL,
        guestCount INTEGER,
        date TEXT,
        details TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Estimates table
    db.run(`
      CREATE TABLE IF NOT EXISTS estimates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomType TEXT NOT NULL,
        nights INTEGER,
        guests INTEGER,
        season TEXT,
        addons TEXT,
        minBudget REAL,
        maxBudget REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Users table (Admin Login)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Seed default admin user if no users exist
      db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        if (err) return;
        if (row && row.count === 0) {
          const defaultUsername = 'admin';
          const defaultPassword = 'adminpassword123';
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(defaultPassword, salt);
          
          db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')",
            [defaultUsername, hash]
          );
        }
      });
    });

    // 4. Settings table (Global website settings)
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `, () => {
      // Seed default settings
      const defaultSettings = {
        site_name: "Aura Cove",
        site_tagline: "Heritage Lakefront Sanctuary",
        contact_email: "reservations@auracove.com",
        contact_phone: "+91 481 252 4000",
        contact_address: "Kumarakom, Kottayam, Kerala - 686563, India",
        instagram_url: "https://instagram.com/auracove",
        facebook_url: "https://facebook.com/auracove",
        footer_text: "© 2026 Aura Cove Sanctuary. All rights reserved.",
        logo_text: "Aura Cove",
        site_description: "Bespoke backwater heritage luxury resort & spa. Nestled along the serene waters of Vembanad Lake in Kumarakom, Kerala, offering a seamless blend of traditional architectural design, bespoke wellness, and fine lakeside dining.",
        seo_title: "Aura Cove Sanctuary - Heritage Luxury Resort & Spa Kumarakom",
        seo_description: "Immerse in private infinity pool villas, Ayurvedic healing arts, and Vembanad Lake sunset cruises in Kumarakom, Kerala.",
        seo_keywords: "luxury resort kerala, kumarakom resort, pool villa kumarakom, ayurveda retreat kerala, backwaters resort"
      };

      db.get("SELECT COUNT(*) as count FROM settings", [], (err, row) => {
        if (!err && row && row.count === 0) {
          const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
          Object.entries(defaultSettings).forEach(([k, v]) => {
            stmt.run(k, v);
          });
          stmt.finalize();
        }
      });
    });

    // 5. Services table (Experiences)
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        scope TEXT,
        cta_text TEXT,
        image_url TEXT,
        is_visible INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        features TEXT,
        target_audience TEXT,
        subtitle TEXT,
        coords TEXT
      )
    `, () => {
      db.get("SELECT COUNT(*) as count FROM services", [], (err, row) => {
        if (!err && row && row.count === 0) {
          const defaultServices = [
            {
              name: 'Ayurveda Sanctuary Retreat',
              description: 'The Ayurveda Sanctuary at Aura Cove is a quiet zone dedicated to natural restoration. Supervised by resident Ayurvedic physicians, we curate personalized Panchakarma and rejuvenation programs designed around your specific dosha blueprint.',
              scope: 'Every therapy utilizes organic medicated oils and herbal extracts prepared in-house using traditional processes. Experience synchronized four-hand massages, herb-infused steam wraps, and peaceful relaxation in wooden pavilions facing quiet gardens.',
              cta_text: 'Explore Programs',
              image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop',
              features: JSON.stringify([
                'Diagnostic consultations with Ayurvedic physicians',
                'Customized herbal oil treatments and massage schedules',
                'Silent therapy wings situated amidst medicinal gardens',
                'Daily wellness health tracking and post-stay remedies'
              ]),
              target_audience: JSON.stringify(['Wellness Seekers', 'Stress Relief', 'Rejuvenation Guests']),
              display_order: 1,
              subtitle: 'Restoring physiological alignment through ancient wisdom.',
              coords: 'THERAPY • 9.5931° N'
            },
            {
              name: 'Vembanad Sunset Cruises',
              description: 'Discover the heart of Kerala’s backwaters. Our private luxury houseboats (Kettuvallams) are crafted using ancient methods—hand-tied coir ropes and bamboo arches—offering contemporary suites with private sailing decks.',
              scope: 'Sail past quiet canal villages, vast paddy fields, and coconut groves as the sun dips below the lake. A private chef prepares traditional delicacies on board, providing a floating dining experience with butler service.',
              cta_text: 'Book a Cruise',
              image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop',
              features: JSON.stringify([
                'Bespoke sunset cruises and overnight lake journeys',
                'Dedicated private butler and on-board culinary chef',
                'Luxury air-conditioned bedroom suites with glass views',
                'Traditional hand-crafted wooden skiff tours of narrow canals'
              ]),
              target_audience: JSON.stringify(['Couples', 'Nature Lovers', 'Exclusive Groups']),
              display_order: 2,
              subtitle: 'Glide across silent waterways on a historic rice barge.',
              coords: 'NAVIGATION • VEMBANAD'
            },
            {
              name: 'Heritage Lakefront Gastronomy',
              description: 'Dining at Aura Cove is an exploration of local culture. Our open-air lakeside restaurant showcases traditional clay-pot slow cooking and wood-fire grilling, utilizing fresh ingredients sourced daily from the backwaters and our organic resort garden.',
              scope: 'Savor authentic banana-leaf Sadhyas, slow-cooked pearl spot (Karimeen Pollichathu), and locally infused spices. Every tablescape is designed with brass oil lamps and hand-woven details, providing a rich sensory experience.',
              cta_text: 'View Menu',
              image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
              features: JSON.stringify([
                'Authentic slow-cooked heritage recipes and seafood grills',
                'Organic ingredients harvested from our resort garden',
                'Lakeside tablescapes overlooking the water docks',
                'Private traditional culinary classes with our master chef'
              ]),
              target_audience: JSON.stringify(['Food Enthusiasts', 'Local Delicacy Lovers', 'Resort Guests']),
              display_order: 3,
              subtitle: 'Clay-pot cooking methods meeting contemporary culinary standards.',
              coords: 'CULINARY • LOCAL ART'
            },
            {
              name: 'Sunrise Yoga & Meditation',
              description: 'Start your mornings in absolute silence. Guided by certified instructors, our sunrise yoga and pranayama breathing sessions are hosted on wooden decks floating at the water’s edge, where the lake mist meets the early sun.',
              scope: 'We tailor practices to all experience levels, focusing on gentle alignment, breath awareness, and sound-based meditation. Restore mental clarity and align your bio-rhythms with the calming sounds of lapping backwater waves.',
              cta_text: 'Join Session',
              image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
              features: JSON.stringify([
                'Sunrise pranayama and guided alignment sessions',
                'Floating wooden yoga deck with 360-degree lake views',
                'Intimate group sizes to ensure personalized instruction',
                'Sound baths and mindfulness meditation at dusk'
              ]),
              target_audience: JSON.stringify(['Mindfulness Practitioners', 'All Skill Levels', 'Early Risers']),
              display_order: 4,
              subtitle: 'Awaken the senses on quiet waterfront decks.',
              coords: 'MINDFULNESS • WATERDECK'
            },
            {
              name: 'Private Pier Candlelight Dining',
              description: 'For celebrations that demand absolute intimacy, we coordinate private candlelight dining on our wooden pier. Extending over Vembanad Lake, the setting is decorated with white jasmines, antique oil lamps, and soft hanging glass lanterns.',
              scope: 'Savor a custom 5-course menu designed specifically for you by our master chef, paired with signature beverages. A classical sitar or flute player performs softly in the background, creating an unforgettable sensory memory.',
              cta_text: 'Reserve Table',
              image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
              features: JSON.stringify([
                'Private 5-course tailored menu with personal chef',
                'Exclusive layout on our water pier under the stars',
                'Bespoke floral design, candle setups, and lantern styling',
                'Live classical sitar or flute accompaniment'
              ]),
              target_audience: JSON.stringify(['Honeymooners', 'Anniversaries', 'Celebrations']),
              display_order: 5,
              subtitle: 'Bespoke tablescapes crafted on a private lake pier.',
              coords: 'BESPOKE • WATERFRONT'
            },
            {
              name: 'Naturalist Bird Sanctuary Tours',
              description: 'Bordering the Kumarakom Bird Sanctuary, Aura Cove is a habitat for rare migratory birds. Our resident naturalist guides you through canal walkways and marshy mangrove pathways to observe local fauna.',
              scope: 'Navigate the quiet bird sanctuary borders at sunrise in a wooden canoe, listening to bird calls and observing nesting spots. Learn about the delicate backwater ecosystem and conservation efforts protecting Kumarakom’s wetlands.',
              cta_text: 'Book Guided Tour',
              image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
              features: JSON.stringify([
                'Guided sunrise tours led by our resident naturalist',
                'Traditional wooden canoe tours of marshy bird habitats',
                'Observe Siberian cranes, herons, and rare waterbirds',
                'Botanical hikes highlighting native spice trees and plants'
              ]),
              target_audience: JSON.stringify(['Wildlife Photographers', 'Nature Enthusiasts', 'Families']),
              display_order: 6,
              subtitle: 'Explore tropical wetlands and local bird sanctuaries.',
              coords: 'EXPLORE • CANALS'
            }
          ];

          const stmt = db.prepare(`
            INSERT INTO services (name, description, scope, cta_text, image_url, features, target_audience, display_order, subtitle, coords)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          defaultServices.forEach(s => {
            stmt.run(s.name, s.description, s.scope, s.cta_text, s.image_url, s.features, s.target_audience, s.display_order, s.subtitle, s.coords);
          });
          stmt.finalize();
        }
      });
    });

    // 6. Projects table (Accommodations / Sanctuaries)
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        catalog TEXT,
        title TEXT NOT NULL,
        category TEXT,
        image_url TEXT,
        location TEXT,
        coords TEXT,
        specs TEXT,
        description TEXT,
        gallery TEXT,
        is_featured INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0
      )
    `, () => {
      db.get("SELECT COUNT(*) as count FROM projects", [], (err, row) => {
        if (!err && row && row.count === 0) {
          const defaultAccommodations = [
            {
              catalog: 'SANCTUARY N°01',
              title: 'The Vembanad Pool Villa',
              category: 'villas',
              image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
              location: 'Kumarakom, Kerala',
              coords: '9.5931° N, 76.4225° E',
              specs: JSON.stringify({ guests: '3 Guests', space: '1,800 sq ft', view: 'Private Infinity Pool' }),
              description: 'Our premier luxury villa, perched elegantly at the lake edge. Handcrafted from historic teakwood with traditional gabled ceilings, it offers a private infinity plunge pool, open-sky rain shower, and a wooden deck facing the sunset over Vembanad Lake.',
              gallery: JSON.stringify([
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
              ]),
              is_featured: 1,
              display_order: 1
            },
            {
              catalog: 'SANCTUARY N°04',
              title: 'Lakeside Heritage Suite',
              category: 'suites',
              image_url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop',
              location: 'Kumarakom, Kerala',
              coords: '9.5932° N, 76.4226° E',
              specs: JSON.stringify({ guests: '3 Guests', space: '1,200 sq ft', view: 'Private Open Courtyard' }),
              description: 'A stunning heritage suite built using authentic Tharavadu architecture. Unites antique copper details and hand-woven furnishings with a private open-air courtyard bath, offering pristine backwater views.',
              gallery: JSON.stringify([
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
              ]),
              is_featured: 1,
              display_order: 2
            },
            {
              catalog: 'SANCTUARY N°07',
              title: 'The Heritage Houseboat Suite',
              category: 'houseboats',
              image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
              location: 'Kumarakom Waters',
              coords: '9.5930° N, 76.4222° E',
              specs: JSON.stringify({ guests: '2 Guests', space: '950 sq ft', view: 'Private Sailing Deck' }),
              description: 'A private luxury suite aboard a traditional Kettuvallam (Kerala rice barge). Crafted with hand-tied coir ropes and bamboo arches, featuring a glass-enclosed air-conditioned bedroom, ensuite bath, and dedicated butler service.',
              gallery: JSON.stringify([
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop'
              ]),
              is_featured: 1,
              display_order: 3
            },
            {
              catalog: 'SANCTUARY N°09',
              title: 'Garden Lily Pond Room',
              category: 'rooms',
              image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
              location: 'Garden Sanctuary',
              coords: '9.5934° N, 76.4228° E',
              specs: JSON.stringify({ guests: '4 Guests', space: '1,400 sq ft', view: 'Lily Pond veranda' }),
              description: 'Encompassed by ancient mango trees and tropical flora. Features an outdoor jacuzzi, traditional Kerala wooden swing (Aattukattil) on the veranda, and direct views of a lotus-filled private lily pond.',
              gallery: JSON.stringify([
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop'
              ]),
              is_featured: 0,
              display_order: 4
            },
            {
              catalog: 'SANCTUARY N°12',
              title: 'Vembanad Presidential Villa',
              category: 'villas',
              image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop',
              location: 'Lakefront, Kumarakom',
              coords: '9.5935° N, 76.4230° E',
              specs: JSON.stringify({ guests: '4 Guests', space: '2,400 sq ft', view: 'Private 15m Infinity Pool' }),
              description: 'Our largest sanctuary villa. Combines two traditional pavilions with a grand lakeside terrace, private pool, dining pavilion, and dedicated round-the-clock butler service.',
              gallery: JSON.stringify([
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
              ]),
              is_featured: 1,
              display_order: 5
            },
            {
              catalog: 'SANCTUARY N°14',
              title: 'Anjili Heritage Suite',
              category: 'suites',
              image_url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
              location: 'Lakeside, Kumarakom',
              coords: '9.5933° N, 76.4227° E',
              specs: JSON.stringify({ guests: '2 Guests', space: '1,100 sq ft', view: 'Private Lake Deck' }),
              description: 'Constructed from Anjili (wild jackwood) logs, this suite features a high-pitched roof, brass details, an open-to-sky shower, and an expansive wooden deck that extends over the lake.',
              gallery: JSON.stringify([
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
              ]),
              is_featured: 0,
              display_order: 6
            }
          ];

          const stmt = db.prepare(`
            INSERT INTO projects (catalog, title, category, image_url, location, coords, specs, description, gallery, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          defaultAccommodations.forEach(p => {
            stmt.run(p.catalog, p.title, p.category, p.image_url, p.location, p.coords, p.specs, p.description, p.gallery, p.is_featured, p.display_order);
          });
          stmt.finalize();
        }
      });
    });

    // 7. Testimonials table
    db.run(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        location TEXT,
        rating INTEGER,
        review_text TEXT,
        is_visible INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0
      )
    `, () => {
      db.get("SELECT COUNT(*) as count FROM testimonials", [], (err, row) => {
        if (!err && row && row.count === 0) {
          const defaultTestimonials = [
            {
              client_name: 'Rajesh Kumar',
              location: 'Alappuzha',
              rating: 5,
              review_text: 'Aura Cove transformed our vision of a heritage stay into reality. The absolute serenity of the pool villas and their commitment to preserving traditional architecture gave us complete peace of mind.',
              display_order: 1
            },
            {
              client_name: 'Sarah Joseph',
              location: 'Kottayam',
              rating: 5,
              review_text: 'Exceptional service and outstanding attention to detail. The sunset cruise on Vembanad Lake was magical, and the staff treated us with unparalleled warmth and professionalism.',
              display_order: 2
            },
            {
              client_name: 'Thomas Abraham',
              location: 'Alappuzha',
              rating: 5,
              review_text: 'We were worried about booking from abroad, but the team at Aura Cove handled everything flawlessly. From private pier greetings to the Ayurvedic therapy, it was an unforgettable experience.',
              display_order: 3
            }
          ];

          const stmt = db.prepare(`
            INSERT INTO testimonials (client_name, location, rating, review_text, display_order)
            VALUES (?, ?, ?, ?, ?)
          `);
          defaultTestimonials.forEach(t => {
            stmt.run(t.client_name, t.location, t.rating, t.review_text, t.display_order);
          });
          stmt.finalize();
        }
      });
    });

    // 8. Media Library table
    db.run(`
      CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        mimetype TEXT,
        size INTEGER,
        category TEXT DEFAULT 'general',
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Activity Logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        action TEXT NOT NULL,
        details TEXT,
        user TEXT
      )
    `);

    // 10. Page Content CMS table
    db.run(`
      CREATE TABLE IF NOT EXISTS page_content (
        page_id TEXT,
        section_id TEXT,
        element_id TEXT,
        content_value TEXT,
        PRIMARY KEY (page_id, section_id, element_id)
      )
    `, () => {
      // Unconditionally seed new ratings section defaults if they are missing (for existing databases)
      const ratingsDefaults = [
        { page_id: 'home', section_id: 'ratings', element_id: 'tag', content_value: 'FEEDBACK // PLATFORM RATINGS' },
        { page_id: 'home', section_id: 'ratings', element_id: 'title', content_value: 'Join the Conversation' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform1_name', content_value: 'MakeMyTrip' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform1_score', content_value: '4.2/5' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform1_text', content_value: 'Very Good' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform2_name', content_value: 'Agoda' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform2_score', content_value: '8.5/10' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform2_text', content_value: 'Excellent' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform3_name', content_value: 'Booking.com' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform3_score', content_value: '8/10' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform3_text', content_value: 'Very Good' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform4_name', content_value: 'Google' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform4_score', content_value: '4.5/5' },
        { page_id: 'home', section_id: 'ratings', element_id: 'platform4_text', content_value: '1000+ Reviews' }
      ];
      const rstmt = db.prepare("INSERT OR IGNORE INTO page_content (page_id, section_id, element_id, content_value) VALUES (?, ?, ?, ?)");
      ratingsDefaults.forEach(pc => {
        rstmt.run(pc.page_id, pc.section_id, pc.element_id, pc.content_value);
      });
      rstmt.finalize();

      db.get("SELECT COUNT(*) as count FROM page_content", [], (err, row) => {
        if (!err && row && row.count === 0) {
          const defaultPageContent = [
            // Home Page
            { page_id: 'home', section_id: 'hero', element_id: 'title', content_value: 'CURATORS OF BREATHING ROOM' },
            { page_id: 'home', section_id: 'hero', element_id: 'subtitle', content_value: 'A luxury lakefront sanctuary in Kumarakom, Kerala' },
            { page_id: 'home', section_id: 'hero', element_id: 'bg_image', content_value: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1600&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'tag', content_value: 'THE AURA COVE PHILOSOPHY // SANCTUARY' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'title', content_value: 'Conscious Architecture Meets Ancient Healing' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'p1', content_value: 'Aura Cove was conceptualized as a living testament to Kerala\'s rich heritage. Constructed from centuries-old salvaged teakwood and antique brass, our design reflects authentic architectural traditions while providing breathing room from contemporary life.' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'p2', content_value: 'We combine restorative ayurvedic science, traditional lake navigation, and clay-pot slow gastronomy with modern luxury standards. Every experience is personalized by dedicated sanctuary hosts, ensuring your physical and mental alignment.' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'img1', content_value: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'img2', content_value: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'img3', content_value: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'img4', content_value: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'img5', content_value: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'philosophy', element_id: 'img6', content_value: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop' },
            
            // Home Page - Accommodations Header
            { page_id: 'home', section_id: 'accommodations', element_id: 'tag', content_value: 'ACCOMMODATIONS // RESERVES' },
            { page_id: 'home', section_id: 'accommodations', element_id: 'title', content_value: 'Signature Sanctuaries' },
            { page_id: 'home', section_id: 'accommodations', element_id: 'desc', content_value: 'Bespoke layouts providing breathing space. Staggered design cards that capture the unique atmosphere of each heritage suite.' },
            { page_id: 'home', section_id: 'accommodations', element_id: 'btn_text', content_value: 'View Rooms Archive' },
            
            // Home Page - Wellness
            { page_id: 'home', section_id: 'wellness', element_id: 'tag', content_value: 'EXPERIENCE // SIGNATURE WELLNESS' },
            { page_id: 'home', section_id: 'wellness', element_id: 'title', content_value: 'Heritage Wellness Retreats' },
            { page_id: 'home', section_id: 'wellness', element_id: 'desc', content_value: 'Immerse yourself in traditional Panchakarma detoxification, lakeside yoga classes, and custom Organic dietary programs supervised by Ayurvedic doctors.' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item1_catalog', content_value: 'WELLNESS RETREAT // 01' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item1_title', content_value: 'Panchakarma Detox Program' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item1_desc', content_value: 'A complete detoxification process using natural herbal pastes, synchronized hot oil massages, and custom steam baths to restore your body’s vital doshas.' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item1_image', content_value: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item1_location', content_value: 'Ayurveda Sanctuary' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item1_duration', content_value: '7 - 14 Days' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item2_catalog', content_value: 'WELLNESS RETREAT // 02' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item2_title', content_value: 'Lakeside Yoga & Rasayana' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item2_desc', content_value: 'Begin your mornings with guided pranayama and hatha yoga on our waterfront deck, complemented by anti-aging Rasayana herbal preparations and organic meals.' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item2_image', content_value: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item2_location', content_value: 'Vembanad Deck' },
            { page_id: 'home', section_id: 'wellness', element_id: 'item2_duration', content_value: '3 - 7 Days' },
            
            // Home Page - Pillars
            { page_id: 'home', section_id: 'pillars', element_id: 'tag', content_value: 'Resort Experiences' },
            { page_id: 'home', section_id: 'pillars', element_id: 'title', content_value: 'The Sanctuary Pillars' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item1_num', content_value: '01' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item1_title', content_value: 'Lakeside Living' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item1_desc', content_value: 'Impeccable local architecture meeting contemporary luxury. Our pool villas and wood pavilions invite you to drift away to the rhythm of Kumarakom.' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item2_num', content_value: '02' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item2_title', content_value: 'Bespoke Wellness' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item2_desc', content_value: 'Doctor-supervised healing regimes designed around your specific physiological blueprint. Pamper yourself with sanctuary herbs and organic diet structures.' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item3_num', content_value: '03' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item3_title', content_value: 'Lakeside Gastronomy' },
            { page_id: 'home', section_id: 'pillars', element_id: 'item3_desc', content_value: 'Fine lakeside dining featuring organic clay-pot culinary methods, fresh backwater seafood, and custom candlelight tablescapes.' },
            
            // Home Page - Affiliations
            { page_id: 'home', section_id: 'affiliations', element_id: 'tag', content_value: 'Exclusive Affiliations' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'title', content_value: 'Our Luxury Partners' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p1_name', content_value: 'VIRTUOSO' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p1_desc', content_value: 'Preferred Member' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p2_name', content_value: 'RELAIS & CHÂTEAUX' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p2_desc', content_value: 'Luxury Partner' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p3_name', content_value: 'CONDÉ NAST' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p3_desc', content_value: 'Johansens Recommended' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p4_name', content_value: 'LEADING HOTELS' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p4_desc', content_value: 'Of The World' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p5_name', content_value: 'AMEX FHR' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p5_desc', content_value: 'Fine Hotels & Resorts' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p6_name', content_value: 'TABLET HOTELS' },
            { page_id: 'home', section_id: 'affiliations', element_id: 'p6_desc', content_value: 'Plus Collection' },

            // Home Page - Ratings / Trust Section
            { page_id: 'home', section_id: 'ratings', element_id: 'tag', content_value: 'FEEDBACK // PLATFORM RATINGS' },
            { page_id: 'home', section_id: 'ratings', element_id: 'title', content_value: 'Join the Conversation' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform1_name', content_value: 'MakeMyTrip' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform1_score', content_value: '4.2/5' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform1_text', content_value: 'Very Good' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform2_name', content_value: 'Agoda' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform2_score', content_value: '8.5/10' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform2_text', content_value: 'Excellent' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform3_name', content_value: 'Booking.com' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform3_score', content_value: '8/10' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform3_text', content_value: 'Very Good' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform4_name', content_value: 'Google' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform4_score', content_value: '4.5/5' },
            { page_id: 'home', section_id: 'ratings', element_id: 'platform4_text', content_value: '1000+ Reviews' },

            // About (Heritage) Page
            { page_id: 'about', section_id: 'heritage', element_id: 'tag', content_value: 'OUR HERITAGE // L\'HISTOIRE' },
            { page_id: 'about', section_id: 'heritage', element_id: 'title', content_value: 'Curators of Heritage Luxury' },
            { page_id: 'about', section_id: 'heritage', element_id: 'p1', content_value: 'Aura Cove Resort & Spa was conceptualized with a single mission: to conserve Kerala’s heritage architecture and traditional Ayurvedic healing arts while delivering high-fidelity modern luxury.' },
            { page_id: 'about', section_id: 'heritage', element_id: 'p2', content_value: 'Rebuilt over five years using centuries-old teakwood and clay tiles salvaged from historic Tharavadus (traditional homesteads), our property stands as an architectural museum. Combined with doctor-led holistic therapies and lake cruises, Aura Cove offers a sensory retreat like no other.' },
            { page_id: 'about', section_id: 'heritage', element_id: 'image', content_value: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop' },
            
            // About Page - Timeline
            { page_id: 'about', section_id: 'timeline_header', element_id: 'tag', content_value: 'THE JOURNEY // TIMELINE' },
            { page_id: 'about', section_id: 'timeline_header', element_id: 'title', content_value: 'The Sanctuary Journey' },
            { page_id: 'about', section_id: 'timeline_header', element_id: 'desc', content_value: 'Scroll vertically to see the sequential process we execute to provide a relaxing and memorable stay experience.' },
            { page_id: 'about', section_id: 'step1', element_id: 'num', content_value: '01' },
            { page_id: 'about', section_id: 'step1', element_id: 'stage', content_value: 'Prior to Arrival' },
            { page_id: 'about', section_id: 'step1', element_id: 'title', content_value: 'stay customization' },
            { page_id: 'about', section_id: 'step1', element_id: 'desc', content_value: 'Stays at Aura Cove are entirely bespoke. We connect with you prior to arrival to design your room setup, Ayurvedic treatment plan, special meals, and pier transfers.' },
            { page_id: 'about', section_id: 'step2', element_id: 'num', content_value: '02' },
            { page_id: 'about', section_id: 'step2', element_id: 'stage', content_value: 'Sanctuary Arrival' },
            { page_id: 'about', section_id: 'step2', element_id: 'title', content_value: 'pier greeting' },
            { page_id: 'about', section_id: 'step2', element_id: 'desc', content_value: 'Gliding along Vembanad Lake, check-in begins at our private pier. Sip fresh organic coconut water as your personal sanctuary host guides you to your villa.' },
            { page_id: 'about', section_id: 'step3', element_id: 'num', content_value: '03' },
            { page_id: 'about', section_id: 'step3', element_id: 'stage', content_value: 'Lakeside Residence' },
            { page_id: 'about', section_id: 'step3', element_id: 'title', content_value: 'sensory rejuvenation' },
            { page_id: 'about', section_id: 'step3', element_id: 'desc', content_value: 'Immerse yourself daily in personalized spa schedules, lakeside yoga sessions, local fish specialties, and sunset houseboat sailing.' },
            { page_id: 'about', section_id: 'step4', element_id: 'num', content_value: '04' },
            { page_id: 'about', section_id: 'step4', element_id: 'stage', content_value: 'Departing Sanctuary' },
            { page_id: 'about', section_id: 'step4', element_id: 'title', content_value: 'mindful check-out' },
            { page_id: 'about', section_id: 'step4', element_id: 'desc', content_value: 'Depart fully restored. Receive a traditional farewell pier blessing, custom ayurvedic home-care remedies, and a luxury road transfer back to Kochi.' },
            
            // Services (Experiences) Page
            { page_id: 'services', section_id: 'header', element_id: 'tag', content_value: 'SANCTUARY EXPERIENCES // ACTIVITIES' },
            { page_id: 'services', section_id: 'header', element_id: 'title', content_value: 'The Rituals of Aura Cove' },
            { page_id: 'services', section_id: 'header', element_id: 'subtitle', content_value: 'Explore our curated series of slow-living experiences designed around local backwater traditions.' },
            
            // Portfolio (Rooms) Page
            { page_id: 'portfolio', section_id: 'header', element_id: 'tag', content_value: 'ROOMS & SUITES // ACCOMMODATIONS' },
            { page_id: 'portfolio', section_id: 'header', element_id: 'title', content_value: 'The Sanctuaries of Aura' },
            { page_id: 'portfolio', section_id: 'header', element_id: 'subtitle', content_value: 'Explore our curated selection of heritage pool villas, lakeside suites, and private luxury houseboats providing absolute breathing room.' },
            
            // Contact Page
            { page_id: 'contact', section_id: 'header', element_id: 'tag', content_value: 'ESTABLISH CONNECTION // RESERVATIONS' },
            { page_id: 'contact', section_id: 'header', element_id: 'title', content_value: 'Begin Your Sanctuary Stay' },
            { page_id: 'contact', section_id: 'header', element_id: 'subtitle', content_value: 'Connect with our reservation curators to coordinate your customized heritage experience.' },
            
            // Privacy Policy Page
            { page_id: 'privacy', section_id: 'header', element_id: 'title', content_value: 'PRIVACY POLICY' },
            { page_id: 'privacy', section_id: 'header', element_id: 'last_updated', content_value: 'Last Updated: June 1, 2026' },
            { page_id: 'privacy', section_id: 'section1', element_id: 'title', content_value: '1. Information We Collect' },
            { page_id: 'privacy', section_id: 'section1', element_id: 'desc', content_value: 'At Aura Cove, we respect the privacy of our sanctuary guests. When you submit inquiries through our online forms or engage in our stay curation planner tools, we collect identifying information such as your name, email address, phone number, and stay preference details. This information is utilized purely to curate custom staying proposals.' },
            { page_id: 'privacy', section_id: 'section2', element_id: 'title', content_value: '2. How We Use Your Details' },
            { page_id: 'privacy', section_id: 'section2', element_id: 'desc', content_value: 'We do not sell, trade, or distribute your private stay details to unauthorized third-party agencies. All guest files, accommodation selections, and wellness specifications are secured on encrypted clouds accessible only by our internal resort booking team and selected service execution partners.' },
            { page_id: 'privacy', section_id: 'section3', element_id: 'title', content_value: '3. Cookies & Analytical Data' },
            { page_id: 'privacy', section_id: 'section3', element_id: 'desc', content_value: 'Our digital gallery uses silent session cookies to register viewport coordinates, custom cursor actions, and navigation speeds. This aggregated statistics file does not identify individual names and is used solely to enhance the visual performance of our web animations.' },
            { page_id: 'privacy', section_id: 'section4', element_id: 'title', content_value: '4. Contact Legal Office' },
            { page_id: 'privacy', section_id: 'section4', element_id: 'desc', content_value: 'If you have questions regarding our data policies or request the complete deletion of your booking history files, please email us directly at legal@auracove.com.' },
            
            // Terms of Service Page
            { page_id: 'terms', section_id: 'header', element_id: 'title', content_value: 'TERMS OF SERVICE' },
            { page_id: 'terms', section_id: 'header', element_id: 'last_updated', content_value: 'Last Updated: June 1, 2026' },
            { page_id: 'terms', section_id: 'section1', element_id: 'title', content_value: '1. Reservations & Deposit' },
            { page_id: 'terms', section_id: 'section1', element_id: 'desc', content_value: 'To reserve a stay at Aura Cove, an initial booking deposit is required. This secures your villa or suite, spa appointments, and custom dining curations. Stays scheduled during peak seasons must be settled in full prior to check-in as per resort seasonal policies.' },
            { page_id: 'terms', section_id: 'section2', element_id: 'title', content_value: '2. Property Care & Heritage Integrity' },
            { page_id: 'terms', section_id: 'section2', element_id: 'desc', content_value: 'Aura Cove is constructed using historic, preserved Tharavadu structures and teakwood. Guests are requested to respect the physical integrity of the historical buildings and gardens. Any damage to traditional woodwork or installations will be subject to repair fees.' },
            { page_id: 'terms', section_id: 'section3', element_id: 'title', content_value: '3. Cancellation & Postponements' },
            { page_id: 'terms', section_id: 'section3', element_id: 'desc', content_value: 'Due to the highly bespoke nature of our spa therapies, cruises, and custom dining logistics, cancellations or reservation modifications must be submitted in writing at least 30 days prior to the scheduled arrival date to receive a refund or credit.' },
            { page_id: 'terms', section_id: 'section4', element_id: 'title', content_value: '4. Local Jurisdictions' },
            { page_id: 'terms', section_id: 'section4', element_id: 'desc', content_value: 'These terms are governed by and construed in accordance with the local laws of Kerala, India.' },
          ];

          const stmt = db.prepare(`
            INSERT OR IGNORE INTO page_content (page_id, section_id, element_id, content_value)
            VALUES (?, ?, ?, ?)
          `);
          defaultPageContent.forEach(pc => {
            stmt.run(pc.page_id, pc.section_id, pc.element_id, pc.content_value);
          });
          stmt.finalize();
        }
      });
    });

    console.log('Database tables initialized successfully.');
  });
}

export default db;
