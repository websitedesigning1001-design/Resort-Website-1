import React, { useState, useEffect, useRef } from 'react';
import PageTransition from '../components/PageTransition';
import CanvasParticles from '../components/CanvasParticles';
import { 
  Compass, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  User, 
  CheckCircle, 
  Clock, 
  X,
  Search,
  Filter,
  Lock,
  LogOut,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Upload,
  Info,
  Settings,
  Activity,
  FileText,
  Globe,
  ChevronLeft,
  Download,
  Layout,
  MessageSquare,
  Star
} from 'lucide-react';

const SECTION_ORDER = {
  home: ['hero', 'philosophy', 'accommodations', 'wellness', 'pillars', 'ratings'],
  about: ['heritage', 'timeline_header', 'step1', 'step2', 'step3', 'step4'],
  privacy: ['header', 'section1', 'section2', 'section3', 'section4'],
  terms: ['header', 'section1', 'section2', 'section3', 'section4']
};

const SECTION_LABELS = {
  // Home Page
  hero: { name: 'Hero Banner Section', icon: Layout },
  philosophy: { name: 'Philosophy Collage Section', icon: Layers },
  accommodations: { name: 'Accommodations Intro', icon: Layout },
  wellness: { name: 'Wellness Retreats Section', icon: Activity },
  pillars: { name: 'Sanctuary Pillars Section', icon: Info },
  ratings: { name: 'Trust & Ratings Section', icon: Star },
  
  // About Page
  heritage: { name: 'Heritage Narrative', icon: FileText },
  timeline_header: { name: 'Timeline Section Header', icon: Layout },
  step1: { name: 'Timeline Step 1: Customization', icon: Settings },
  step2: { name: 'Timeline Step 2: Pier Greeting', icon: Compass },
  step3: { name: 'Timeline Step 3: Rejuvenation', icon: Activity },
  step4: { name: 'Timeline Step 4: Mindful Check-out', icon: LogOut },
  
  // General Headers
  header: { name: 'Page Header & Description', icon: Layout },
  
  // Policy Sections
  section1: { name: 'Section 1 details', icon: FileText },
  section2: { name: 'Section 2 details', icon: FileText },
  section3: { name: 'Section 3 details', icon: FileText },
  section4: { name: 'Section 4 details', icon: FileText }
};

const FIELD_LABELS = {
  // Hero Section
  title: 'Section Heading / Title',
  subtitle: 'Subheading / Tagline',
  bg_image: 'Background Image URL',
  tag: 'Category Tag (Uppercase)',
  desc: 'Paragraph Description',
  btn_text: 'Button Text Label',
  
  // Philosophy Section
  p1: 'Philosophy Narrative - Part 1',
  p2: 'Philosophy Narrative - Part 2',
  img1: 'Center Pool Villa (Collage Image 1)',
  img2: 'Ayurveda Treatment (Collage Image 2)',
  img3: 'Lakeside Dining (Collage Image 3)',
  img4: 'Traditional Houseboat (Collage Image 4)',
  img5: 'Lily Pond Gardens (Collage Image 5)',
  img6: 'Sunset Cruise (Collage Image 6)',
  
  // Wellness Retreats
  item1_catalog: 'Retreat 1 Catalog Number',
  item1_title: 'Retreat 1 Title',
  item1_desc: 'Retreat 1 Description',
  item1_image: 'Retreat 1 Cover Image',
  item1_location: 'Retreat 1 Location',
  item1_duration: 'Retreat 1 Duration',
  
  item2_catalog: 'Retreat 2 Catalog Number',
  item2_title: 'Retreat 2 Title',
  item2_desc: 'Retreat 2 Description',
  item2_image: 'Retreat 2 Cover Image',
  item2_location: 'Retreat 2 Location',
  item2_duration: 'Retreat 2 Duration',
  
  // Sanctuary Pillars
  item1_num: 'Pillar 1 Number',
  item1_title: 'Pillar 1 Title',
  item1_desc: 'Pillar 1 Description',
  item2_num: 'Pillar 2 Number',
  item2_title: 'Pillar 2 Title',
  item2_desc: 'Pillar 2 Description',
  item3_num: 'Pillar 3 Number',
  item3_title: 'Pillar 3 Title',
  item3_desc: 'Pillar 3 Description',
  
  // Ratings Section
  platform1_name: 'Platform 1 - Name',
  platform1_score: 'Platform 1 - Score',
  platform1_text: 'Platform 1 - Label/Rating',
  platform2_name: 'Platform 2 - Name',
  platform2_score: 'Platform 2 - Score',
  platform2_text: 'Platform 2 - Label/Rating',
  platform3_name: 'Platform 3 - Name',
  platform3_score: 'Platform 3 - Score',
  platform3_text: 'Platform 3 - Label/Rating',
  platform4_name: 'Platform 4 - Name',
  platform4_score: 'Platform 4 - Score',
  platform4_text: 'Platform 4 - Label/Rating',
  
  // Timeline steps (About page)
  stage: 'Stage Name (e.g. Arrival)',
  num: 'Step Number (e.g. 01)',
  
  // General
  last_updated: 'Last Updated Date String',
  image: 'Main Section Image URL'
};

