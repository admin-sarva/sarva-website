import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'
import Stay from '../app/models/stay.js'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const [, key, rawValue] = match
      if (!process.env[key]) process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
    }
  }
}

loadEnv()
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const [places, stays] = await Promise.all([
  Place.find({}).sort({ name: 1 }),
  Stay.find({}).sort({ place: 1, name: 1 }),
])

const staysByPlace = stays.reduce((acc, stay) => {
  const key = stay.place || '(missing)'
  acc[key] ||= []
  acc[key].push({ name: stay.name, slug: stay.slug })
  return acc
}, {})

console.log('Places:')
for (const place of places) {
  console.log(`- ${place.name} | slug=${place.slug}`)
}

console.log('\nStay place groups:')
for (const [place, items] of Object.entries(staysByPlace)) {
  console.log(`- ${place}: ${items.length}`)
  for (const item of items) console.log(`  - ${item.name} (${item.slug})`)
}

await mongoose.disconnect()
