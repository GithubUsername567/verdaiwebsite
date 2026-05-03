export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.error('Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const server = apiKey.split('-').pop();
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

  let mcRes;
  try {
    mcRes = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['waitlist'],
      }),
    });
  } catch (err) {
    console.error('Mailchimp fetch error:', err);
    return res.status(502).json({ error: 'Could not reach mailing service' });
  }

  const data = await mcRes.json();

  if (mcRes.ok || data.title === 'Member Exists') {
    return res.status(200).json({ success: true });
  }

  console.error('Mailchimp error:', data);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
