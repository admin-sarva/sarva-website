import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'
import Stay from '../app/models/stay.js'

const CLOUDINARY_CLOUD_NAME = 'dlk6lycdy'
const CLOUDINARY_UPLOAD_PRESET = 'sarva_uploads'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`

const canonicalPlaces = {
  agumbe: {
    name: 'Agumbe',
    slug: 'agumbe',
    aliases: ['agumbe'],
  },
  coorg: {
    name: 'Coorg',
    slug: 'coorg',
    aliases: ['coorg', 'madikeri', 'kodagu'],
  },
  sakleshpur: {
    name: 'Sakleshpur',
    slug: 'sakleshpur',
    aliases: ['sakleshpur', 'sakaleshpura', 'sakaleshpur'],
  },
  chikkamagalur: {
    name: 'Chikkamagalur',
    slug: 'chikkamagalur',
    aliases: ['chikkamagalur', 'chikkamagaluru', 'chikmagalur'],
  },
  wayanad: {
    name: 'Wayanad',
    slug: 'wayanad',
    aliases: ['wayanad', 'waynad'],
  },
  udupi: {
    name: 'Udupi',
    slug: 'udupi',
    aliases: ['udupi'],
  },
  gokarna: {
    name: 'Gokarna',
    slug: 'gokarna',
    aliases: ['gokarna'],
  },
  ooty: {
    name: 'Ooty',
    slug: 'ooty',
    aliases: ['ooty'],
  },
  coonoor: {
    name: 'Coonoor',
    slug: 'coonoor',
    aliases: ['coonoor', 'conoor'],
    title: 'Coonoor: Tea Gardens, Nilgiri Roads, and Quiet Hill Mornings',
    subtitle: 'A calmer Nilgiri base for tea estates, viewpoints, toy-train charm, and soft mountain weather',
    caption: 'Tea country with gentler crowds and blue mountain air',
    quote: 'Coonoor is Ooty after the volume has been turned down.',
    description: [
      'Coonoor is one of the gentler corners of the Nilgiris, known for tea gardens, old hill roads, cool mornings, and a calmer pace than central Ooty. It works beautifully for guests who want the mountain weather without constantly being inside the busiest tourist circuit.',
      'The town is practical but still scenic. Tea estates wrap around the slopes, viewpoints open suddenly through eucalyptus and shola patches, and the Nilgiri Mountain Railway gives the place a nostalgic character. It is especially good for couples, families, older travellers, and workation guests who prefer slow days.',
      'A good Coonoor trip should not be overloaded. One viewpoint, one tea experience, one quiet meal, and time at the stay can be enough. The destination rewards early mornings and soft evenings more than packed sightseeing.',
      'For Sarva, Coonoor should be positioned as a refined hill pause: tea views, clean air, beautiful stays, and a softer alternative to busier Nilgiri routes.'
    ],
    spots: [
      ['Sim’s Park', 'A landscaped botanical garden with old trees, slopes, and easy walking paths.', 'Sim’s Park is one of Coonoor’s most accessible attractions and works well for families and slower travellers. The terraced layout, old trees, and cool air make it a pleasant low-effort stop.'],
      ['Dolphin’s Nose', 'A dramatic viewpoint looking across valleys, tea slopes, and distant waterfalls.', 'Dolphin’s Nose is a strong scenic outing from Coonoor. The road is part of the experience, with tea gardens and bends leading toward the viewpoint. Clear mornings are best.'],
      ['Lamb’s Rock', 'A viewpoint with layered Nilgiri scenery and a quieter mountain-road feel.', 'Lamb’s Rock pairs well with Dolphin’s Nose and gives travellers a classic Nilgiri valley view. It is a good half-day plan for guests who want scenic drives without hard trekking.'],
      ['Tea Estate Walks', 'A slow way to understand Coonoor through tea slopes, factory stops, and local rhythm.', 'Tea is central to Coonoor’s identity. A tea estate walk or factory visit helps guests connect the landscape with what they drink every morning.'],
      ['Nilgiri Mountain Railway', 'A heritage train experience that adds old-world charm to the hill trip.', 'The toy train is one of the Nilgiris’ signature experiences. It should be planned ahead because seats and timings matter, but it adds a memorable, nostalgic layer to a Coonoor stay.']
    ],
    imageSources: [
      photo('photo-1738207874387-5c98313a3ed5'),
      photo('photo-1661658317007-c051ce96bd7d'),
      photo('photo-1713550668405-6d3b83a74599'),
      photo('photo-1708492320318-d4d9fb0ed2f8'),
      photo('photo-1747801972326-b40678b35815'),
    ],
  },
  mysore: {
    name: 'Mysore',
    slug: 'mysore',
    aliases: ['mysore', 'mysuru'],
    title: 'Mysore: Palaces, Markets, Gardens, and Slow Heritage Days',
    subtitle: 'A heritage city base for palace mornings, silk, sandalwood, food walks, and relaxed family travel',
    caption: 'Royal architecture, old markets, and gentle city evenings',
    quote: 'Mysore is heritage without hurry.',
    description: [
      'Mysore is a heritage-rich city that works differently from the hill and coastal destinations. Its appeal comes from architecture, markets, food, gardens, silk, sandalwood, and a calmer city pace than many large urban centres. It is ideal for families, culture-first travellers, and guests who want comfort with plenty to do nearby.',
      'The palace is the obvious anchor, but Mysore is not only one monument. Devaraja Market, Chamundi Hill, St. Philomena’s Cathedral, Brindavan Gardens, yoga spaces, old eateries, and craft shopping can make the city feel layered and generous.',
      'Mysore also works as a route connector. It can pair with Coorg, Kabini, Bandipur, Srirangapatna, or Chikkamagalur depending on the traveller’s style. A well-planned stay here can become the soft landing before or after a nature-heavy trip.',
      'For Sarva, Mysore should be positioned as a comfortable heritage stop: polished enough for families, interesting enough for culture lovers, and relaxed enough for travellers who do not want a frantic city break.'
    ],
    spots: [
      ['Mysore Palace', 'The city’s landmark palace and the essential first-time Mysore experience.', 'Mysore Palace is the visual centre of the city. Its scale, details, and evening illumination make it memorable for families and first-time visitors. It is best planned with enough time rather than treated as a quick photo stop.'],
      ['Devaraja Market', 'A colourful old market known for flowers, spices, fruits, and local texture.', 'Devaraja Market gives travellers a more lived-in view of Mysore. It is excellent for photography, slow walking, and understanding the city beyond monuments.'],
      ['Chamundi Hill', 'A sacred hilltop route with temple visits and city views.', 'Chamundi Hill adds a spiritual and scenic layer to Mysore. The climb or drive gives perspective over the city, and the temple is an important local landmark.'],
      ['St. Philomena’s Cathedral', 'A striking neo-gothic church and one of Mysore’s most recognisable structures.', 'The cathedral brings architectural variety into a Mysore itinerary and is easy to combine with palace and market visits.'],
      ['Brindavan Gardens', 'A classic evening garden experience near the KRS Dam.', 'Brindavan Gardens is best positioned as a relaxed evening outing, especially for families. It is a familiar attraction, but still useful when guests want a soft end to the day.']
    ],
    imageSources: [
      photo('photo-1600112356915-089abb8fc71a'),
      photo('photo-1589308078059-be1415eab4c3'),
      photo('photo-1606298855672-3efb63017be8'),
      photo('photo-1590766940554-634a7ed41450'),
      photo('photo-1582510003544-4d00b7f74220'),
    ],
  },
}

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

function clean(value) {
  return String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')
}

function inferCanonical(stay) {
  const haystack = clean(`${stay.place || ''} ${stay.name || ''} ${stay.slug || ''}`)
  for (const config of Object.values(canonicalPlaces)) {
    if (config.aliases.some(alias => haystack.includes(alias))) return config
  }
  return null
}

function existingCloudinaryUrls(place) {
  const urls = []
  if (!place) return urls
  for (const url of [place.heroImage, place.image, ...(place.images || [])]) {
    if (typeof url === 'string' && url.includes('res.cloudinary.com') && !urls.includes(url)) urls.push(url)
  }
  return urls
}

async function uploadToCloudinary(url, cache) {
  if (cache.has(url)) return cache.get(url)
  const form = new FormData()
  form.append('file', url)
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok || !data.secure_url) {
    throw new Error(`Cloudinary upload failed for ${url}: ${data.error?.message || res.statusText}`)
  }
  cache.set(url, data.secure_url)
  return data.secure_url
}

function buildSpots(config, urls) {
  return (config.spots || []).map(([name, preview, description], index) => ({
    name,
    preview,
    description,
    image: urls[(index + 1) % urls.length],
    images: [
      urls[(index + 1) % urls.length],
      urls[(index + 2) % urls.length],
      urls[(index + 3) % urls.length],
    ],
  }))
}

async function ensurePlace(config, cache) {
  const existing = await Place.findOne({
    $or: [
      { slug: config.slug },
      { name: new RegExp(`^${config.name}$`, 'i') },
      ...config.aliases.map(alias => ({ slug: new RegExp(`^${alias}$`, 'i') })),
    ],
  })

  let urls = existingCloudinaryUrls(existing)
  if (urls.length < 5 && config.imageSources?.length) {
    urls = []
    for (const source of config.imageSources) urls.push(await uploadToCloudinary(source, cache))
  }

  if (existing) {
    await Place.updateOne(
      { _id: existing._id },
      {
        $set: {
          name: config.name,
          slug: config.slug,
          ...(config.title ? {
            title: config.title,
            subtitle: config.subtitle,
            caption: config.caption,
            quote: config.quote,
            description: config.description,
            heroImage: urls[0],
            image: urls[0],
            images: urls,
            spots: buildSpots(config, urls),
          } : {}),
        },
      }
    )
    return
  }

  await Place.create({
    name: config.name,
    slug: config.slug,
    title: config.title || `${config.name}: A Sarva Destination`,
    subtitle: config.subtitle || `Explore stays and experiences around ${config.name}.`,
    caption: config.caption || config.name,
    quote: config.quote || `${config.name} is ready when you are.`,
    description: config.description || [
      `${config.name} has stays listed in Sarva and needs a richer destination guide.`,
      'Use the admin panel to refine this page with real local details, photos, and tourist spots.',
    ],
    heroImage: urls[0],
    image: urls[0],
    images: urls,
    spots: buildSpots(config, urls),
  })
}

loadEnv()
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const cache = new Map()
const stays = await Stay.find({})
const seenPlaceSlugs = new Set()
let updatedStays = 0
const unresolved = []

for (const stay of stays) {
  const config = inferCanonical(stay)
  if (!config) {
    unresolved.push({ name: stay.name, slug: stay.slug, place: stay.place })
    continue
  }

  seenPlaceSlugs.add(config.slug)
  const updates = {}
  if (stay.place !== config.name) updates.place = config.name

  const cleanSlug = String(stay.slug || '').trim()
  if (cleanSlug && cleanSlug !== stay.slug) updates.slug = cleanSlug

  if (Object.keys(updates).length > 0) {
    await Stay.updateOne({ _id: stay._id }, { $set: updates })
    updatedStays += 1
    console.log(`Updated stay: ${stay.name} -> place=${updates.place || stay.place}`)
  }
}

for (const slug of seenPlaceSlugs) {
  await ensurePlace(canonicalPlaces[slug], cache)
  console.log(`Ensured place: ${canonicalPlaces[slug].name}`)
}

console.log(`Updated stays: ${updatedStays}`)
console.log(`Ensured places from stays: ${seenPlaceSlugs.size}`)
console.log(`Unresolved stays: ${unresolved.length}`)
if (unresolved.length) console.log(JSON.stringify(unresolved, null, 2))

await mongoose.disconnect()
