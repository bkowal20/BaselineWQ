import Link from 'next/link';
import { mockStudies, getStudyById } from '@/lib/mockData';

// Generate static paths for mock data
export function generateStaticParams() {
  return mockStudies.map(study => ({ id: study.id }));
}

export default async function StudyPage({ params }) {
  const { id } = await params;
  const study = getStudyById(id);

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
          {study.findings && study.findings.length > 0 && (
            <div className="detail-card">
              <h2>Key Findings</h2>
              <ul>
                {study.findings.map((f, i) => (
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
          <div className="detail-card">
            <h2>Parameters</h2>
            <div className="study-card-tags">
              {study.parameters.map(p => (
                <span key={p} className="tag">{p}</span>
              ))}
            </div>
          </div>

          {/* Download placeholder */}
          <div className="detail-card">
            <h2>Downloads</h2>
            <p style={{ fontSize: '0.85rem' }}>Full report and raw data files will be available here when Supabase file storage is connected.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
