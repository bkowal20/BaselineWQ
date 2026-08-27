import Link from 'next/link';

export default function StudyCard({ study }) {
  const catClass = study.category === 'habitat' ? 'cat-habitat' : 'cat-water-quality';
  const catLabel = study.category === 'habitat' ? 'Habitat' : 'Water Quality';

  return (
    <Link href={`/study/${study.id}`} className="study-card">
      <span className={`study-card-category ${catClass}`}>{catLabel}</span>
      <h3>{study.title}</h3>
      <div className="study-card-meta">
        {study.author} &middot; {study.location} &middot; {study.sites} sites
      </div>
      <p className="study-card-summary">{study.summary}</p>
      <div className="study-card-tags">
        {(study.parameters || []).slice(0, 4).map(p => (
          <span key={p} className="tag">{p}</span>
        ))}
      </div>
    </Link>
  );
}
