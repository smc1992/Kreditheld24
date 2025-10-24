'use client';

import Script from 'next/script';

export default function KreditLeadPage() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '1.25rem' }}>
      <h1 style={{ fontSize: '1.5rem', margin: '0.25rem 0 0.5rem' }}>KreditLead</h1>
      <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
        Nutzen Sie das Tool, um einen ersten Überblick über Konditionen und
        Ratenhöhe Ihres Privatkredits zu erhalten.
      </p>

      <div id="econ" style={{ minHeight: 600 }} />

      <Script
        src="https://europace.nc.econ-application.de/frontend/europace/assets/js/econ.js"
        strategy="afterInteractive"
        onLoad={() => {
          const econ = (window as any).econ;
          if (econ && typeof econ.initEcon === 'function') {
            econ.initEcon(
              'econ',
              'https://europace.nc.econ-application.de/econ/process/LKJ98/kreditlead?epid_uv=XPS71',
              [],
              0
            );
          }
        }}
      />
    </div>
  );
}