#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import dns from 'dns/promises'
import net from 'net'

async function tryConnect(address, port, timeout = 5000) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let finished = false
    socket.setTimeout(timeout)
    socket.once('connect', () => {
      finished = true
      socket.destroy()
      resolve({ address, port, ok: true })
    })
    socket.once('timeout', () => {
      if (finished) return
      finished = true
      socket.destroy()
      resolve({ address, port, ok: false, err: 'timeout' })
    })
    socket.once('error', (err) => {
      if (finished) return
      finished = true
      resolve({ address, port, ok: false, err: err && err.message })
    })
    socket.connect(port, address)
  })
}

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {}
  const text = fs.readFileSync(envPath, 'utf8')
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let [, key, val] = m
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

async function main() {
  const cwd = process.cwd()
  const envPath = path.join(cwd, '.env.local')
  const env = parseEnvFile(envPath)
  const uri = env.MONGODB_URI || process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local or process.env')
    process.exit(2)
  }

  // Extract host part from mongodb+srv URI
  const atMatch = uri.match(/@([^/]+)(?:\/|$)/)
  let hostPart = null
  if (atMatch) hostPart = atMatch[1].split(',')[0]
  else {
    const m2 = uri.match(/mongodb(?:\+srv)?:\/\/([^/]+)(?:\/|$)/)
    hostPart = m2 ? m2[1].split(',')[0] : null
  }
  if (!hostPart) {
    console.error('Could not parse host from MONGODB_URI:', uri)
    process.exit(3)
  }
  console.log('Parsed host from MONGODB_URI ->', hostPart)

  const srvName = `_mongodb._tcp.${hostPart}`
  try {
    console.log('Resolving SRV records for', srvName)
    const srv = await dns.resolveSrv(srvName)
    console.log('Found SRV records:')
    console.log(srv)

    const results = []
    for (const r of srv) {
      const target = r.name || r.exchange || r.host || r.target || r
      const port = r.port || 27017
      let ips = []
      try {
        const addrs = await dns.lookup(target, { all: true })
        ips = addrs.map((a) => a.address)
      } catch (e) {
        ips = [`DNS lookup failed: ${e && e.message}`]
      }

      const connects = []
      // try connecting to target hostname
      connects.push(await tryConnect(target, port))
      // try each resolved ip
      for (const ip of ips) {
        if (typeof ip === 'string' && ip.startsWith('DNS lookup failed')) continue
        connects.push(await tryConnect(ip, port))
      }

      results.push({ target, port, ips, connects })
    }

    console.log('\nConnectivity results:')
    console.log(JSON.stringify(results, null, 2))
    process.exit(0)
  } catch (err) {
    console.error('Error resolving SRV or testing connectivity:', err && err.message ? err.message : err)
    console.log('Falling back to direct connect test to', hostPart, ':27017')
    const res = await tryConnect(hostPart, 27017)
    console.log('Direct connect result:', res)
    process.exit(1)
  }
}

main()
