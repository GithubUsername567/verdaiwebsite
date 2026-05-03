exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.error('Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server misconfiguration' }) };
  }

  const server = apiKey.split('-').pop();
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

  let res;
  try {
    res = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`, {
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
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Could not reach mailing service' }) };
  }

  const data = await res.json();

  if (res.ok) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  // Already subscribed — treat as success so we don't leak list membership
  if (data.title === 'Member Exists') {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  console.error('Mailchimp error:', data);
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
  };
};
