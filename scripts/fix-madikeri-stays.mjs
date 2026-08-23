import fs from 'node:fs'
import mongoose from 'mongoose'
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
await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const result = await Stay.updateMany(
  { name: /madikeri/i },
  { $set: { place: 'Madikeri' } }
)

console.log(`Matched: ${result.matchedCount}`)
console.log(`Modified: ${result.modifiedCount}`)

await mongoose.disconnect()
