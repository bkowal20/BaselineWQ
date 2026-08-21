'use client';

import { useState } from 'react';
import { insertStudy, uploadFile } from '@/lib/supabase';

const PARAMETERS = [
  'Dissolved Metals', 'Sulfate', 'Nutrients (N/P)', 'pH', 'Dissolved Oxygen',
  'Conductivity', 'Temperature', 'E. coli', 'Chloride', 'Turbidity',
  'Macroinvertebrates', 'Wild Rice Density', 'Substrate/Sediment', 'Flow/Velocity',
];

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '', author: '', email: '', location: '', lat: '', lng: '',
    date_start: '', date_end: '', waterbody: '', category: 'water-quality',
    parameters: [], lab: '', methods: '', summary: '', findings: '', sites: '',
  });

  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleParam(param) {
    setForm(prev => ({
      ...prev,
      parameters: prev.parameters.includes(param)
        ? prev.parameters.filter(p => p !== param)
        : [...prev.parameters, param],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const study = {
        title: form.title,
        author: form.author,
        email: form.email || null,
        location: form.location,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        date_start: form.date_start || null,
        date_end: form.date_end || null,
        waterbody: form.waterbody || null,
        category: form.category,
        parameters: form.parameters,
        lab: form.lab || null,
        methods: form.methods || null,
        summary: form.summary,
        findings: form.findings
          ? form.findings.split('\n').filter(f => f.trim())
          : [],
        sites: form.sites ? parseInt(form.sites) : null,
      };

      const fileUrls = [];
      for (const file of files) {
        try {
          const url = await uploadFile(file);
          fileUrls.push(url);
        } catch (uploadErr) {
          console.warn('File upload failed:', uploadErr);
        }
      }
      if (fileUrls.length > 0) {
        study.file_urls = fileUrls;
      }

      await insertStudy(study);
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main>
        <section className="section">
          <div className="form-container" style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>&#10003;</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Study Submitted</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Thank you for contributing to the baseline. Your study is now live on the explore page.
            </p>
            <a href="/explore" className="btn btn-primary">Back to Explore</a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section">
        <div className="form-container">
          <div className="form-header">
            <h1>Upload Your Research</h1>
            <p>Share your water quality or habitat study with the community. All fields with * are required.</p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px',
              padding: '10px 14px', marginBottom: '20px', color: '#991b1b', fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Study Title *</label>
              <input type="text" className="form-input"
                placeholder="e.g., Baseline Water Quality Survey: Lake Name"
                value={form.title} onChange={e => updateField('title', e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" className="form-input" placeholder="Name or organization"
                  value={form.author} onChange={e => updateField('author', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" className="form-input" placeholder="you@email.com"
                  value={form.email} onChange={e => updateField('email', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input type="text" className="form-input"
                placeholder="e.g., Birch Lake, Superior National Forest, MN"
                value={form.location} onChange={e => updateField('location', e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude <span>(decimal degrees)</span></label>
                <input type="number" step="any" className="form-input" placeholder="e.g., 47.82"
                  value={form.lat} onChange={e => updateField('lat', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Longitude <span>(decimal degrees)</span></label>
                <input type="number" step="any" className="form-input" placeholder="e.g., -91.75"
                  value={form.lng} onChange={e => updateField('lng', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sampling Start Date *</label>
                <input type="date" className="form-input"
                  value={form.date_start} onChange={e => updateField('date_start', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Sampling End Date</label>
                <input type="date" className="form-input"
                  value={form.date_end} onChange={e => updateField('date_end', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Waterbody Type *</label>
                <select className="form-select"
                  value={form.waterbody} onChange={e => updateField('waterbody', e.target.value)} required>
                  <option value="">Select type...</option>
                  <option value="Lake">Lake</option>
                  <option value="River">River</option>
                  <option value="Stream / Creek">Stream / Creek</option>
                  <option value="Wetland">Wetland</option>
                  <option value="Estuary">Estuary</option>
                  <option value="Groundwater">Groundwater</option>
                  <option value="Multiple / Mixed">Multiple / Mixed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Sites</label>
                <input type="number" className="form-input" placeholder="e.g., 10"
                  value={form.sites} onChange={e => updateField('sites', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Study Category *</label>
              <select className="form-select"
                value={form.category} onChange={e => updateField('category', e.target.value)} required>
                <option value="water-quality">Water Quality</option>
                <option value="habitat">Habitat</option>
              </select>
            </div>

            <div className="form-group">
              <label>Parameters Measured <span>(select all that apply)</span></label>
              <div className="checkbox-group">
                {PARAMETERS.map(param => (
                  <label key={param} className="checkbox-label">
                    <input type="checkbox" checked={form.parameters.includes(param)}
                      onChange={() => toggleParam(param)} />
                    {param}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Laboratory <span>(if applicable)</span></label>
              <input type="text" className="form-input"
                placeholder="e.g., University of Minnesota Research Analytical Lab"
                value={form.lab} onChange={e => updateField('lab', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Methods</label>
              <textarea className="form-textarea"
                placeholder="Briefly describe your collection methods, instruments, and analytical techniques..."
                value={form.methods} onChange={e => updateField('methods', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Summary *</label>
              <textarea className="form-textarea"
                placeholder="What did you study and why? What context is important for understanding your results?"
                value={form.summary} onChange={e => updateField('summary', e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Key Findings <span>(one per line)</span></label>
              <textarea className="form-textarea"
                placeholder="List your most important results, one per line..."
                value={form.findings} onChange={e => updateField('findings', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Attach Files <span>(report, data, photos)</span></label>
              <div className="file-upload"
                onClick={() => document.getElementById('file-input').click()}
                style={{ cursor: 'pointer' }}>
                {files.length === 0 ? (
                  <>
                    <p><strong>Click to upload</strong> or drag files here</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>PDF, DOCX, XLSX, CSV, JPG, PNG (max 25 MB each)</p>
                  </>
                ) : (
                  <>
                    <p><strong>{files.length} file{files.length > 1 ? 's' : ''} selected</strong></p>
                    {files.map((f, i) => (
                      <p key={i} style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '2px 0' }}>
                        {f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)
                      </p>
                    ))}
                    <p style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--color-primary)' }}>Click to change</p>
                  </>
                )}
              </div>
              <input id="file-input" type="file" multiple
                accept=".pdf,.docx,.xlsx,.csv,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => setFiles(Array.from(e.target.files))} />
            </div>

            <div className="form-submit">
              <button type="submit" className="btn btn-primary" disabled={submitting}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting...' : 'Submit Study'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-tertiary)', marginTop: '10px' }}>
                By submitting, you agree to share this data under a Creative Commons CC BY 4.0 license.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
