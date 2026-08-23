import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'

function loadEnv() {
  if (!fs.existsSync('.env')) return

  const env = fs.readFileSync('.env', 'utf8')
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue

    const [, key, rawValue] = match
    const value = rawValue.replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

const img = (file, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`

const places = [
  {
    name: 'Sakleshpur',
    slug: 'sakleshpur',
    title: 'Sakleshpur: Coffee Hills and Rain-Washed Trails',
    subtitle: 'A Western Ghats escape for bridges, plantations, and slow monsoon drives',
    heroImage: img('Sakaleshpura- greenery.jpg'),
    quote: 'In Sakleshpur, the road itself feels like part of the stay.',
    caption: 'Rails, rain, and the smell of raw coffee',
    image: img('Sakaleshpura- greenery.jpg', 900),
    description: [
      'Sakleshpur sits in the green folds of Hassan district, where coffee estates, forest roads, and old railway trails shape the rhythm of a trip.',
      'It works beautifully for families, groups, and nature-first weekends because the days can stay simple: plantation walks, viewpoints, fort visits, and long conversations over hot food.',
      'The best pages for Sakleshpur should feel practical and earthy: show the roads, the hills, the mist, and the kind of stays that make a rainy weekend feel easy.'
    ],
    images: [
      img('Near Sakleshpur (6586774815).jpg'),
      img('View from Agani peak,Sakleshpur (1).jpg'),
      img('Sakleshpur scenario.jpg'),
      img('Hues of Green at the Western Ghats.jpg')
    ],
    spots: [
      {
        name: 'Manjarabad Fort',
        image: img('Sakleshpur (26335645202).jpg', 900),
        preview: 'A star-shaped hill fort with open views across the Western Ghats.',
        description: 'A good first stop for guests who want history, a short climb, and a wide view before heading deeper into plantation country.',
        images: [img('Sakleshpur (26335645202).jpg'), img('Sakleshpur (26361802221).jpg')]
      },
      {
        name: 'Agani Peak View',
        image: img('View from Agani peak,Sakleshpur (1).jpg', 900),
        preview: 'Layered hills and open sky, especially beautiful after rain.',
        description: 'A scenic viewpoint experience that fits well into slow itineraries and photography-led trips.',
        images: [img('View from Agani peak,Sakleshpur (1).jpg'), img('View from Agani peak, sakleshpur (3).jpg')]
      }
    ]
  },
  {
    name: 'Madikeri',
    slug: 'madikeri',
    title: 'Madikeri: The Coffee Heart of Coorg',
    subtitle: 'Estate roads, Kodava warmth, and misty hill mornings',
    heroImage: img("Panoramic view of Madikeri from Raja's seat.JPG"),
    quote: 'Madikeri is where coffee, rain, and memory sit at the same table.',
    caption: 'Where time brews like fresh filter coffee',
    image: img('Coffee Plantation in Coorg..jpg', 900),
    description: [
      'Madikeri is the classic Coorg base: close to coffee estates, waterfalls, viewpoints, local food, and relaxed hill-stay experiences.',
      'It is a strong destination page for couples, families, workations, and anyone who wants a softer hill trip without losing access to things to do.',
      'Use this page to sell Coorg with clarity: estate stays, short drives, coffee walks, cultural meals, waterfalls, and weather that makes people slow down.'
    ],
    images: [
      img('Coffee Plantation in Coorg..jpg'),
      img("Panoramic view of Madikeri from Raja's seat.JPG"),
      img('Madikeri.jpg'),
      img('Madikeri Kodagu.jpg')
    ],
    spots: [
      {
        name: "Raja's Seat",
        image: img("Panoramic view of Madikeri from Raja's seat.JPG", 900),
        preview: 'A familiar Coorg viewpoint for valley views and sunset air.',
        description: 'A simple, accessible stop that gives visitors the hill-station feeling without needing a long trek.',
        images: [img("Panoramic view of Madikeri from Raja's seat.JPG"), img('Madikeri.jpg')]
      },
      {
        name: 'Coffee Estate Walks',
        image: img('Coffee Plantation in Coorg..jpg', 900),
        preview: 'Plantation paths, local stories, and slow mornings.',
        description: 'Estate walks are one of the easiest ways to make a Coorg stay feel grounded and memorable.',
        images: [img('Coffee Plantation in Coorg..jpg'), img('Madikeri Kodagu.jpg')]
      }
    ]
  },
  {
    name: 'Ooty',
    slug: 'ooty',
    title: 'Ooty: Eucalyptus Wind and Blue Mountain Calm',
    subtitle: 'A cool highland pause with lakes, gardens, and old hill-station charm',
    heroImage: img('Ooty Lake (16475137375).jpg'),
    quote: 'Ooty turns ordinary mornings into something colder, quieter, and clearer.',
    caption: 'Colonial calm wrapped in eucalyptus wind',
    image: img('Ooty Lake (16475137375).jpg', 900),
    description: [
      'Ooty is a familiar hill-station escape, but it still works when the page focuses on the right feeling: crisp air, garden walks, lake views, and cozy stays.',
      'It is useful for families, couples, and guests who want colder weather without a difficult itinerary.',
      'The content should balance romance and utility: show lake access, viewpoints, travel time, stay style, and what kind of visitor Ooty suits best.'
    ],
    images: [
      img('Ooty Lake (16475137375).jpg'),
      img('Ooty lake 2.jpg'),
      img('Ooty Lake Morning View.jpg'),
      img('West Mere, Ooty, Tamil Nadu, India - panoramio (2).jpg')
    ],
    spots: [
      {
        name: 'Ooty Lake',
        image: img('Ooty Lake (16475137375).jpg', 900),
        preview: 'A classic lake stop for boating, walks, and easy family time.',
        description: 'A practical anchor for first-time Ooty visitors and a useful reference point for nearby stays.',
        images: [img('Ooty Lake (16475137375).jpg'), img('Ooty lake 2.jpg')]
      },
      {
        name: 'West Mere Views',
        image: img('West Mere, Ooty, Tamil Nadu, India - panoramio (2).jpg', 900),
        preview: 'Quiet waters, soft light, and the Nilgiris at their gentler pace.',
        description: 'A softer visual counterpoint to the busier tourist circuit.',
        images: [img('West Mere, Ooty, Tamil Nadu, India - panoramio (2).jpg'), img('Ooty Lake Morning View.jpg')]
      }
    ]
  },
  {
    name: 'Wayanad',
    slug: 'wayanad',
    title: 'Wayanad: Forest Edges and High Green Trails',
    subtitle: 'Kerala hill country for cabins, treks, waterfalls, and wildlife moods',
    heroImage: img('Chembra Peak Heart Lake.jpg'),
    quote: 'Wayanad does not perform wilderness. It lets you enter it slowly.',
    caption: "Kerala's forest heart, always listening",
    image: img('Chembra Peak Heart Lake.jpg', 900),
    description: [
      'Wayanad gives Sarva a strong forest-and-cabin destination: hills, tea, waterfalls, wildlife edges, and stays that feel tucked into green.',
      'It is ideal for photographers, families, couples, and small groups who want a nature-forward itinerary with enough comfort around it.',
      'The destination page should make the experience easy to choose: treks for active guests, cabins for quiet guests, and scenic drives for families.'
    ],
    images: [
      img('Chembra Peak Heart Lake.jpg'),
      img('Chembra peak,wayanad.jpg'),
      img('View from Banasura Sagar Dam.jpg'),
      img('Tea plantations, Chembra peak, Western Ghats Kerala.jpg')
    ],
    spots: [
      {
        name: 'Chembra Peak',
        image: img('Chembra Peak Heart Lake.jpg', 900),
        preview: 'A well-known Wayanad trek with high grassland views.',
        description: 'Best positioned as the active, iconic experience for guests who want a trek-led stay.',
        images: [img('Chembra Peak Heart Lake.jpg'), img('Chembra peak,wayanad.jpg')]
      },
      {
        name: 'Banasura Sagar Views',
        image: img('View from Banasura Sagar Dam.jpg', 900),
        preview: 'Wide water, hill silhouettes, and a calmer family-friendly outing.',
        description: 'A scenic day-plan option for guests who want views without a hard trek.',
        images: [img('View from Banasura Sagar Dam.jpg'), img('Tea plantations, Chembra peak, Western Ghats Kerala.jpg')]
      }
    ]
  },
  {
    name: 'Chikkamagalur',
    slug: 'chikkamagalur',
    title: 'Chikkamagalur: Coffee Slopes and Mountain Roads',
    subtitle: 'Plantations, peaks, and soft hillside stays in Karnataka coffee country',
    heroImage: img('Mountain Western Ghats Chikmaglur Karnataka.jpg'),
    quote: 'Chikkamagalur is best when the day begins with coffee and has no hurry after it.',
    caption: 'Where mornings walk through mist',
    image: img('Mountain Western Ghats Chikmaglur Karnataka.jpg', 900),
    description: [
      'Chikkamagalur is one of the strongest stay-led destinations for Sarva because coffee estates, hill roads, waterfalls, and viewpoints naturally support weekend travel.',
      'It works for couples, birdwatchers, families, bikers, and anyone who wants a scenic stay without overplanning.',
      'Use the page to connect stays with plantation walks, sunrise drives, easy treks, and the feeling of waking up inside coffee country.'
    ],
    images: [
      img('Mountain Western Ghats Chikmaglur Karnataka.jpg'),
      img('Tea Estates in Kudremukh (22113499622).jpg'),
      img('Charmadi ghat 2.jpg'),
      img('Bababudans.jpg')
    ],
    spots: [
      {
        name: 'Baba Budangiri',
        image: img('Bababudans.jpg', 900),
        preview: 'Hill roads, coffee history, and wide Western Ghats views.',
        description: 'A useful scenic anchor for Chikkamagalur itineraries, especially for guests who enjoy drives and viewpoints.',
        images: [img('Bababudans.jpg'), img('Mountain Western Ghats Chikmaglur Karnataka.jpg')]
      },
      {
        name: 'Coffee Country Roads',
        image: img('Tea Estates in Kudremukh (22113499622).jpg', 900),
        preview: 'Green estates and slow roads that define the stay experience.',
        description: 'Position this as the mood of the trip: plantation mornings, quiet afternoons, and easy drives.',
        images: [img('Tea Estates in Kudremukh (22113499622).jpg'), img('Charmadi ghat 2.jpg')]
      }
    ]
  },
  {
    name: 'Udupi',
    slug: 'udupi',
    title: 'Udupi: Temple Town, Beach Air, and Island Light',
    subtitle: 'A coastal base for Malpe, St. Marys Island, temples, and seafood evenings',
    heroImage: img('Udupi Beach.jpg'),
    quote: 'Udupi carries the coast gently: prayer in the morning, salt air by evening.',
    caption: 'Coastal divinity and temple bells',
    image: img('Udupi Beach.jpg', 900),
    description: [
      'Udupi gives Sarva a coastal destination that is more layered than a beach stop: temples, Malpe Beach, island trips, food, and relaxed family-friendly stays.',
      'It suits families, coastal road trips, temple travelers, and guests who want sea air without a party-heavy beach scene.',
      'The page should show both sides clearly: spiritual Udupi and breezy Malpe, with stay recommendations that make either rhythm easy.'
    ],
    images: [
      img('Udupi Beach.jpg'),
      img('Malpe Beach, Udupi.jpg'),
      img('Malpe Beach Aerial view.jpg'),
      img("St Mary's Island view.jpg")
    ],
    spots: [
      {
        name: 'Malpe Beach',
        image: img('Udupi Beach.jpg', 900),
        preview: 'A broad beach base for families, sunsets, and island ferries.',
        description: 'A practical coastal anchor for Udupi stays, especially for guests who want the sea nearby.',
        images: [img('Udupi Beach.jpg'), img('Malpe Beach, Udupi.jpg')]
      },
      {
        name: 'St. Marys Island',
        image: img("St Mary's Island view.jpg", 900),
        preview: 'Island rocks, sea views, and a memorable half-day trip from Malpe.',
        description: 'A strong visual experience to include in Udupi itineraries when ferry conditions allow.',
        images: [img("St Mary's Island view.jpg"), img('St Marys Island, Udupi.jpg')]
      }
    ]
  },
  {
    name: 'Gokarna',
    slug: 'gokarna',
    title: 'Gokarna: Beach Trails for Quieter Souls',
    subtitle: 'Sea cliffs, temple streets, and slow beach-to-beach walks',
    heroImage: img('Gokarna Main Beach.jpg'),
    quote: 'Gokarna is the coast after it has stopped trying to impress anyone.',
    caption: 'Beach trails for quiet souls',
    image: img('Gokarna Main Beach.jpg', 900),
    description: [
      'Gokarna works best as a quieter coastal page: beaches, cliff walks, temple lanes, sunsets, and stays that are more relaxed than flashy.',
      'It suits couples, friends, solo travelers, and guests who want the sea without making the trip feel crowded.',
      'The page should make it easy to compare moods: Main Beach for access, Om Beach for the classic view, Kudle for sunsets, and quieter coves for slow days.'
    ],
    images: [
      img('Gokarna Main Beach.jpg'),
      img('Western Ghats, Gokarna.jpg'),
      img('Sunset time at Gokarna beach.jpg'),
      img('1-Halfmoon beach Gokarna Karnatak India.jpg')
    ],
    spots: [
      {
        name: 'Main Beach',
        image: img('Gokarna Main Beach.jpg', 900),
        preview: 'The accessible beach face of Gokarna, close to town and temples.',
        description: 'A useful base point for first-time visitors and guests who want easy beach access.',
        images: [img('Gokarna Main Beach.jpg'), img('Gokarna Beach IMG 20181130 114401.jpg')]
      },
      {
        name: 'Half Moon Beach',
        image: img('1-Halfmoon beach Gokarna Karnatak India.jpg', 900),
        preview: 'A quieter cove reached through the beach trail circuit.',
        description: 'Good for guests who want Gokarna to feel slower, more scenic, and less crowded.',
        images: [img('1-Halfmoon beach Gokarna Karnatak India.jpg'), img('2-Halfmoon beach Gokarna Karnatak India.jpg')]
      }
    ]
  }
]

loadEnv()

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing. Add it to .env before seeding places.')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sarva',
  bufferCommands: false,
})

const before = await Place.countDocuments()

for (const place of places) {
  await Place.updateOne(
    { slug: place.slug },
    { $set: place },
    { upsert: true, runValidators: true }
  )
  console.log(`Upserted ${place.name} (${place.slug})`)
}

const after = await Place.countDocuments()
console.log(`Places before: ${before}`)
console.log(`Places after: ${after}`)

await mongoose.disconnect()
