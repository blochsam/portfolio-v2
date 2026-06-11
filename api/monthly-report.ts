/**
 * Monthly analytics digest. Invoked by Vercel Cron (1st of each month);
 * aggregates the last 30 days of portfolio_events from Supabase and
 * emails a report via Resend.
 *
 * Manual test:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/monthly-report
 */

type EventRow = {
  name: string;
  props: Record<string, unknown>;
  path: string | null;
  referrer: string | null;
  device: string | null;
  created_at: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function countBy(rows: EventRow[], key: (r: EventRow) => string | null | undefined): [string, number][] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function tableRows(pairs: [string, number][], limit = 8): string {
  if (pairs.length === 0) return '<tr><td colspan="2" style="padding:6px 12px;color:#9ca3af;">No events yet</td></tr>';
  return pairs.slice(0, limit).map(([k, v]) =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;">${v}</td></tr>`
  ).join('');
}

function section(title: string, rows: string): string {
  return `
    <h3 style="margin:28px 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#24A2A7;">${title}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">${rows}</table>`;
}

export default async function handler(req: any, res: any) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const reportEmail = process.env.REPORT_EMAIL || 'sam@sam-bloch.com';
  if (!supabaseUrl || !serviceKey || !resendKey) {
    res.status(500).json({ error: 'missing env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / RESEND_API_KEY)' });
    return;
  }

  const now = Date.now();
  const since = new Date(now - 30 * DAY_MS).toISOString();
  const priorSince = new Date(now - 60 * DAY_MS).toISOString();

  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

  // Current window (capped at 10k events — far above expected traffic)
  const eventsResp = await fetch(
    `${supabaseUrl}/rest/v1/portfolio_events?select=name,props,path,referrer,device,created_at&created_at=gte.${since}&order=created_at.desc&limit=10000`,
    { headers }
  );
  if (!eventsResp.ok) {
    res.status(502).json({ error: `supabase read failed: ${eventsResp.status}` });
    return;
  }
  const events: EventRow[] = await eventsResp.json();

  // Prior window count for trend context
  const priorResp = await fetch(
    `${supabaseUrl}/rest/v1/portfolio_events?select=id&created_at=gte.${priorSince}&created_at=lt.${since}&limit=1`,
    { headers: { ...headers, Prefer: 'count=exact', Range: '0-0' } }
  );
  const priorTotal = Number(priorResp.headers.get('content-range')?.split('/')[1] ?? 0);

  const by = (name: string) => events.filter(e => e.name === name);
  const pageviews = by('pageview');
  const caseStudies = by('case_study_view');

  const selfHosts = ['sam-bloch.com', 'vercel.app', 'localhost'];
  const referrers = countBy(pageviews, r => {
    if (!r.referrer) return null;
    try {
      const host = new URL(r.referrer).hostname;
      return selfHosts.some(h => host.includes(h)) ? null : host;
    } catch { return null; }
  });

  const modeRows = countBy(by('experience_mode'), r => String(r.props?.mode ?? 'unknown'));

  const html = `
  <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;">
    <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#24A2A7;font-weight:800;margin:0 0 4px;">SAM-BLOCH.COM</p>
    <h1 style="font-size:26px;margin:0 0 4px;color:#111827;">Your portfolio, last 30 days</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
      ${events.length} events captured · previous 30 days: ${priorTotal}
    </p>

    <div style="display:flex;gap:12px;">
      <div style="flex:1;background:#f9fafb;border-radius:12px;padding:16px;">
        <div style="font-size:28px;font-weight:800;color:#111827;">${pageviews.length}</div>
        <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Pageviews</div>
      </div>
      <div style="flex:1;background:#f9fafb;border-radius:12px;padding:16px;">
        <div style="font-size:28px;font-weight:800;color:#111827;">${caseStudies.length}</div>
        <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Case study reads</div>
      </div>
      <div style="flex:1;background:#f9fafb;border-radius:12px;padding:16px;">
        <div style="font-size:28px;font-weight:800;color:#111827;">${by('contact_click').length + by('writeup_request').length}</div>
        <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Contact intents</div>
      </div>
    </div>

    ${section('Case studies read', tableRows(countBy(caseStudies, r => String(r.props?.project ?? 'unknown'))))}
    ${section('PDF downloads', tableRows(countBy(by('pdf_download'), r => String(r.props?.project ?? 'unknown'))))}
    ${section('Resume PDF downloads', tableRows([['resume', by('resume_pdf_download').length]]))}
    ${section('Top pages', tableRows(countBy(pageviews, r => r.path)))}
    ${section('Focus areas opened', tableRows(countBy(by('focus_area_open'), r => `${String(r.props?.area ?? '?')} (${String(r.props?.surface ?? '?')})`)))}
    ${section('3D vs 2D landings', tableRows(modeRows))}
    ${section('Devices', tableRows(countBy(events, r => r.device)))}
    ${section('Referrers', tableRows(referrers))}
    ${section('Write-up requests', tableRows(countBy(by('writeup_request'), r => String(r.props?.project ?? 'unknown'))))}
    ${section('Next-project clicks', tableRows(countBy(by('next_project_click'), r => `${String(r.props?.from ?? '?')} → ${String(r.props?.to ?? '?')}`)))}

    <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
      Generated by /api/monthly-report · data in Supabase (portfolio_events)
    </p>
  </div>`;

  const monthName = new Date(now - DAY_MS).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const sendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: process.env.REPORT_FROM || 'Portfolio Analytics <onboarding@resend.dev>',
      to: [reportEmail],
      subject: `Your portfolio: ${monthName} in review`,
      html,
    }),
  });

  if (!sendResp.ok) {
    const detail = await sendResp.text();
    res.status(502).json({ error: 'resend send failed', detail });
    return;
  }

  res.status(200).json({
    ok: true,
    events: events.length,
    pageviews: pageviews.length,
    caseStudyReads: caseStudies.length,
    sentTo: reportEmail,
  });
}
