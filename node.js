const axios = require('axios');
const express = require('express');
const app = express();

// Define your API key and base URL
const API_KEY = process.env.API_KEY;
const DDNS_USER = process.env.DDNS_USER;
const DDNS_PASS = process.env.DDNS_PASS;
const BASE_URL = 'https://api.vultr.com/v2';
const PORT = process.env.PORT || 8080;
const SUBDOMAIN = process.env.SUBDOMAIN || "dyndns";

//
async function getDnsRecords(domain) {
  const response = await axios.get(`${BASE_URL}/domains/${domain}/records`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  return response.data;
}

// 
async function updateDnsRecord(domain, recordId, hostname, newIp) {
  const response = await axios.patch(`${BASE_URL}/domains/${domain}/records/${recordId}`, {
    name: hostname,
    type: 'A',
    data: newIp,
    ttl: 3600
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

// 
async function update(domain, hostname, ip) {
  try {
    const records = await getDnsRecords(domain);
    if(records == undefined) {
      throw new Error(`No records for domain ${domain}`);
    }

    //
    const dynName = `${hostname}.${SUBDOMAIN}`;
    console.log(`UPDATE: ${dynName}.${domain} => ${ip}`);

    const record = records.records.find((el) => el.name == dynName);

    if(record == undefined) {
      throw new Error(`No record for ${dynName} found in domain ${domain}`);
    }


    //
    console.log(`UPDATING RECORD: ${record.id}`);
    const updateResponse = await updateDnsRecord(domain, record.id, dynName, ip);
    console.log('Update Response:', updateResponse);


    return updateResponse;
  } catch (error) {
    console.error('Error:', error);
  }
}

//
app.get('/update', (req, res) => {
  try {
    const args = req.query;

    if(args.user != DDNS_USER || args.pass != DDNS_PASS) {
      throw new Error(`DDNS Auth Failure`);
    }

    const result = update(args.domain, args.host, args.ip);
    res.send(result);
  }
  catch (error) {
    console.error('Error:', error);
  }
});

//
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
