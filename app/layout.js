import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'BaselineWQ',
  description: 'Community water quality and habitat research, shared openly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body>
        <header className="header">
          <div className="header-inner">
            <Link href="/" className="logo">
              Baseline<span>WQ</span>
            </Link>
            <nav className="nav">
              <Link href="/explore" className="nav-link">Explore</Link>
              <Link href="/upload" className="nav-link nav-link-primary">Upload Research</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div>BaselineWQ &middot; Open community water quality data</div>
          <div>Built by people who care about water</div>
        </footer>
      </body>
    </html>
  );
}
