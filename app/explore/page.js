'use client';

import { useEffect, useState } from 'react';
import { getStudies } from '@/lib/supabase';
import StudyCard from '@/components/StudyCard';
import dynamic from 'next/dynamic';

// Dynamic import for map (needs browser APIs)
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function ExplorePage() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getStudies().then(data => {
      if (!active) return;
      setStudies(data);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const term = search.toLowerCase();
  const filtered = studies.filter(study => {
    const matchesSearch = term === '' ||
      (study.title || '').toLowerCase().includes(term) ||
      (study.location || '').toLowerCase().includes(term) ||
      (study.author || '').toLowerCase().includes(term);
    const matchesCategory = category === 'all' || study.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      <section className="section">
        <div className="form-header">
          <h1>Explore Studies</h1>
          <p>Browse community water quality and habitat research from across the region.</p>
        </div>

        <div className="explore-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, location, or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="water-quality">Water Quality</option>
            <option value="habitat">Habitat</option>
          </select>
          <div className="view-toggle">
            <button
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button
              className={view === 'map' ? 'active' : ''}
              onClick={() => setView('map')}
            >
              Map
            </button>
          </div>
        </div>

        {view === 'map' && <MapView studies={filtered} />}

        <div className="studies-grid">
          {filtered.map(study => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>

        {loading && (
          <p style={{ color: 'var(--color-text-tertiary)', padding: '40px 0' }}>
            Loading studies...
          </p>
        )}
        {!loading && filtered.length === 0 && studies.length > 0 && (
          <p style={{ color: 'var(--color-text-tertiary)', padding: '40px 0' }}>
            No studies match your search. Try different keywords.
          </p>
        )}
        {!loading && studies.length === 0 && (
          <p style={{ color: 'var(--color-text-tertiary)', padding: '40px 0' }}>
            No studies have been submitted yet.
          </p>
        )}
      </section>
    </main>
  );
}
