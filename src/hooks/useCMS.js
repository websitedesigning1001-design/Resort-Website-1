import { useState, useEffect } from 'react';

export function useCMSContent(pageId, fallback) {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/content/${pageId}`)
      .then(res => {
        if (!res.ok) throw new Error('CMS error');
        return res.json();
      })
      .then(data => {
        if (!active) return;
        
        // Deep merge data with fallback so missing keys don't break the UI
        const merged = { ...fallback };
        Object.keys(data).forEach(section => {
          merged[section] = { ...fallback[section], ...data[section] };
        });
        
        setContent(merged);
        setLoading(false);
      })
      .catch(err => {
        console.warn(`Failed to load CMS content for ${pageId}, using local fallback.`, err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [pageId]);

  return { content, loading };
}

export function useSettings(fallback) {
  const [settings, setSettings] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Settings error');
        return res.json();
      })
      .then(data => {
        if (!active) return;
        setSettings({ ...fallback, ...data });
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load global settings, using local fallback.', err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { settings, loading };
}
