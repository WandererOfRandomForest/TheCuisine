const dns = require('dns');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

// Google DNS Servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

const HOSTNAME = 'ep-wispy-feather-a1bxexdn-pooler.ap-southeast-1.aws.neon.tech';

console.log(`Resolving ${HOSTNAME} via Google DNS...`);

dns.resolve4(HOSTNAME, (err, addresses) => {
  if (err) {
    console.error('Error resolving DNS:', err);
    process.exit(1);
  }

  if (addresses && addresses.length > 0) {
    const ip = addresses[0];
    console.log(`Successfully resolved to IP: ${ip}`);

    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // We update the hostname in the DATABASE_URL to the raw IP
    // Note: We MUST remove channel_binding=require as it fails with direct IPs
    // and keep sslmode=require for Neon.
    const newHost = ip;
    const oldHost = HOSTNAME;
    
    if (envContent.includes(oldHost)) {
      console.log('Updating .env with direct IP...');
      const updatedContent = envContent
        .replace(oldHost, newHost)
        .replace('&channel_binding=require', '')
        .replace('channel_binding=require&', '')
        .replace('?channel_binding=require', '?');
      
      fs.writeFileSync(envPath, updatedContent);
      console.log('✅ .env updated successfully with direct IP workaround.');
      console.log('Note: Prisma Studio might still need an SNI-aware proxy for some Neon features,');
      console.log('but basic connectivity (db pull/push) should now work.');
    } else {
      console.log('Hostname not found in .env or already updated.');
    }
  } else {
    console.error('No IP addresses found for hostname.');
  }
});
