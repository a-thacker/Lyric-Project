const BIN_ID = process.env.JSONBIN_BIN_ID;
const KEY    = process.env.JSONBIN_KEY;
const URL    = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': KEY,
  'X-Bin-Versioning': 'false',
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors };
  }

  if (event.httpMethod === 'GET') {
    const res  = await fetch(URL + '/latest', { headers });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify(data.record?.profiles ?? []),
    };
  }

  if (event.httpMethod === 'PUT') {
    const profiles = JSON.parse(event.body);
    const res = await fetch(URL, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ profiles }),
    });
    return {
      statusCode: res.ok ? 200 : 500,
      headers: cors,
      body: res.ok ? 'ok' : 'error',
    };
  }

  return { statusCode: 405, body: 'Method not allowed' };
}
