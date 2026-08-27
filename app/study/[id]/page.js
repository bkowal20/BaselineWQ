'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getStudy } from '@/lib/supabase';

export default function StudyPage() {
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    getStudy(id).then(data => {
      if (!active) return;
      setStudy(data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <main className="detail-page">
        <Link href="/explore" className="detail-back">&larr; Back to Explore</Link>
        <p style={{ color: 'var(--color-text-tertiary)', padding: '40px 0' }}>Loading study...</p>
      </main>
    );
  }

  if (!study) {
    return (
      <main className="detail-page">
        <Link href="/explore" className="detail-back">&larr; Back to Explore</Link>
        <h1>Study not found</h1>
      </main>
    );
  }

  const catClass = study.category === 'habitat' ? 'cat-habitat' : 'cat-water-quality';
  const catLabel = study.category === 'habitat' ? 'Habitat' : 'Water Quality';

  const dateRange = study.date_end
    ? `${study.date_start} to ${study.date_end}`
    : study.date_start;

  const parameters = study.parameters || [];
  const findings = study.findings || [];

  return (
    <main className="detail-page">
      <Link href="/explore" className="detail-back">&larr; Back to Explore</Link>

      <div className="detail-header">
        <span className={`study-card-category ${catClass}`}>{catLabel}</span>
        <h1>{study.title}</h1>
        <div className="detail-meta">
          {study.author} &middot; {study.location} &middot; {dateRange}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          {/* Summary */}
          <div className="detail-card">
            <h2>Summary</h2>
            <p>{study.summary}</p>
          </div>

          {/* Key Findings */}
          {findings.length > 0 && (
            <div className="detail-card">
              <h2>Key Findings</h2>
              <ul>
                {findings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Methods */}
          {study.methods && (
            <div className="detail-card">
              <h2>Methods</h2>
              <p>{study.methods}</p>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          {/* Study Info */}
          <div className="detail-card">
            <h2>Study Details</h2>
            <div className="info-row">
              <span className="info-label">Sites</span>
              <span className="info-value">{study.sites}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Dates</span>
              <span className="info-value">{dateRange}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Waterbody</span>
              <span className="info-value">{study.waterbody}</span>
            </div>
            {study.lab && (
              <div className="info-row">
                <span className="info-label">Lab</span>
                <span className="info-value">{study.lab}</span>
              </div>
            )}
          </div>

          {/* Parameters */}
          {parameters.length > 0 && (
            <div className="detail-card">
              <h2>Parameters</h2>
              <div className="study-card-tags">
                {parameters.map(p => (
                  <span key={p} className="tag">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Downloads */}
          {study.file_urls && study.file_urls.length > 0 && (
            <div className="detail-card">
              <h2>Downloads</h2>
              {study.file_urls.map((url, i) => (
                <div key={url} className="info-row">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    File {i + 1}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
