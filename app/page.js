import Link from 'next/link';
import { mockStudies } from '@/lib/mockData';
import StudyCard from '@/components/StudyCard';

export default function Home() {
  const recentStudies = mockStudies.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <h1>Community water research,<br /><em>shared openly</em></h1>
        <p className="hero-sub">
          Upload your water quality and habitat studies. Browse what others have found.
          Build the baseline together.
        </p>
        <div className="hero-actions">
          <Link href="/explore" className="btn btn-primary">Explore Studies</Link>
          <Link href="/upload" className="btn btn-secondary">Upload Your Research</Link>
        </div>
      </section>

      {/* How it works */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">+</div>
          <h3>Upload</h3>
          <p>Share your water quality data, habitat surveys, or environmental studies. Include your methods, lab results, and findings.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#x25CB;</div>
          <h3>Explore</h3>
          <p>Browse studies on the map or search by location, parameter, or waterbody. See what others have measured in your watershed.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#x2193;</div>
          <h3>Download</h3>
          <p>Access full reports and raw data. Every submission is open for anyone to use, cite, or build on.</p>
        </div>
      </section>

      {/* Recent Studies */}
      <section className="section">
        <div className="section-header">
          <h2>Recent Studies</h2>
          <Link href="/explore">View all</Link>
        </div>
        <div className="studies-grid">
          {recentStudies.map(study => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      </section>
    </main>
  );
}