const CMS_GROUPS = {
  hero: [
    { title: 'Hero Content Text', fields: ['title', 'subtitle'] },
    { title: 'Hero Layout Background', fields: ['bg_image'] }
  ],
  philosophy: [
    { title: 'Philosophy Narrative Details', fields: ['tag', 'title', 'p1', 'p2'] },
    { title: 'Teakwood & Backwater Collage Images', fields: ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'] }
  ],
  accommodations: [
    { title: 'Accommodations Section Header Details', fields: ['tag', 'title', 'desc', 'btn_text'] }
  ],
  wellness: [
    { title: 'Wellness Section Header', fields: ['tag', 'title', 'desc'] },
    { title: 'Ayurvedic Retreat Item 1', fields: ['item1_catalog', 'item1_title', 'item1_location', 'item1_duration', 'item1_image', 'item1_desc'] },
    { title: 'Lakeside Yoga Item 2', fields: ['item2_catalog', 'item2_title', 'item2_location', 'item2_duration', 'item2_image', 'item2_desc'] }
  ],
  pillars: [
    { title: 'Pillars Header Details', fields: ['tag', 'title'] },
    { title: 'Sanctuary Pillar 1 Details', fields: ['item1_num', 'item1_title', 'item1_desc'] },
    { title: 'Sanctuary Pillar 2 Details', fields: ['item2_num', 'item2_title', 'item2_desc'] },
    { title: 'Sanctuary Pillar 3 Details', fields: ['item3_num', 'item3_title', 'item3_desc'] }
  ],
  ratings: [
    { title: 'Ratings Section Header', fields: ['tag', 'title'] },
    { title: 'Platform 1 - Rating Options', fields: ['platform1_name', 'platform1_score', 'platform1_text'] },
    { title: 'Platform 2 - Rating Options', fields: ['platform2_name', 'platform2_score', 'platform2_text'] },
    { title: 'Platform 3 - Rating Options', fields: ['platform3_name', 'platform3_score', 'platform3_text'] },
    { title: 'Platform 4 - Rating Options', fields: ['platform4_name', 'platform4_score', 'platform4_text'] }
  ]
};

const getSortedSections = (pageId, sections) => {
  const order = SECTION_ORDER[pageId] || [];
  return [...sections].sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
};

const getGroupsForSection = (sectionId, fieldsObj) => {
  const fieldsKeys = Object.keys(fieldsObj);
  const groupsConfig = CMS_GROUPS[sectionId];
  
  if (!groupsConfig) {
    return [{ title: 'General Content Details', fields: fieldsKeys }];
  }
  
  const groupedKeys = new Set();
  const groups = [];
  
  groupsConfig.forEach(g => {
    const validFields = g.fields.filter(f => fieldsKeys.includes(f));
    if (validFields.length > 0) {
      groups.push({ title: g.title, fields: validFields });
      validFields.forEach(f => groupedKeys.add(f));
    }
  });
  
  const leftovers = fieldsKeys.filter(f => !groupedKeys.has(f));
  if (leftovers.length > 0) {
    groups.push({ title: 'Additional Settings', fields: leftovers });
  }
  
  return groups;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const [notification, setNotification] = useState(null); // { message: '...', type: 'success' | 'error' }
  const notificationTimeoutRef = useRef(null);
  
  const showNotification = (message, type = 'success') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ message, type });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Override default window.alert with custom luxury notifications
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      if (!msg) return;
      const msgStr = String(msg);
      const isError = msgStr.toLowerCase().includes('error') || 
                      msgStr.toLowerCase().includes('failed') || 
                      msgStr.toLowerCase().includes('network');
      showNotification(msgStr, isError ? 'error' : 'success');
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);
  
  // Dashboard Metrics
  const [stats, setStats] = useState({
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
  });

  // Leads state
  const [inquiries, setInquiries] = useState([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilter, setLeadFilter] = useState('all');
  const [leadSort, setLeadSort] = useState('date_desc');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectFormMode, setProjectFormMode] = useState('list'); // list, add, edit
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    catalog: '',
    title: '',
    category: 'villas',
    image_url: '',
    location: '',
    coords: '',
    specs: { guests: '2 Guests', space: '1,000 sq ft', view: 'Lakeside' },
    description: '',
    gallery: [],
    is_featured: 0,
    is_visible: 1,
    display_order: 0
  });

  // Services state
  const [services, setServices] = useState([]);
  const [serviceFormMode, setServiceFormMode] = useState('list'); // list, add, edit
  const [selectedService, setSelectedService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    description: '',
    scope: '',
    cta_text: 'Explore',
    image_url: '',
    is_visible: 1,
    display_order: 0,
    features: [],
    target_audience: [],
    subtitle: '',
    coords: ''
  });
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newAudienceText, setNewAudienceText] = useState('');

  // Company Settings & SEO
  const [settings, setSettings] = useState({
    site_name: 'Aura Cove',
    site_tagline: 'Heritage Lakefront Sanctuary',
    contact_email: 'reservations@auracove.com',
    contact_phone: '+91 481 252 4000',
    whatsapp_number: '914812524000',
    contact_address: 'Kumarakom, Kottayam, Kerala - 686563, India',
    instagram_url: 'https://instagram.com/auracove',
    facebook_url: 'https://facebook.com/auracove',
    footer_text: '© 2026 Aura Cove Sanctuary. All rights reserved.',
    logo_text: 'Aura Cove',
    logo_url: '',
    show_logo_text: '1',
    logo_height: '35',
    home_marquee: 'Aura Cove Resort & Spa, Ayurveda Sanctuary Spa, Lakeside Pool Villas, Michelin Culinary Dining, Private Backwater Cruises, Heritage Tharavadu Suites',
    about_marquee: 'Condé Nast Traveler Gold List, Architectural Digest Highlights, Heritage Design Conservation Award, Top Luxury Resorts Asia',
    site_description: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_handle: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    ga_tracking_id: '',
    google_verification: ''
  });

  // CMS Pages editing
  const [cmsPages, setCmsPages] = useState([
    { id: 'home', name: 'Home', path: '/' },
    { id: 'about', name: 'About Us', path: '/about' },
    { id: 'services', name: 'Experiences', path: '/services' },
    { id: 'portfolio', name: 'Accommodations', path: '/portfolio' },
    { id: 'contact', name: 'Contact', path: '/contact' },
    { id: 'privacy', name: 'Privacy Policy', path: '/privacy' },
    { id: 'terms', name: 'Terms of Service', path: '/terms' }
  ]);
  const [selectedCmsPage, setSelectedCmsPage] = useState(null);
  const [cmsFormData, setCmsFormData] = useState({});
  const [activeCmsSection, setActiveCmsSection] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);


  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [testimonialFormMode, setTestimonialFormMode] = useState('add');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [testimonialFormData, setTestimonialFormData] = useState({
    client_name: '',
    location: '',
    rating: 5,
    review_text: '',
    is_visible: 1,
    display_order: 0
  });

  // Media Library state
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaCategory, setMediaCategory] = useState('general');
  const [mediaSearch, setMediaSearch] = useState('');
  const fileInputRef = useRef(null);
  const mainContentRef = useRef(null);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([]);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // ----------------------------------------------------
  // DATA FETCHING & API calls
  // ----------------------------------------------------
  const fetchData = async () => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      setToken(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch Dashboard Stats
      const resStats = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (resStats.status === 401 || resStats.status === 403) {
        handleLogout();
        throw new Error('Session expired. Please log in again.');
      }
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }

      // Fetch Inquiries (Leads)
      const resInq = await fetch('/api/admin/inquiries', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (resInq.ok) {
        const dataInq = await resInq.json();
        setInquiries(dataInq);
      }

      // Fetch Projects
      const resProj = await fetch('/api/projects');
      if (resProj.ok) {
        const dataProj = await resProj.json();
        setProjects(dataProj);
      }

      // Fetch Services
      const resServ = await fetch('/api/services');
      if (resServ.ok) {
        const dataServ = await resServ.json();
        setServices(dataServ);
      }

      // Fetch Testimonials
      const resTest = await fetch('/api/testimonials');
      if (resTest.ok) {
        const dataTest = await resTest.json();
        setTestimonials(dataTest);
      }

      // Fetch Settings
      const resSet = await fetch('/api/settings');
      if (resSet.ok) {
        const dataSet = await resSet.json();
        setSettings(prev => ({ ...prev, ...dataSet }));
      }

      // Fetch Media
      const resMedia = await fetch('/api/media');
      if (resMedia.ok) {
        const dataMedia = await resMedia.json();
        setMediaItems(dataMedia);
      }

      // Fetch Logs
      const resLogs = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (resLogs.ok) {
        const dataLogs = await resLogs.json();
        setActivityLogs(dataLogs);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not connect to the administrative server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTab, projectFormMode, serviceFormMode, selectedCmsPage, activeCmsSection]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  // ----------------------------------------------------
  // LEADS LOGIC
  // ----------------------------------------------------
  const handleUpdateLeadStatus = async (id, newStatus) => {
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
        fetchData();
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this inquiry record permanently?')) return;
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
        fetchData();
      }
    } catch (err) {
      alert('Error deleting lead: ' + err.message);
    }
  };

  const handleExportExcel = () => {
    const headers = ['Lead ID', 'Name', 'Email', 'Phone', 'Accommodation Type', 'Guest Count', 'Date', 'Details', 'Status', 'Submitted At'];
    const csvRows = [headers.join(',')];
    inquiries.forEach(inq => {
      const row = [
        inq.id,
        `"${inq.name.replace(/"/g, '""')}"`,
        `"${inq.email.replace(/"/g, '""')}"`,
        `"${(inq.phone || '').replace(/"/g, '""')}"`,
        `"${inq.eventType.replace(/"/g, '""')}"`,
        inq.guestCount || 0,
        `"${(inq.date || '').replace(/"/g, '""')}"`,
        `"${(inq.details || '').replace(/"/g, '""')}"`,
        `"${inq.status.replace(/"/g, '""')}"`,
        `"${inq.created_at}"`
      ];
      csvRows.push(row.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `leads_export_${Date.now()}.csv`);
    a.click();
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (inq.details && inq.details.toLowerCase().includes(leadSearch.toLowerCase()));
    const matchesFilter = leadFilter === 'all' || inq.status === leadFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (leadSort === 'date_desc') return new Date(b.created_at) - new Date(a.created_at);
    if (leadSort === 'date_asc') return new Date(a.created_at) - new Date(b.created_at);
    if (leadSort === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  // Drag & drop sorting for Accommodations
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reorderedProjects = [...projects];
    const [removed] = reorderedProjects.splice(draggedIndex, 1);
    reorderedProjects.splice(targetIndex, 0, removed);

    // Update display_order based on new index
    const updatedProjects = reorderedProjects.map((proj, idx) => ({
      ...proj,
      display_order: idx + 1
    }));

    setProjects(updatedProjects);

    const storedToken = localStorage.getItem('adminToken');
    try {
      const promises = updatedProjects.map(proj => {
        return fetch(`/api/projects/${proj.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({
            ...proj,
            specs: proj.specs || { guests: '2 Guests', space: '1,000 sq ft', view: 'Lakeside' },
            gallery: proj.gallery || [],
            display_order: proj.display_order
          })
        });
      });

      await Promise.all(promises);
      fetchData();
    } catch (err) {
      console.error('Failed to save reordered list:', err);
      alert('Failed to save new order on the server: ' + err.message);
    }
    
    setDraggedIndex(null);
  };

  const handleOpenAddProject = () => {
    setProjectFormData({
      catalog: '',
      title: '',
      category: 'villas',
      image_url: '',
      location: '',
      coords: '',
      specs: { guests: '2 Guests', space: '1,000 sq ft', view: 'Lakeside' },
      description: '',
      gallery: [],
      is_featured: 0,
      is_visible: 1,
      display_order: 0
    });
    setProjectFormMode('add');
    setActiveTab('projects');
  };

  const handleOpenEditProject = (proj) => {
    setSelectedProject(proj);
    setProjectFormData({
      catalog: proj.catalog || '',
      title: proj.title,
      category: proj.category || 'villas',
      image_url: proj.image_url || '',
      location: proj.location || '',
      coords: proj.coords || '',
      specs: proj.specs || { guests: '2 Guests', space: '1,000 sq ft', view: 'Lakeside' },
      description: proj.description || '',
      gallery: proj.gallery || [],
      is_featured: proj.is_featured || 0,
      is_visible: proj.is_visible !== undefined ? proj.is_visible : 1,
      display_order: proj.display_order || 0
    });
    setProjectFormMode('edit');
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem('adminToken');
    const method = projectFormMode === 'add' ? 'POST' : 'PUT';
    const url = projectFormMode === 'add' ? '/api/projects' : `/api/projects/${selectedProject.id}`;
    
    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(projectFormData)
      });
      if (res.ok) {
        const data = await res.json();
        if (projectFormMode === 'add') {
          setSelectedProject({ id: data.id, ...projectFormData });
          setProjectFormMode('edit');
        }
        alert('Accommodation saved successfully.');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save accommodation.');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this accommodation permanently?')) return;
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // SERVICES LOGIC
  // ----------------------------------------------------
  const handleOpenAddService = () => {
    setServiceFormData({
      name: '',
      description: '',
      scope: '',
      cta_text: 'Explore',
      image_url: '',
      is_visible: 1,
      display_order: 0,
      features: [],
      target_audience: [],
      subtitle: '',
      coords: ''
    });
    setServiceFormMode('add');
  };

  const handleOpenEditService = (serv) => {
    setSelectedService(serv);
    setServiceFormData({
      name: serv.name,
      description: serv.description || '',
      scope: serv.scope || '',
      cta_text: serv.cta_text || 'Explore',
      image_url: serv.image_url || '',
      is_visible: serv.is_visible !== undefined ? serv.is_visible : 1,
      display_order: serv.display_order || 0,
      features: serv.features || [],
      target_audience: serv.target_audience || [],
      subtitle: serv.subtitle || '',
      coords: serv.coords || ''
    });
    setServiceFormMode('edit');
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem('adminToken');
    const method = serviceFormMode === 'add' ? 'POST' : 'PUT';
    const url = serviceFormMode === 'add' ? '/api/services' : `/api/services/${selectedService.id}`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(serviceFormData)
      });
      if (res.ok) {
        const data = await res.json();
        if (serviceFormMode === 'add') {
          setSelectedService({ id: data.id, ...serviceFormData });
          setServiceFormMode('edit');
        }
        alert('Experience saved successfully.');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save experience.');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this experience permanently?')) return;
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Error deleting service: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // COMPANY SETTINGS & SEO LOGIC
  // ----------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Global settings saved successfully.');
        fetchData();
      }
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // CMS PAGES LOGIC
  // ----------------------------------------------------
  const handleOpenEditCmsPage = async (page) => {
    setSelectedCmsPage(page);
    try {
      const res = await fetch(`/api/content/${page.id}`);
      if (res.ok) {
        const data = await res.json();
        setCmsFormData(data);
        const sectionIds = Object.keys(data).filter(sid => sid !== 'affiliations');
        const sortedIds = getSortedSections(page.id, sectionIds);
        if (sortedIds.length > 0) {
          setActiveCmsSection(sortedIds[0]);
        } else {
          setActiveCmsSection('');
        }
      }
    } catch (err) {
      alert('Error fetching page content: ' + err.message);
    }
  };

  const handleSaveCmsPage = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/content/${selectedCmsPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(cmsFormData)
      });
      if (res.ok) {
        alert('Page CMS content updated successfully.');
        fetchData();
      }
    } catch (err) {
      alert('Error saving CMS page: ' + err.message);
    }
  };

  const handleUpdateCmsFormField = (sectionId, elementId, value) => {
    setCmsFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [elementId]: value
      }
    }));
  };

  // ----------------------------------------------------
  // TESTIMONIALS LOGIC
  // ----------------------------------------------------
  const handleOpenAddTestimonial = () => {
    setTestimonialFormData({
      client_name: '',
      location: '',
      rating: 5,
      review_text: '',
      is_visible: 1,
      display_order: 0
    });
    setTestimonialFormMode('add');
    setTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (test) => {
    setSelectedTestimonial(test);
    setTestimonialFormData({
      client_name: test.client_name,
      location: test.location || '',
      rating: test.rating || 5,
      review_text: test.review_text || '',
      is_visible: test.is_visible !== undefined ? test.is_visible : 1,
      display_order: test.display_order || 0
    });
    setTestimonialFormMode('edit');
    setTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem('adminToken');
    const method = testimonialFormMode === 'add' ? 'POST' : 'PUT';
    const url = testimonialFormMode === 'add' ? '/api/testimonials' : `/api/testimonials/${selectedTestimonial.id}`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(testimonialFormData)
      });
      if (res.ok) {
        setTestimonialModalOpen(false);
        fetchData();
      }
    } catch (err) {
      alert('Error saving testimonial: ' + err.message);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this client testimonial permanently?')) return;
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Error deleting testimonial: ' + err.message);
    }
  };

  const uploadImageInline = async (file, category = 'general') => {
    const storedToken = localStorage.getItem('adminToken');
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${storedToken}` },
        body: form
      });
      if (!res.ok) {
        throw new Error('Upload failed with status ' + res.status);
      }
      const data = await res.json();
      return data.filepath;
    } catch (err) {
      console.error('Inline upload failed:', err);
      throw err;
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storedToken = localStorage.getItem('adminToken');
    const form = new FormData();
    form.append('file', file);
    form.append('category', mediaCategory);

    setLoading(true);
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${storedToken}` },
        body: form
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('File upload failed.');
      }
    } catch (err) {
      alert('Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Delete this file permanently from disk?')) return;
    const storedToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Error deleting media: ' + err.message);
    }
  };

  const filteredMediaItems = mediaItems.filter(item => {
    const matchesCategory = item.category === mediaCategory;
    const matchesSearch = item.filename.toLowerCase().includes(mediaSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ----------------------------------------------------
  // UTILITY FORMATTERS
  // ----------------------------------------------------
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render Login page if not authenticated
  // Render Login page if not authenticated
  if (!token) {
    return (
      <PageTransition>
        <section 
          style={{
            padding: '160px 5% 100px',
            backgroundColor: 'var(--bg-primary)',
            minHeight: '100vh',
            color: 'var(--text-primary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 3
          }}
        >
          <CanvasParticles preset="stars" count={80} zIndex={1} opacityMax={0.4} />
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', zIndex: 2 }}>
            {/* Outer dashed card border (shifted back) */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '-10px',
              bottom: '-10px',
              border: '1px dashed var(--glass-border)',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            {/* Main card */}
            <div style={{ position: 'relative', padding: '45px 40px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', zIndex: 2 }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)', display: 'block', marginBottom: '10px', fontFamily: 'var(--sans)', fontWeight: 600 }}>
                  Aura Cove Admin Portal
                </span>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 500, textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
                  Admin <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Login</span>
                </h2>
              </div>

              {loginError && (
                <div style={{ border: '1px solid #ff4d4d', padding: '12px', backgroundColor: 'rgba(255, 77, 77, 0.05)', color: '#ff4d4d', borderRadius: '4px', marginBottom: '20px', fontSize: '12px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>
                    Username
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border-formal)', padding: '12px 15px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <User size={14} color="var(--accent-gold)" />
                    <input 
                      type="text" 
                      placeholder="Username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '13px', fontFamily: 'var(--sans)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>
                    Password
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border-formal)', padding: '12px 15px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <Lock size={14} color="var(--accent-gold)" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '13px', fontFamily: 'var(--sans)' }}
                    />
                  </div>
                </div>

                <div style={{ position: 'relative', width: '100%', marginTop: '10px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    right: '-4px',
                    bottom: '-4px',
                    border: '1px solid var(--accent-gold)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }} />
                  <button 
                    type="submit" 
                    style={{ 
                      position: 'relative',
                      width: '100%', 
                      padding: '14px', 
                      backgroundColor: 'var(--accent-gold)', 
                      color: 'var(--bg-primary)', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '1.5px', 
                      border: '1px solid var(--accent-gold)', 
                      cursor: 'pointer',
                      fontSize: '11px',
                      zIndex: 2,
                      fontFamily: 'var(--sans)'
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Luxury Dark Theme Admin Panel */}
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>
        
        {/* SIDEBAR */}
        <aside style={{ width: '260px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative', zIndex: 10, borderRight: '1px solid var(--border-formal)' }}>
          <div style={{ padding: '24px 30px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-formal)' }}>
            <span style={{ fontSize: '20px', fontFamily: 'var(--serif)', fontWeight: 600, color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Aura Cove Admin
            </span>
          </div>

          <nav style={{ flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Layers size={16} /> },
              { id: 'leads', label: 'Leads & Inquiries', icon: <User size={16} /> },
              { id: 'projects', label: 'Rooms & Suites', icon: <FileText size={16} /> },
              { id: 'services', label: 'Experiences', icon: <Compass size={16} /> },
              { id: 'company_settings', label: 'Company Profile', icon: <Settings size={16} /> },
              { id: 'cms_pages', label: 'Pages (CMS)', icon: <Layout size={16} /> },
              { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={16} /> },
              { id: 'media_library', label: 'Media Library', icon: <Upload size={16} /> },
              { id: 'seo_settings', label: 'SEO Settings', icon: <Globe size={16} /> },
              { id: 'activity_logs', label: 'Logs & Activity', icon: <Activity size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setProjectFormMode('list');
                  setServiceFormMode('list');
                  setSelectedCmsPage(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 30px',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(189, 160, 120, 0.08)' : 'none',
                  color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  width: '100%',
                  borderLeft: activeTab === tab.id ? '4px solid var(--accent-gold)' : '4px solid transparent',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--sans)'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: '20px 30px', fontSize: '11px', color: 'rgba(255,255,255,0.15)', borderTop: '1px solid var(--border-formal)' }}>
            v1.0.0
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          
          {/* TOP HEADER */}
          <header style={{ height: '70px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-formal)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 40px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>karunjithvalyadathuveli@gmail.com</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Super Admin</span>
              </div>
              <button 
                onClick={handleLogout} 
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main ref={mainContentRef} className="admin-scroll-container" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
            
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '30px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Dashboard</h1>
                
                {/* Metric Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                  
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '24px 30px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>New Enquiries</span>
                      <div style={{ color: 'var(--accent-gold)', backgroundColor: 'rgba(189, 160, 120, 0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)' }}>{stats.pendingInquiries}</div>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>Total: {stats.totalInquiries}</span>
                  </div>
                   <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '24px 30px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Accommodations</span>
                      <div style={{ color: 'var(--accent-gold)', backgroundColor: 'rgba(189, 160, 120, 0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)' }}>{stats.activeProjects}</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '24px 30px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Hidden Listings</span>
                      <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)' }}>{stats.completedProjects}</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '24px 30px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Last Content Update</span>
                      <div style={{ color: 'var(--accent-gold)', backgroundColor: 'rgba(189, 160, 120, 0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '10px' }}>
                      {stats.lastContentUpdate ? formatDate(stats.lastContentUpdate) : '-'}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Check Logs for details</span>
                  </div>

                </div>

                {/* Quick Actions Panel */}
                <h2 style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '20px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                  
                  <div 
                    onClick={handleOpenAddProject}
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-formal)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ color: 'var(--accent-gold)', backgroundColor: 'rgba(189, 160, 120, 0.08)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      <Plus size={24} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Add Room / Suite</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Create a new accommodation listing</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('leads')}
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-formal)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ color: 'var(--accent-gold)', backgroundColor: 'rgba(189, 160, 120, 0.08)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      <User size={24} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>View Inquiries</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manage stay reservation requests</p>
                  </div>

                  <div 
                    onClick={() => {
                      setActiveTab('cms_pages');
                      const homePage = cmsPages.find(p => p.id === 'home');
                      if (homePage) handleOpenEditCmsPage(homePage);
                    }}
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-formal)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ color: 'var(--accent-gold)', backgroundColor: 'rgba(189, 160, 120, 0.08)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      <Layout size={24} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Edit Homepage</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Update banners, collages and content</p>
                  </div>

                </div>
              </div>
            )}

            {/* 2. LEADS TAB */}
            {activeTab === 'leads' && (
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '30px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Leads & Enquiries</h1>
                
                {/* Search & Filter bar */}
                <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '20px', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', gap: '20px', flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-formal)', padding: '8px 12px', flex: 1, backgroundColor: 'var(--bg-primary)' }}>
                      <Search size={14} color="var(--accent-gold)" />
                      <input 
                        type="text" 
                        placeholder="Search leads..." 
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Filter:</span>
                      <select
                        value={leadFilter}
                        onChange={(e) => setLeadFilter(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', fontFamily: 'var(--sans)' }}
                      >
                        <option value="all" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>All Statuses</option>
                        <option value="Pending" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Pending</option>
                        <option value="Contacted" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Contacted</option>
                        <option value="Booked" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Booked</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Sort by:</span>
                    <button 
                      onClick={() => setLeadSort(leadSort === 'date_desc' ? 'date_asc' : 'date_desc')}
                      style={{ padding: '8px 15px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--sans)' }}
                    >
                      Date {leadSort.startsWith('date') && (leadSort === 'date_desc' ? '↓' : '↑')}
                    </button>
                    <button 
                      onClick={() => setLeadSort('status')}
                      style={{ padding: '8px 15px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--sans)' }}
                    >
                      Status
                    </button>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                      <button 
                        onClick={handleExportExcel}
                        style={{ position: 'relative', padding: '8px 20px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: '1px solid var(--accent-gold)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, fontFamily: 'var(--sans)' }}
                      >
                        <Download size={14} />
                        Export Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Leads Table */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', overflowX: 'auto' }}>
                  {filteredInquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                      No leads found.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-formal)', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                          <th style={{ padding: '15px 20px' }}>Lead ID</th>
                          <th style={{ padding: '15px 20px' }}>Name</th>
                          <th style={{ padding: '15px 20px' }}>Phone</th>
                          <th style={{ padding: '15px 20px' }}>Room/Suite Type</th>
                          <th style={{ padding: '15px 20px' }}>Location</th>
                          <th style={{ padding: '15px 20px' }}>Date</th>
                          <th style={{ padding: '15px 20px' }}>Status</th>
                          <th style={{ padding: '15px 20px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInquiries.map((inq) => (
                          <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-formal)', verticalAlign: 'middle' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--accent-gold)' }}>#{inq.id}</td>
                            <td style={{ padding: '15px 20px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inq.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{inq.email}</div>
                            </td>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{inq.phone || '-'}</td>
                            <td style={{ padding: '15px 20px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, color: 'var(--accent-gold)' }}>{inq.eventType}</td>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{inq.date || 'Flexible'}</td>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{formatDate(inq.created_at)}</td>
                            <td style={{ padding: '15px 20px' }}>
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateLeadStatus(inq.id, e.target.value)}
                                style={{
                                  backgroundColor: 'var(--bg-primary)',
                                  color: inq.status === 'Booked' ? '#10b981' : inq.status === 'Contacted' ? '#d97706' : 'var(--text-secondary)',
                                  border: '1px solid var(--border-formal)',
                                  padding: '5px 10px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  outline: 'none',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--sans)'
                                }}
                              >
                                <option value="Pending" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Pending</option>
                                <option value="Contacted" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Contacted</option>
                                <option value="Booked" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Booked</option>
                              </select>
                            </td>
                            <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                              <button 
                                onClick={() => handleDeleteLead(inq.id)}
                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '6px' }}
                                title="Delete Lead"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* 3. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Rooms & Suites</h1>
                  {projectFormMode === 'list' && (
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                      <button 
                        onClick={handleOpenAddProject}
                        style={{ position: 'relative', padding: '10px 20px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: '1px solid var(--accent-gold)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, fontFamily: 'var(--sans)' }}
                      >
                        <Plus size={16} />
                        Add New Room
                      </button>
                    </div>
                  )}
                </div>

                {projectFormMode === 'list' ? (
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-formal)', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                          <th style={{ padding: '15px 20px', width: '40px' }}></th>
                          <th style={{ padding: '15px 20px' }}>Image</th>
                          <th style={{ padding: '15px 20px' }}>Title</th>
                          <th style={{ padding: '15px 20px' }}>Type</th>
                          <th style={{ padding: '15px 20px' }}>Location</th>
                          <th style={{ padding: '15px 20px' }}>Order</th>
                          <th style={{ padding: '15px 20px' }}>Visibility</th>
                          <th style={{ padding: '15px 20px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((proj, idx) => (
                          <tr 
                            key={proj.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragEnd={() => setDraggedIndex(null)}
                            style={{ 
                              borderBottom: '1px solid var(--border-formal)',
                              opacity: draggedIndex === idx ? 0.3 : 1,
                              cursor: 'grab',
                              backgroundColor: draggedIndex === idx ? 'rgba(189,160,120,0.05)' : 'transparent',
                              transition: 'opacity 0.2s ease, background-color 0.2s ease'
                            }}
                          >
                            <td style={{ padding: '15px 20px', color: 'rgba(189,160,120,0.4)', verticalAlign: 'middle', userSelect: 'none' }}>
                              <Layers size={14} style={{ cursor: 'grab' }} />
                            </td>
                            <td style={{ padding: '15px 20px' }}>
                              <img src={proj.image_url} alt={proj.title} style={{ width: '50px', height: '35px', objectFit: 'cover', border: '1px solid var(--border-formal)' }} />
                            </td>
                            <td style={{ padding: '15px 20px' }}>
                              <div 
                                onClick={() => handleOpenEditProject(proj)}
                                style={{ 
                                  fontWeight: 600, 
                                  color: 'var(--text-primary)', 
                                  cursor: 'pointer',
                                  transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                              >
                                {proj.title}
                              </div>
                              {proj.is_featured === 1 && <span style={{ fontSize: '9px', backgroundColor: 'rgba(189,160,120,0.1)', color: 'var(--accent-gold)', padding: '2px 6px', border: '1px solid rgba(189,160,120,0.2)', fontWeight: 700, marginTop: '4px', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured</span>}
                            </td>
                            <td style={{ padding: '15px 20px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{proj.category}</td>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{proj.location}</td>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{proj.display_order}</td>
                            <td style={{ padding: '15px 20px' }}>
                              <span style={{ fontSize: '11px', backgroundColor: proj.is_visible === 1 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', color: proj.is_visible === 1 ? '#10b981' : '#ef4444', border: proj.is_visible === 1 ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)', padding: '3px 8px', fontWeight: 600 }}>
                                {proj.is_visible === 1 ? 'Published' : 'Hidden'}
                              </span>
                            </td>
                            <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => handleOpenEditProject(proj)}
                                  style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: '6px' }}
                                  title="Edit Room/Suite"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProject(proj.id)}
                                  style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '6px' }}
                                  title="Delete Room/Suite"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Create / Edit Project Form */
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <button 
                      onClick={() => setProjectFormMode('list')}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', marginBottom: '25px', fontWeight: 600, fontFamily: 'var(--sans)' }}
                    >
                      <ChevronLeft size={16} />
                      Back to Rooms list
                    </button>
                    <h2 style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '25px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {projectFormMode === 'add' ? 'Add New Room / Suite' : 'Edit Room Details'}
                    </h2>
                    
                    <form onSubmit={handleSaveProject} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Room Title</label>
                          <input 
                            type="text" 
                            required 
                            value={projectFormData.title}
                            onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                            placeholder="Enter room/suite title"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Catalog Label</label>
                          <input 
                            type="text" 
                            value={projectFormData.catalog}
                            onChange={(e) => setProjectFormData({ ...projectFormData, catalog: e.target.value })}
                            placeholder="e.g. SANCTUARY N°01"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Category</label>
                          <select 
                            value={projectFormData.category}
                            onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          >
                            <option value="villas" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Villas</option>
                            <option value="suites" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Suites</option>
                            <option value="houseboats" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Houseboats</option>
                            <option value="rooms" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Rooms</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Location</label>
                          <input 
                            type="text" 
                            value={projectFormData.location}
                            onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                            placeholder="e.g. Kumarakom, Kerala"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Coordinates</label>
                          <input 
                            type="text" 
                            value={projectFormData.coords}
                            onChange={(e) => setProjectFormData({ ...projectFormData, coords: e.target.value })}
                            placeholder="e.g. 9.5931° N, 76.4225° E"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Specs</label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            <input 
                              type="text" 
                              placeholder="Guests (e.g. 3 Guests)" 
                              value={projectFormData.specs.guests || ''}
                              onChange={(e) => setProjectFormData({ ...projectFormData, specs: { ...projectFormData.specs, guests: e.target.value } })}
                              style={{ padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '12px', fontFamily: 'var(--sans)' }}
                            />
                            <input 
                              type="text" 
                              placeholder="Space (e.g. 1,800 sq ft)" 
                              value={projectFormData.specs.space || ''}
                              onChange={(e) => setProjectFormData({ ...projectFormData, specs: { ...projectFormData.specs, space: e.target.value } })}
                              style={{ padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '12px', fontFamily: 'var(--sans)' }}
                            />
                            <input 
                              type="text" 
                              placeholder="View (e.g. Sunset Pool)" 
                              value={projectFormData.specs.view || ''}
                              onChange={(e) => setProjectFormData({ ...projectFormData, specs: { ...projectFormData.specs, view: e.target.value } })}
                              style={{ padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '12px', fontFamily: 'var(--sans)' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Featured Image URL</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                              type="text" 
                              value={projectFormData.image_url}
                              onChange={(e) => setProjectFormData({ ...projectFormData, image_url: e.target.value })}
                              placeholder="URL from media library"
                              style={{ flex: 1, padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                            />
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '0 15px',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--accent-gold)',
                              color: 'var(--accent-gold)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                              fontFamily: 'var(--sans)',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.3s ease'
                            }}>
                              Upload
                              <Upload size={14} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  try {
                                    const path = await uploadImageInline(file, 'project');
                                    setProjectFormData(prev => ({ ...prev, image_url: path }));
                                  } catch (err) {
                                    alert('Upload failed: ' + err.message);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Gallery Image URLs (comma-separated)</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                              type="text" 
                              value={Array.isArray(projectFormData.gallery) ? projectFormData.gallery.join(', ') : ''}
                              onChange={(e) => setProjectFormData({ ...projectFormData, gallery: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                              placeholder="URL1, URL2, URL3"
                              style={{ flex: 1, padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                            />
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '0 15px',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--accent-gold)',
                              color: 'var(--accent-gold)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                              fontFamily: 'var(--sans)',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.3s ease'
                            }}>
                              Add Photo
                              <Upload size={14} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple={true}
                                style={{ display: 'none' }} 
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files);
                                  if (files.length === 0) return;
                                  setLoading(true);
                                  try {
                                    const uploadPromises = files.map(file => uploadImageInline(file, 'project'));
                                    const uploadedPaths = await Promise.all(uploadPromises);
                                    setProjectFormData(prev => {
                                      const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
                                      return { ...prev, gallery: [...currentGallery, ...uploadedPaths] };
                                    });
                                  } catch (err) {
                                    alert('Failed to upload some images: ' + err.message);
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Description</label>
                          <textarea 
                            rows={4}
                            value={projectFormData.description}
                            onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                            placeholder="Provide details about the stay..."
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Display Position (Sort order)</label>
                          <input 
                            type="number" 
                            value={projectFormData.display_order}
                            onChange={(e) => setProjectFormData({ ...projectFormData, display_order: parseInt(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '30px', margin: '15px 0' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>
                            <input 
                              type="checkbox" 
                              checked={projectFormData.is_featured === 1}
                              onChange={(e) => setProjectFormData({ ...projectFormData, is_featured: e.target.checked ? 1 : 0 })}
                            />
                            Featured Sanctuary
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>
                            <input 
                              type="checkbox" 
                              checked={projectFormData.is_visible === 1}
                              onChange={(e) => setProjectFormData({ ...projectFormData, is_visible: e.target.checked ? 1 : 0 })}
                            />
                            Visible on Website
                          </label>
                        </div>
                      </div>

                      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid var(--border-formal)', paddingTop: '20px' }}>
                        <button 
                          type="button" 
                          onClick={() => setProjectFormMode('list')}
                          style={{ padding: '10px 24px', border: '1px solid var(--border-formal)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        >
                          Cancel
                        </button>
                        <div style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                          <button 
                            type="submit" 
                            style={{ position: 'relative', padding: '10px 30px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', border: '1px solid var(--accent-gold)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, zIndex: 2, fontFamily: 'var(--sans)' }}
                          >
                            {projectFormMode === 'add' ? 'Create Room' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 4. SERVICES TAB */}
            {activeTab === 'services' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Experiences</h1>
                  {serviceFormMode === 'list' && (
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                      <button 
                        onClick={handleOpenAddService}
                        style={{ position: 'relative', padding: '10px 20px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: '1px solid var(--accent-gold)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, fontFamily: 'var(--sans)' }}
                      >
                        <Plus size={16} />
                        Add Experience
                      </button>
                    </div>
                  )}
                </div>

                {serviceFormMode === 'list' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {services.map((serv) => (
                      <div key={serv.id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                          <img src={serv.image_url} alt={serv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '10px', backgroundColor: serv.is_visible === 1 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', color: serv.is_visible === 1 ? '#10b981' : '#ef4444', border: serv.is_visible === 1 ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)', padding: '4px 10px', fontWeight: 600 }}>
                            {serv.is_visible === 1 ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)', marginBottom: '10px' }}>{serv.name}</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                            {serv.description ? serv.description.substring(0, 140) + '...' : ''}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-formal)', paddingTop: '15px' }}>
                            <button 
                              onClick={() => handleOpenEditService(serv)}
                              style={{ padding: '8px 16px', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', backgroundColor: 'transparent', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}
                            >
                              Edit Experience
                            </button>
                            <button 
                              onClick={() => handleDeleteService(serv.id)}
                              style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '6px' }}
                              title="Delete Experience"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Create / Edit Service Form */
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <button 
                      onClick={() => setServiceFormMode('list')}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', marginBottom: '25px', fontWeight: 600, fontFamily: 'var(--sans)' }}
                    >
                      <ChevronLeft size={16} />
                      Back to Experiences list
                    </button>
                    <h2 style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '25px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {serviceFormMode === 'add' ? 'Add New Experience' : 'Edit Experience Details'}
                    </h2>

                    <form onSubmit={handleSaveService} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Experience Name</label>
                          <input 
                            type="text" 
                            required 
                            value={serviceFormData.name}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                            placeholder="Enter experience name"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Intro Description</label>
                          <textarea 
                            rows={4}
                            value={serviceFormData.description}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                            placeholder="Overview paragraph..."
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Typical Scope</label>
                          <textarea 
                            rows={4}
                            value={serviceFormData.scope}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, scope: e.target.value })}
                            placeholder="Scope details..."
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>CTA Button Text</label>
                          <input 
                            type="text" 
                            value={serviceFormData.cta_text}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, cta_text: e.target.value })}
                            placeholder="e.g. Explore"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Subtitle (Tagline)</label>
                          <input 
                            type="text" 
                            value={serviceFormData.subtitle || ''}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, subtitle: e.target.value })}
                            placeholder="Bespoke tagline for the experience..."
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Coordinates Label</label>
                          <input 
                            type="text" 
                            value={serviceFormData.coords || ''}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, coords: e.target.value })}
                            placeholder="e.g. THERAPY • 9.5931° N"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Experience Image URL</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                              type="text" 
                              value={serviceFormData.image_url}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, image_url: e.target.value })}
                              placeholder="URL from media library"
                              style={{ flex: 1, padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                            />
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '0 15px',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--accent-gold)',
                              color: 'var(--accent-gold)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                              fontFamily: 'var(--sans)',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.3s ease'
                            }}>
                              Upload
                              <Upload size={14} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  try {
                                    const path = await uploadImageInline(file, 'service');
                                    setServiceFormData(prev => ({ ...prev, image_url: path }));
                                  } catch (err) {
                                    alert('Upload failed: ' + err.message);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div style={{ border: '1px solid var(--border-formal)', padding: '15px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)' }}>
                          <input 
                            type="checkbox" 
                            checked={serviceFormData.is_visible === 1}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, is_visible: e.target.checked ? 1 : 0 })}
                            id="service_vis"
                          />
                          <label htmlFor="service_vis" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>Visible on Website</label>
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Display Order (Position)</label>
                          <input 
                            type="number" 
                            value={serviceFormData.display_order}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, display_order: parseInt(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>What's Included (Features)</label>
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input 
                              type="text" 
                              value={newFeatureText}
                              onChange={(e) => setNewFeatureText(e.target.value)}
                              placeholder="Add feature item..."
                              style={{ flex: 1, padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                            />
                            <button 
                              type="button" 
                              onClick={() => {
                                if (newFeatureText.trim()) {
                                  setServiceFormData(prev => ({ ...prev, features: [...prev.features, newFeatureText.trim()] }));
                                  setNewFeatureText('');
                                }
                              }}
                              style={{ padding: '10px 16px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--sans)' }}
                            >
                              Add
                            </button>
                          </div>
                          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {serviceFormData.features.map((feat, idx) => (
                              <li key={idx} style={{ marginBottom: '6px' }}>
                                <span style={{ marginRight: '10px', color: 'var(--text-primary)' }}>{feat}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setServiceFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))}
                                  style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--sans)' }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid var(--border-formal)', paddingTop: '20px' }}>
                        <button 
                          type="button" 
                          onClick={() => setServiceFormMode('list')}
                          style={{ padding: '10px 24px', border: '1px solid var(--border-formal)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        >
                          Cancel
                        </button>
                        <div style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                          <button 
                            type="submit" 
                            style={{ position: 'relative', padding: '10px 30px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', border: '1px solid var(--accent-gold)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, zIndex: 2, fontFamily: 'var(--sans)' }}
                          >
                            {serviceFormMode === 'add' ? 'Create Experience' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 5. COMPANY SETTINGS */}
            {activeTab === 'company_settings' && (
              <div style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '30px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Company Profile Settings</h1>
                
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                  <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Site Brand Name</label>
                        <input 
                          type="text" 
                          required 
                          value={settings.site_name}
                          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Site Tagline</label>
                        <input 
                          type="text" 
                          required 
                          value={settings.site_tagline}
                          onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Reservations Email</label>
                        <input 
                          type="email" 
                          required 
                          value={settings.contact_email}
                          onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Contact Phone</label>
                        <input 
                          type="text" 
                          required 
                          value={settings.contact_phone}
                          onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>WhatsApp Number (with country code, e.g. 919876543210)</label>
                        <input 
                          type="text" 
                          value={settings.whatsapp_number || ''}
                          onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                          placeholder="e.g. 914812524000"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Sanctuary Address</label>
                        <textarea 
                          rows={3}
                          required 
                          value={settings.contact_address}
                          onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Instagram Link</label>
                        <input 
                          type="text" 
                          value={settings.instagram_url || ''}
                          onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Facebook Link</label>
                        <input 
                          type="text" 
                          value={settings.facebook_url || ''}
                          onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Logo Text (Brand)</label>
                        <input 
                          type="text" 
                          value={settings.logo_text || ''}
                          onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Logo Image (Resort Logo)</label>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={settings.logo_url || ''}
                            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            style={{ flex: 1, padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                          <label style={{ 
                            padding: '12px 20px', 
                            backgroundColor: 'transparent', 
                            color: 'var(--accent-gold)', 
                            border: '1px solid var(--accent-gold)', 
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'var(--sans)',
                            height: '43px',
                            boxSizing: 'border-box'
                          }}>
                            Upload Logo
                            <Upload size={14} />
                            <input 
                              type="file" 
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  try {
                                    const path = await uploadImageInline(file, 'general');
                                    setSettings(prev => ({ ...prev, logo_url: path }));
                                  } catch (err) {
                                    alert('Upload failed: ' + err.message);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        {settings.logo_url && (
                          <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ padding: '8px', backgroundColor: '#fff', border: '1px solid var(--border-formal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={settings.logo_url} alt="Logo Preview" style={{ maxHeight: '35px', maxWidth: '120px', objectFit: 'contain' }} />
                            </div>
                            <button 
                              type="button"
                              onClick={() => setSettings({ ...settings, logo_url: '' })}
                              style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}
                            >
                              Remove Logo
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Show Logo Text (Header Brand Name)</label>
                        <select 
                          value={settings.show_logo_text !== undefined ? settings.show_logo_text : '1'}
                          onChange={(e) => setSettings({ ...settings, show_logo_text: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', cursor: 'pointer' }}
                        >
                          <option value="1">Yes (Show brand name text next to logo)</option>
                          <option value="0">No (Hide brand name text, show logo only)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Logo Image Height (px)</label>
                        <input 
                          type="number" 
                          min="15" 
                          max="120"
                          value={settings.logo_height || '35'}
                          onChange={(e) => setSettings({ ...settings, logo_height: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Home Page Marquee / Ticker Items (Comma separated)</label>
                        <input 
                          type="text" 
                          value={settings.home_marquee || ''}
                          onChange={(e) => setSettings({ ...settings, home_marquee: e.target.value })}
                          placeholder="Aura Cove Resort & Spa, Ayurveda Sanctuary Spa, Lakeside Pool Villas"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>About Page Marquee / Ticker Items (Comma separated)</label>
                        <input 
                          type="text" 
                          value={settings.about_marquee || ''}
                          onChange={(e) => setSettings({ ...settings, about_marquee: e.target.value })}
                          placeholder="Condé Nast Traveler Gold List, Architectural Digest Highlights, Heritage Design Conservation Award"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Footer copyright text</label>
                        <input 
                          type="text" 
                          value={settings.footer_text || ''}
                          onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Site / Footer Description</label>
                        <textarea 
                          rows={3}
                          value={settings.site_description || ''}
                          onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                        <button 
                          type="submit" 
                          style={{ position: 'relative', padding: '12px 30px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: '1px solid var(--accent-gold)', cursor: 'pointer', fontSize: '13px', zIndex: 2, fontFamily: 'var(--sans)' }}
                        >
                          Save Company Profile
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 6. CMS PAGES */}
            {activeTab === 'cms_pages' && (
              <div>
                {!selectedCmsPage ? (
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '30px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>CMS Pages</h1>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', display: 'flex', flexDirection: 'column' }}>
                      {cmsPages.map((page) => (
                        <div key={page.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderBottom: '1px solid var(--border-formal)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(189,160,120,0.08)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--sans)' }}>{page.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>{page.path}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleOpenEditCmsPage(page)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', backgroundColor: 'transparent', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--sans)' }}
                          >
                            Edit
                            <Edit size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Edit CMS Page Form */
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <button 
                      onClick={() => setSelectedCmsPage(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', marginBottom: '25px', fontWeight: 600, fontFamily: 'var(--sans)' }}
                    >
                      <ChevronLeft size={16} />
                      Back to CMS Pages
                    </button>
                    <h2 style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '25px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Edit Content: <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>{selectedCmsPage.name}</span>
                    </h2>

                    <form onSubmit={handleSaveCmsPage} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                      {/* Section Tabs */}
                      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-formal)', paddingBottom: '15px', marginBottom: '10px', overflowX: 'auto', flexWrap: 'wrap' }}>
                        {getSortedSections(selectedCmsPage.id, Object.keys(cmsFormData).filter(sid => sid !== 'affiliations')).map(sectionId => {
                          const isActive = activeCmsSection === sectionId;
                          const sectionConfig = SECTION_LABELS[sectionId] || { name: sectionId.replace(/_/g, ' '), icon: FileText };
                          const SectionIcon = sectionConfig.icon;
                          
                          return (
                            <button
                              key={sectionId}
                              type="button"
                              onClick={() => setActiveCmsSection(sectionId)}
                              style={{
                                padding: '10px 18px',
                                backgroundColor: isActive ? 'rgba(189, 160, 120, 0.08)' : 'transparent',
                                border: isActive ? '1px solid var(--accent-gold)' : '1px solid var(--border-formal)',
                                color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 600,
                                fontFamily: 'var(--sans)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <SectionIcon size={14} style={{ color: isActive ? 'var(--accent-gold)' : 'rgba(189, 160, 120, 0.4)' }} />
                              {sectionConfig.name}
                            </button>
                          );
                        })}
                      </div>

                      {activeCmsSection && cmsFormData[activeCmsSection] && (
                        <div style={{ border: 'none', padding: 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {getGroupsForSection(activeCmsSection, cmsFormData[activeCmsSection]).map((group, groupIdx) => (
                              <div key={groupIdx} style={{
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-formal)',
                                padding: '30px',
                                position: 'relative'
                              }}>
                                <h4 style={{
                                  fontSize: '11px',
                                  textTransform: 'uppercase',
                                  color: 'var(--accent-gold)',
                                  fontWeight: 700,
                                  marginTop: 0,
                                  marginBottom: '25px',
                                  letterSpacing: '1.5px',
                                  fontFamily: 'var(--sans)',
                                  borderBottom: '1px solid rgba(189, 160, 120, 0.15)',
                                  paddingBottom: '10px'
                                }}>
                                  {group.title}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                  {group.fields.map(elementId => {
                                    const val = cmsFormData[activeCmsSection][elementId] || '';
                                    const isImageField = elementId.toLowerCase().includes('image') || 
                                                         elementId.toLowerCase().includes('img') || 
                                                         (val && typeof val === 'string' && (val.startsWith('/uploads/') || val.includes('unsplash.com') || val.match(/\.(jpeg|jpg|gif|png|webp)/i)));
                                    
                                    const fieldLabel = FIELD_LABELS[elementId] || elementId.replace(/_/g, ' ');
                                    
                                    return (
                                      <div key={elementId}>
                                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', fontWeight: 600, fontFamily: 'var(--sans)' }}>
                                          {fieldLabel}
                                        </label>
                                        {isImageField ? (
                                          <div style={{ display: 'flex', gap: '10px' }}>
                                            <input 
                                              type="text" 
                                              value={val}
                                              onChange={(e) => handleUpdateCmsFormField(activeCmsSection, elementId, e.target.value)}
                                              style={{ flex: 1, padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                                            />
                                            <label style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              gap: '6px',
                                              padding: '0 15px',
                                              backgroundColor: 'transparent',
                                              border: '1px solid var(--accent-gold)',
                                              color: 'var(--accent-gold)',
                                              cursor: 'pointer',
                                              fontSize: '12px',
                                              fontWeight: 600,
                                              fontFamily: 'var(--sans)',
                                              whiteSpace: 'nowrap',
                                              transition: 'all 0.3s ease'
                                            }}>
                                              Upload
                                              <Upload size={14} />
                                              <input 
                                                type="file" 
                                                accept="image/*" 
                                                style={{ display: 'none' }} 
                                                onChange={async (e) => {
                                                  const file = e.target.files[0];
                                                  if (!file) return;
                                                  try {
                                                    const path = await uploadImageInline(file, 'cms');
                                                    handleUpdateCmsFormField(activeCmsSection, elementId, path);
                                                  } catch (err) {
                                                    alert('Upload failed: ' + err.message);
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>
                                        ) : val.length > 120 ? (
                                          <textarea 
                                            rows={4}
                                            value={val}
                                            onChange={(e) => handleUpdateCmsFormField(activeCmsSection, elementId, e.target.value)}
                                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                                          />
                                        ) : (
                                          <input 
                                            type="text" 
                                            value={val}
                                            onChange={(e) => handleUpdateCmsFormField(activeCmsSection, elementId, e.target.value)}
                                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid var(--border-formal)', paddingTop: '20px' }}>
                        <button 
                          type="button" 
                          onClick={() => setSelectedCmsPage(null)}
                          style={{ padding: '10px 24px', border: '1px solid var(--border-formal)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--sans)' }}
                        >
                          Cancel
                        </button>
                        <div style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                          <button 
                            type="submit" 
                            style={{ position: 'relative', padding: '10px 30px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', border: '1px solid var(--accent-gold)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, zIndex: 2, fontFamily: 'var(--sans)' }}
                          >
                            Save Page Content
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 7. TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Testimonials</h1>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                    <button 
                      onClick={handleOpenAddTestimonial}
                      style={{ position: 'relative', padding: '10px 20px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: '1px solid var(--accent-gold)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, fontFamily: 'var(--sans)' }}
                    >
                      <Plus size={16} />
                      Add New
                    </button>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-formal)', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                        <th style={{ padding: '15px 20px' }}>Client</th>
                        <th style={{ padding: '15px 20px' }}>Rating</th>
                        <th style={{ padding: '15px 20px' }}>Review</th>
                        <th style={{ padding: '15px 20px' }}>Status</th>
                        <th style={{ padding: '15px 20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((test) => (
                        <tr key={test.id} style={{ borderBottom: '1px solid var(--border-formal)' }}>
                          <td style={{ padding: '15px 20px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{test.client_name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{test.location}</div>
                          </td>
                          <td style={{ padding: '15px 20px', color: 'var(--accent-gold)' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {Array.from({ length: test.rating }).map((_, i) => (
                                <Star key={i} size={12} fill="currentColor" />
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', maxWidth: '400px' }}>{test.review_text}</td>
                          <td style={{ padding: '15px 20px' }}>
                            <span style={{ fontSize: '11px', backgroundColor: test.is_visible === 1 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', color: test.is_visible === 1 ? '#10b981' : '#ef4444', border: test.is_visible === 1 ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)', padding: '3px 8px', fontWeight: 600 }}>
                              {test.is_visible === 1 ? 'Visible' : 'Hidden'}
                            </span>
                          </td>
                          <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleOpenEditTestimonial(test)}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: '6px' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteTestimonial(test.id)}
                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '6px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit Testimonial Modal Dialog */}
                {testimonialModalOpen && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', width: '90%', maxWidth: '500px', padding: '35px', position: 'relative' }}>
                      <button 
                        onClick={() => setTestimonialModalOpen(false)}
                        style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >
                        <X size={18} />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '20px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {testimonialFormMode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
                      </h2>

                      <form onSubmit={handleSaveTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Client Name</label>
                          <input 
                            type="text" 
                            required 
                            value={testimonialFormData.client_name}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, client_name: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Location</label>
                          <input 
                            type="text" 
                            value={testimonialFormData.location}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, location: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Review Text</label>
                          <textarea 
                            rows={4}
                            required 
                            value={testimonialFormData.review_text}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, review_text: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Rating (Stars)</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setTestimonialFormData({ ...testimonialFormData, rating: num })}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: num <= testimonialFormData.rating ? 'var(--accent-gold)' : 'var(--border-formal)',
                                  cursor: 'pointer',
                                  padding: '4px'
                                }}
                              >
                                <Star size={24} fill="currentColor" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0' }}>
                          <input 
                            type="checkbox" 
                            checked={testimonialFormData.is_visible === 1}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, is_visible: e.target.checked ? 1 : 0 })}
                            id="test_vis"
                          />
                          <label htmlFor="test_vis" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>Visible on Website</label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                          <button 
                            type="button" 
                            onClick={() => setTestimonialModalOpen(false)}
                            style={{ padding: '8px 16px', border: '1px solid var(--border-formal)', borderRadius: '0px', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--sans)' }}
                          >
                            Cancel
                          </button>
                          <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                            <button 
                              type="submit" 
                              style={{ position: 'relative', padding: '8px 24px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', border: '1px solid var(--accent-gold)', cursor: 'pointer', fontWeight: 600, zIndex: 2, fontFamily: 'var(--sans)' }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 8. MEDIA LIBRARY */}
            {activeTab === 'media_library' && (
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '10px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Media Library</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '30px', fontFamily: 'var(--sans)' }}>Manage all images across your website</p>

                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px', alignItems: 'start' }}>
                  
                  {/* Left media categories */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'general', label: 'General Media' },
                      { id: 'project', label: 'Room & Suite Images' },
                      { id: 'service', label: 'Experience Images' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setMediaCategory(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 15px',
                          border: 'none',
                          background: mediaCategory === cat.id ? 'rgba(189, 160, 120, 0.08)' : 'none',
                          color: mediaCategory === cat.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                          fontWeight: mediaCategory === cat.id ? 600 : 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontFamily: 'var(--sans)',
                          borderLeft: mediaCategory === cat.id ? '3px solid var(--accent-gold)' : '3px solid transparent'
                        }}
                      >
                        <Layers size={14} />
                        {cat.label}
                      </button>
                    ))}

                    <div 
                      onClick={() => fileInputRef.current.click()}
                      style={{ border: '1px dashed var(--glass-border)', padding: '30px 15px', textAlign: 'center', cursor: 'pointer', marginTop: '20px', transition: 'all 0.2s', backgroundColor: 'var(--bg-primary)' }}
                    >
                      <Upload size={20} color="var(--accent-gold)" style={{ margin: '0 auto 8px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, fontFamily: 'var(--sans)' }}>Drag & Drop files</span>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleUploadFile}
                        style={{ display: 'none' }}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Main media files grid */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '20px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        🏠 Root / {mediaCategory}
                        <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '10px', fontFamily: 'var(--sans)' }}>
                          {filteredMediaItems.length} items
                        </span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-formal)', padding: '6px 12px', width: '220px', backgroundColor: 'var(--bg-primary)' }}>
                        <Search size={14} color="var(--accent-gold)" />
                        <input 
                          type="text" 
                          placeholder="Search..."
                          value={mediaSearch}
                          onChange={(e) => setMediaSearch(e.target.value)}
                          style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}
                        />
                      </div>
                    </div>

                    {filteredMediaItems.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'var(--sans)' }}>
                        No files in this category.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
                        {filteredMediaItems.map(item => (
                          <div 
                            key={item.id} 
                            style={{ border: '1px solid var(--border-formal)', padding: '6px', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}
                            title={item.filename}
                          >
                            <div style={{ height: '90px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', position: 'relative', border: '1px solid var(--border-formal)' }}>
                              <img src={item.filepath} alt={item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '6px 2px 2px', fontSize: '10px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'var(--sans)' }}>
                              {item.filename}
                            </div>
                            
                            {/* Copy URL & Delete floating actions */}
                            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', justifyContent: 'space-between' }}>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.origin + item.filepath);
                                  alert('Copied image URL to clipboard!');
                                }}
                                style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', border: 'none', padding: '3px 8px', fontSize: '9px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}
                              >
                                Copy URL
                              </button>
                              <button 
                                onClick={() => handleDeleteMedia(item.id)}
                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 9. SEO SETTINGS */}
            {activeTab === 'seo_settings' && (
              <div style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '30px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>SEO Optimization Settings</h1>

                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                  {/* ── SECTION 1: BASIC SEO ── */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Basic SEO</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-gold)', opacity: 0.3 }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* SEO Title */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--sans)' }}>SEO Title</label>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--sans)', color: (settings.seo_title || '').length > 60 ? '#e74c3c' : 'var(--text-secondary)' }}>{(settings.seo_title || '').length}/60</span>
                        </div>
                        <input
                          type="text"
                          value={settings.seo_title || ''}
                          onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                          placeholder="Page title showing on Google search results"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                        />
                        <div style={{ height: '3px', marginTop: '4px', backgroundColor: 'var(--border-formal)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(((settings.seo_title || '').length / 60) * 100, 100)}%`, backgroundColor: (settings.seo_title || '').length > 60 ? '#e74c3c' : (settings.seo_title || '').length > 45 ? 'var(--accent-gold)' : '#27ae60', transition: 'width 0.3s, background-color 0.3s' }} />
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--sans)' }}>Meta Description</label>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--sans)', color: (settings.seo_description || '').length > 160 ? '#e74c3c' : 'var(--text-secondary)' }}>{(settings.seo_description || '').length}/160</span>
                        </div>
                        <textarea
                          rows={4}
                          value={settings.seo_description || ''}
                          onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                          placeholder="A concise summary of your website's content for search engines..."
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                        <div style={{ height: '3px', marginTop: '4px', backgroundColor: 'var(--border-formal)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(((settings.seo_description || '').length / 160) * 100, 100)}%`, backgroundColor: (settings.seo_description || '').length > 160 ? '#e74c3c' : (settings.seo_description || '').length > 120 ? 'var(--accent-gold)' : '#27ae60', transition: 'width 0.3s, background-color 0.3s' }} />
                        </div>
                      </div>

                      {/* Target Keywords */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Target Keywords</label>
                        <input
                          type="text"
                          value={settings.seo_keywords || ''}
                          onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })}
                          placeholder="e.g. luxury resort, ayurveda spa, backwater cruise, kerala (comma separated)"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── SECTION 2: SOCIAL MEDIA / OPEN GRAPH ── */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Social Media / Open Graph</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-gold)', opacity: 0.3 }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* OG Title */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>OG Title</label>
                        <input
                          type="text"
                          value={settings.og_title || ''}
                          onChange={(e) => setSettings({ ...settings, og_title: e.target.value })}
                          placeholder="Title shown when shared on Facebook / LinkedIn"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* OG Description */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>OG Description</label>
                        <textarea
                          rows={3}
                          value={settings.og_description || ''}
                          onChange={(e) => setSettings({ ...settings, og_description: e.target.value })}
                          placeholder="Description shown when shared on social media platforms"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* OG Image URL */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>OG Image URL</label>
                        <input
                          type="url"
                          value={settings.og_image || ''}
                          onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                          placeholder="https://example.com/og-image.jpg (recommended 1200×630)"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* Twitter Card Type & Handle */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Twitter Card Type</label>
                          <select
                            value={settings.twitter_card || 'summary_large_image'}
                            onChange={(e) => setSettings({ ...settings, twitter_card: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box', cursor: 'pointer' }}
                          >
                            <option value="summary">Summary</option>
                            <option value="summary_large_image">Summary Large Image</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Twitter Handle</label>
                          <input
                            type="text"
                            value={settings.twitter_handle || ''}
                            onChange={(e) => setSettings({ ...settings, twitter_handle: e.target.value })}
                            placeholder="@auracove"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── SECTION 3: TECHNICAL SEO ── */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Technical SEO</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-gold)', opacity: 0.3 }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Canonical URL */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Canonical URL</label>
                        <input
                          type="url"
                          value={settings.canonical_url || ''}
                          onChange={(e) => setSettings({ ...settings, canonical_url: e.target.value })}
                          placeholder="https://www.auracove.com"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* Robots Meta & GA Tracking ID */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Robots Meta</label>
                          <select
                            value={settings.robots_meta || 'index, follow'}
                            onChange={(e) => setSettings({ ...settings, robots_meta: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box', cursor: 'pointer' }}
                          >
                            <option value="index, follow">index, follow</option>
                            <option value="noindex, nofollow">noindex, nofollow</option>
                            <option value="index, nofollow">index, nofollow</option>
                            <option value="noindex, follow">noindex, follow</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Google Analytics Tracking ID</label>
                          <input
                            type="text"
                            value={settings.ga_tracking_id || ''}
                            onChange={(e) => setSettings({ ...settings, ga_tracking_id: e.target.value })}
                            placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      {/* Google Site Verification */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Google Site Verification Code</label>
                        <input
                          type="text"
                          value={settings.google_verification || ''}
                          onChange={(e) => setSettings({ ...settings, google_verification: e.target.value })}
                          placeholder="Verification meta tag content value"
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-formal)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── SECTION 4: PREVIEWS ── */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', padding: '35px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 500, fontFamily: 'var(--serif)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Preview</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-gold)', opacity: 0.3 }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                      {/* Google Search Preview */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Google Search Preview</label>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #dadce0', maxWidth: '600px' }}>
                          <div style={{ fontSize: '20px', fontFamily: 'arial, sans-serif', color: '#1a0dab', lineHeight: 1.3, marginBottom: '4px', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {(settings.seo_title || 'Your Page Title').substring(0, 60)}{(settings.seo_title || '').length > 60 ? '...' : ''}
                          </div>
                          <div style={{ fontSize: '14px', fontFamily: 'arial, sans-serif', color: '#006621', marginBottom: '4px' }}>
                            {settings.canonical_url || 'https://www.auracove.com'}
                          </div>
                          <div style={{ fontSize: '13px', fontFamily: 'arial, sans-serif', color: '#545454', lineHeight: 1.58, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {(settings.seo_description || 'Your meta description will appear here. Write a compelling summary to improve click-through rates from search results.').substring(0, 160)}{(settings.seo_description || '').length > 160 ? '...' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Social Share Preview */}
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', fontWeight: 600, fontFamily: 'var(--sans)' }}>Social Share Preview (Facebook / LinkedIn)</label>
                        <div style={{ maxWidth: '500px', border: '1px solid #dadce0', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#f2f3f5' }}>
                          {/* OG Image Area */}
                          <div style={{ width: '100%', height: '260px', backgroundColor: '#e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {settings.og_image ? (
                              <img
                                src={settings.og_image}
                                alt="OG Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                              />
                            ) : null}
                            <div style={{ display: settings.og_image ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#8e8e8e' }}>
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                              </svg>
                              <span style={{ fontSize: '12px', fontFamily: 'var(--sans)' }}>No image set</span>
                            </div>
                          </div>
                          {/* OG Text Content */}
                          <div style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8e8e8e', fontFamily: 'arial, sans-serif', marginBottom: '4px' }}>
                              {(() => { try { return new URL(settings.canonical_url || 'https://www.auracove.com').hostname; } catch { return 'auracove.com'; } })()}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1d2129', fontFamily: 'arial, sans-serif', lineHeight: 1.3, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {settings.og_title || settings.seo_title || 'Your Page Title'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#606770', fontFamily: 'arial, sans-serif', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {settings.og_description || settings.seo_description || 'Your social share description will appear here.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '3px', left: '3px', right: '-3px', bottom: '-3px', border: '1px solid var(--accent-gold)', pointerEvents: 'none', zIndex: 1 }} />
                      <button
                        type="submit"
                        style={{ position: 'relative', padding: '12px 30px', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, border: '1px solid var(--accent-gold)', cursor: 'pointer', fontSize: '13px', zIndex: 2, fontFamily: 'var(--sans)' }}
                      >
                        Save SEO Settings
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            )}

            {/* 10. ACTIVITY LOGS */}
            {activeTab === 'activity_logs' && (
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 500, fontFamily: 'var(--serif)', marginBottom: '30px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Activity Logs</h1>
                
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-formal)', overflowX: 'auto' }}>
                  {activityLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                      No activity logs found.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-formal)', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                          <th style={{ padding: '15px 20px' }}>Timestamp</th>
                          <th style={{ padding: '15px 20px' }}>Action</th>
                          <th style={{ padding: '15px 20px' }}>Details</th>
                          <th style={{ padding: '15px 20px' }}>User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLogs.map((log) => (
                          <tr key={log.id} style={{ borderBottom: '1px solid var(--border-formal)' }}>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{formatDate(log.timestamp)}</td>
                            <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</td>
                            <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{log.details}</td>
                            <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--accent-gold)' }}>{log.user}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
      
      {/* Custom Premium Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: `1px solid ${notification.type === 'success' ? 'var(--accent-gold)' : '#ff4d4d'}`,
          padding: '16px 24px',
          color: 'var(--text-primary)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--sans)',
          fontSize: '13px',
          letterSpacing: '0.5px',
          animation: 'toast-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transition: 'all 0.3s ease'
        }}>
          <style>{`
            @keyframes toast-fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: notification.type === 'success' ? 'var(--accent-gold)' : '#ff4d4d'
          }} />
          <div>{notification.message}</div>
          <button 
            type="button"
            onClick={() => setNotification(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginLeft: '15px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}
    </PageTransition>
  );
}
