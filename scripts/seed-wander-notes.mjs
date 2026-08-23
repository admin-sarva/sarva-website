import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'
import Note from '../app/models/note.js'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue

    const env = fs.readFileSync(file, 'utf8')
    for (const line of env.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match) continue

      const [, key, rawValue] = match
      const value = rawValue.replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  }
}

const notes = {
  agumbe: {
    title: 'A Rainy Morning in Agumbe',
    slug: 'rainy-morning-in-agumbe',
    summary: 'A slow note from the rainforest, where the road, rain, and silence all arrive together.',
    content: `Agumbe does not announce itself with a grand entrance. It gathers around you slowly. The road becomes wetter, the trees come closer, and somewhere between two bends the outside world begins to feel very far away.

The best morning here starts before breakfast. Step outside while the air is still cool and the village is only half awake. The forest sounds different at that hour: not loud, but layered. Leaves drip from last night's rain. A bird calls from somewhere you cannot see. The mist sits low enough to make even a familiar road feel secret.

This is the kind of place where plans should stay loose. Kundadri Hill is worth an early start if the sky is clear, but even a misty morning has its own reward. Waterfalls may be powerful after rain, trails may be slippery, and viewpoints may disappear into cloud. Agumbe teaches you not to treat weather as an obstacle. Here, weather is the experience.

Carry proper shoes, a light rain jacket, and patience. Do not rush the forest. Walk softly, keep distance from wildlife, and let the place stay wild enough for the next traveller.`
  },
  coorg: {
    title: 'Coffee Before the Day Begins in Coorg',
    slug: 'coffee-before-the-day-begins-in-coorg',
    summary: 'A warm estate-side note on coffee walks, wet roads, and the gentler side of Kodagu.',
    content: `In Coorg, coffee is not just served in a cup. It is around you: in the shade trees, in the red soil, in the silver oak trunks, in the morning air before the kitchen opens.

The loveliest way to understand Coorg is to stay slightly away from the rush of town. Wake early, take a slow estate walk, and let someone explain what grows around you. Pepper climbs the trees. Coffee plants sit under filtered light. Rain changes the smell of everything. It is simple, but it stays with you.

Abbey Falls and Raja's Seat are popular for a reason, especially for first-time visitors, but the quieter memories usually happen between those stops. A bend in the road. A small meal at the stay. A conversation with a host about harvest, weather, or family recipes.

Coorg is best when the itinerary leaves room to breathe. Do one or two things well each day. Drink the coffee hot. Watch the clouds move across the plantations. Let Kodagu be more than a checklist.`
  },
  sakleshpur: {
    title: 'The Green Roads of Sakleshpur',
    slug: 'green-roads-of-sakleshpur',
    summary: 'A weekend note from coffee hills, fort views, rain-washed roads, and slow Malnad stays.',
    content: `Sakleshpur is a destination made of roads as much as places. The drive rolls through coffee estates, wet fields, low clouds, and bends that make you slow down without thinking.

Manjarabad Fort is a good first stop because it gives the region a shape. From above, the hills look soft and layered, especially after rain. But Sakleshpur's real charm often waits outside the famous stops: in estate paths, homestay verandas, and the smell of coffee drying somewhere nearby.

If you like active days, ask locally about safe routes to viewpoints or railway-trail experiences. Access and conditions change, especially in the monsoon, so do not rely on old internet promises. If you like quiet days, choose a stay with a view and let the weather make the plan.

Sakleshpur works beautifully for a two-night reset from Bengaluru. Arrive before dark, keep one flexible day for exploration, and save the last morning for doing almost nothing.`
  },
  madikeri: {
    title: 'Madikeri, the Easy Doorway Into Coorg',
    slug: 'madikeri-doorway-into-coorg',
    summary: 'A practical wander note for first-time Coorg travellers using Madikeri as a gentle base.',
    content: `Madikeri is not the quietest part of Coorg, but it is one of the easiest places to begin. For first-time visitors, that matters. Food, viewpoints, waterfalls, markets, and estate roads all sit within reach.

Start with the classics if you have never been: Raja's Seat for the valley view, Abbey Falls for the sound and spray, and a short town walk if you want a sense of local rhythm. Then leave space for the better part of the trip: the roads outside town.

A stay just beyond Madikeri often gives you the best of both worlds. You can reach town when needed, but wake up closer to plantations and quieter mornings. That balance is why Madikeri works for families, couples, and workation guests.

The trick is not to overload the day. Coorg roads are part of the experience, but they take time. Plan fewer stops, eat properly, and let the evening be slow.`
  },
  ooty: {
    title: 'Ooty Without the Rush',
    slug: 'ooty-without-the-rush',
    summary: 'A calmer way to see the Nilgiris: early starts, garden walks, lake air, and quieter edges.',
    content: `Ooty can feel crowded if you meet it at the wrong hour. But arrive gently, wake early, and choose your corners well, and the old hill station still has its charm.

The lake is best before the day grows noisy. The Botanical Garden rewards slow walking more than quick photos. Doddabetta depends on visibility, but the drive itself carries that cool Nilgiri feeling: eucalyptus, tea, fog, and sudden blue gaps in the sky.

The smartest Ooty trip balances the famous with the quiet. Stay away from the busiest centre if you can. Keep one day for the classic sights and another for softer routes toward Coonoor, Avalanche, or tea-country roads.

Ooty is not about discovering something untouched. It is about finding calm inside a place many people already love. Timing, stay location, and pace make all the difference.`
  },
  wayanad: {
    title: 'Wayanad in Layers of Green',
    slug: 'wayanad-layers-of-green',
    summary: 'A forest-side note on Wayanad’s viewpoints, waterfalls, caves, and cabin-friendly quiet.',
    content: `Wayanad is not one single mood. It changes as you move through it: mist at Lakkidi, forest near Vythiri, practical town energy around Kalpetta, open water near Banasura, and older stories at Edakkal.

A short trip should not try to cover every corner. Pick a base and choose a rhythm. Active travellers can plan Chembra or other guided routes if permissions allow. Families can combine Banasura, waterfalls, and easier viewpoints. Couples may enjoy doing less and staying somewhere green enough to make the room feel like part of the destination.

The district rewards early starts. Waterfalls are better before crowds, viewpoints are softer in morning light, and drives feel calmer before the day fills up. Carry water, check access rules, and keep weather in mind.

Wayanad is at its best when you let it stay layered. One forest road, one meal, one viewpoint, one long silence. That is enough for a day.`
  },
  chikkamagalur: {
    title: 'Coffee Country Mornings in Chikkamagalur',
    slug: 'coffee-country-mornings-in-chikkamagalur',
    summary: 'A note from Karnataka’s coffee slopes: peaks, plantation walks, and unhurried hill roads.',
    content: `Chikkamagalur begins well with coffee and a view. The region has big names like Mullayanagiri and Baba Budangiri, but its quieter strength is the feeling of waking up inside coffee country.

If you are staying on or near an estate, start there. Walk before the day warms. Notice the shade trees, the pepper vines, the red mud, the birds, and the way the plantation changes after rain. This is the part of Chikkamagalur no viewpoint can replace.

For a more active day, head toward Mullayanagiri early. The road can get busy, but the open mountain air is worth it when the weather is kind. Baba Budangiri adds another layer, with cultural memory and dramatic slopes. Hirekolale Lake is useful when you want the evening to be softer.

Chikkamagalur works when you do not treat it as only a peak-hopping trip. Let the coffee estates hold the centre, and let the mountains become the day trips around them.`
  },
  udupi: {
    title: 'Temple Bells and Sea Air in Udupi',
    slug: 'temple-bells-and-sea-air-in-udupi',
    summary: 'A coastal note that moves from Krishna Matha mornings to Malpe sunsets and island light.',
    content: `Udupi has two rhythms, and the best trip makes room for both. One belongs to the temple streets: bells, food, rituals, and the steady movement around Sri Krishna Matha. The other belongs to the coast: Malpe, ferries, lighthouse evenings, and the smell of salt in the air.

Start in town if you want to understand the place. Visit respectfully, eat slowly, and notice how food is part of Udupi's identity. Then move toward the sea. Malpe is easy and accessible, especially for families. St. Mary's Island is memorable when ferry services and weather allow. Kaup Beach gives you a stronger sunset frame.

Udupi is not a destination that needs to shout. It is practical, layered, and generous. It can hold a spiritual morning and a beach evening without either feeling out of place.

For a longer coastal route, it pairs beautifully with Mangalore, Kundapura, Maravanthe, Murudeshwar, and Gokarna.`
  },
  gokarna: {
    title: 'Walking the Beach Trail in Gokarna',
    slug: 'walking-the-beach-trail-in-gokarna',
    summary: 'A slower coastal note from Om Beach, Kudle, temple lanes, cliffs, and sunset paths.',
    content: `Gokarna is best understood on foot. Not all of it, not in a hurry, but enough to feel how the town and beaches connect. Temple lanes, Main Beach, Kudle, Om, Half Moon, Paradise: each has a different mood.

Om Beach is the classic first stop, and it deserves the attention. Kudle feels softer and more relaxed. The smaller beaches need more care with access, season, and local advice. Do not treat the trail like a race. Carry water, start early, and know when to turn back.

The town side matters too. Gokarna is not only a beach escape; it is also a temple town with its own rhythm. That mix is what keeps it from feeling like a copy of somewhere else.

The best Gokarna day is simple: a slow breakfast, one beach walk, a swim only where safe, a long sunset, and no pressure to prove you saw everything.`
  }
}

loadEnv()

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing. Add it to .env or .env.local before seeding notes.')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sarva',
  bufferCommands: false,
})

let updated = 0

for (const [placeSlug, note] of Object.entries(notes)) {
  const place = await Place.findOne({ slug: placeSlug })
  const image = place?.heroImage || place?.images?.[0]

  if (!image) {
    console.log(`Skipped ${note.title}: no image found for ${placeSlug}`)
    continue
  }

  await Note.updateOne(
    { slug: note.slug },
    {
      $set: {
        ...note,
        place: place?.name || placeSlug,
        image,
        status: 'approved',
      },
    },
    { upsert: true, runValidators: true }
  )

  updated += 1
  console.log(`Upserted wander note: ${note.title}`)
}

console.log(`Approved wander notes upserted: ${updated}`)

await mongoose.disconnect()
