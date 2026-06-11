/**
 * Ingests funnel events from the client (utils/track.ts) into Supabase.
 * Inserts use the service role key — the table has RLS enabled with no
 * policies, so this function is the only writer.
 */

const ALLOWED_EVENTS = new Set([
  'pageview',
  'case_study_view',
  'pdf_download',
  'resume_pdf_download',
  'contact_click',
  'experience_mode',
  'focus_area_open',
  'next_project_click',
  'writeup_request',
]);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const name = String(body.name ?? '');
    if (!ALLOWED_EVENTS.has(name)) {
      res.status(204).end();
      return;
    }

    const props = body.props && typeof body.props === 'object' ? body.props : {};
    const propsJson = JSON.stringify(props).slice(0, 500);
    const ua = String(req.headers['user-agent'] ?? '');
    const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      res.status(204).end();
      return;
    }

    await fetch(`${supabaseUrl}/rest/v1/portfolio_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        props: JSON.parse(propsJson),
        path: typeof body.path === 'string' ? body.path.slice(0, 200) : null,
        referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 300) : null,
        device,
      }),
    });
  } catch {
    // Never surface analytics failures to the client
  }

  res.status(204).end();
}
