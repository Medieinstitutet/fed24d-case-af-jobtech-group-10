import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getJobDetails } from '../services/jobService';
import type { JobAd } from '../models/IJobs';
import { DigiIconArrowLeft, DigiIconArrowUp } from '@digi/arbetsformedlingen-react';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  console.log('Job ID från URL:', id); // Logga ID från URL

  const [job, setJob] = useState<JobAd | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      console.log('Hämtar jobbdata för id:', id); // Logga när vi börjar hämta jobb
      setLoading(true);
      try {
        const jobData = await getJobDetails(id);
        console.log('Jobbdata hämtad:', jobData); // Logga jobbdata
        setJob(jobData);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) return <p>Laddar...</p>;
  if (!job) return <p>Kunde inte hitta jobbet.</p>;

  console.log('Jobb som ska renderas:', job); // Logga jobbdata innan rendering

  return (
    <main className="job-detail">
      <div className="job-detail__topbar">
        <Link to="/" className="job-detail__back">
          <DigiIconArrowLeft />
        </Link>
        <div className="job-detail__brand">
          {job.logo_url ? (
            <img
              src={job.logo_url}
              alt={`${job.workplace ?? 'Company'} logo`}
              onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/default-logo.png')}
            />
          ) : (
            <span className="job-detail__brand-fallback">Företagets logga</span>
          )}
        </div>
      </div>

      <div className="job-detail__header">
        <h1 className="job-detail__title">
          {job.headline} till{' '}
          <span className="job-detail__company">{job.workplace ?? 'Company name'}</span>
        </h1>

        <p className="job-detail__meta">
          {job.city || job.municipality || job.region || job.country ? (
            <>
              {job.city ?? job.municipality ?? job.region ?? job.country}
              {' • '}
            </>
          ) : null}
          {job.employment_type?.label ??
            job.working_hours_type?.label ??
            'Type (full-time/part-time/internship)'}
        </p>

        {job.application_deadline && (
          <p className="job-detail__deadline">
            Ansök senast: {new Date(job.application_deadline).toLocaleDateString('sv-SE')}
          </p>
        )}

        {job.application_url && (
          <a
            className="job-detail__apply"
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ansök nu
          </a>
        )}
      </div>

      {/* Jobbannonsen */}
      <section className="job-detail__card">
        <h2>Om jobbet</h2>
        <div className="job-detail__content">
          {job.description ? (
            <div className="richtext" dangerouslySetInnerHTML={{ __html: job.description }} />
          ) : (
            <p>Arbetsbeskrivning saknas</p>
          )}
        </div>
      </section>

      {/* <section className="job-detail__card job-detail__card--map">
        <h3>Office location</h3>
        <div className="job-detail__map">Map showing the office location</div>
      </section> */}

      <section className="job-detail__contact">
        <h3>Contact information</h3>
        <div className="job-detail__contact-grid">
          <div>
            <div className="label">E-post</div>
            <div className="value">—</div>
          </div>
          <div>
            <div className="label">Telefonummer</div>
            <div className="value">—</div>
          </div>
        </div>
      </section>

      <div className="job-detail__footer">
        {job.id && <div>Annonsens ID: {job.id}</div>}
        {job.published && (
          <div>Annonsen publicerades {new Date(job.published).toLocaleDateString('sv-SE')}</div>
        )}
      </div>

      {/* Tillbaka till top */}
      <button
        className="job-detail__fab"
        aria-label="Tillbaka till top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <DigiIconArrowUp />
      </button>
    </main>
  );
}
