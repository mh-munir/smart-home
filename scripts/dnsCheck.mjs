import dns from 'dns/promises';

(async () => {
  try {
    const records = await dns.resolveSrv('_mongodb._tcp.smarthome.gjpn5fh.mongodb.net');
    console.log(JSON.stringify(records, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
