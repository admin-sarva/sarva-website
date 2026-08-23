import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'

const CLOUDINARY_CLOUD_NAME = 'dlk6lycdy'
const CLOUDINARY_UPLOAD_PRESET = 'sarva_uploads'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`

const sourceImages = {
  agumbe: [
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1713550668405-6d3b83a74599'),
    photo('photo-1713550668405-6d3b83a74599'),
  ],
  coorg: [
    photo('photo-1713550668405-6d3b83a74599'),
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
  sakleshpur: [
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1713550668405-6d3b83a74599'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
  madikeri: [
    photo('photo-1713550668405-6d3b83a74599'),
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
  ooty: [
    photo('photo-1738207874387-5c98313a3ed5'),
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1713550668405-6d3b83a74599'),
  ],
  wayanad: [
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1713550668405-6d3b83a74599'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
  chikkamagalur: [
    photo('photo-1661658317007-c051ce96bd7d'),
    photo('photo-1713550668405-6d3b83a74599'),
    photo('photo-1708492320318-d4d9fb0ed2f8'),
    photo('photo-1747801972326-b40678b35815'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
  udupi: [
    photo('photo-1580713127239-6954a0a33279'),
    photo('photo-1767027663311-7d6572de0f90'),
    photo('photo-1580713127239-6954a0a33279'),
    photo('photo-1767027663311-7d6572de0f90'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
  gokarna: [
    photo('photo-1767027663311-7d6572de0f90'),
    photo('photo-1580713127239-6954a0a33279'),
    photo('photo-1767027663311-7d6572de0f90'),
    photo('photo-1580713127239-6954a0a33279'),
    photo('photo-1738207874387-5c98313a3ed5'),
  ],
}

const content = {
  agumbe: {
    name: 'Agumbe',
    title: 'Agumbe: Rainforest, Mist, and Monsoon Silence',
    subtitle: 'A Western Ghats village for rain lovers, forest walks, waterfalls, and slow green mornings',
    caption: 'Where the monsoon writes its own story',
    quote: 'Agumbe is not a place you rush through. It asks you to listen first.',
    description: [
      'Agumbe is one of the most atmospheric rainforest destinations in Karnataka, sitting deep in the Western Ghats where the air feels wet, green, and alive. It is known for heavy monsoon rain, dense forest, mossy paths, frogs, birds, reptiles, and those sudden openings where the hills fall away into layers of mist. This is not a destination for packed sightseeing. It is for travellers who want the weather to become part of the trip.',
      'A good Agumbe itinerary moves slowly. Mornings are best for forest edges, village walks, and drives through wet canopy roads. Afternoons can be used for waterfalls or nearby viewpoints, depending on rain and local access. Evenings are for staying still: watching cloud banks move, listening to insects, and letting the forest become louder as the light drops.',
      'The place suits couples, writers, photographers, naturalists, and small groups who enjoy quiet stays over crowded attractions. It also works beautifully as part of a longer Malnad route with Sringeri, Thirthahalli, Kundadri, and the coast. Guests should carry rain protection, proper shoes, and a flexible plan because weather decides the rhythm here.',
      'Sarva should position Agumbe as a deep-nature retreat. The promise is not luxury in the loud sense; it is immersion. Forest stays, simple food, warm hosts, rainy drives, and the feeling of being far from the speed of daily life are the real reasons to come.'
    ],
    spots: [
      ['Kundadri Hill', 'A hilltop Jain shrine and viewpoint where sunrise often appears above a sheet of mist.', 'Kundadri is one of the most memorable experiences near Agumbe. The road climbs through quiet forest and opens into a bare hilltop with an old Jain temple, a small pond, and wide views over the Western Ghats. It is best visited early in the morning when the valley is still soft with fog. The place is simple, but the mood is powerful: wind, stone, silence, and a horizon that changes every few minutes.'],
      ['Barkana Falls', 'A seasonal waterfall experience wrapped in thick rainforest and monsoon drama.', 'Barkana Falls is usually spoken of with the monsoon because that is when the landscape feels most alive. Access and visibility depend on season and local conditions, so it should be planned with flexibility. For visitors who enjoy wild scenery, the attraction is not only the fall itself but the road, the forest, the humidity, and the feeling of entering a landscape that has not been overly polished for tourism.'],
      ['Onake Abbi Falls', 'A forest trail leading toward one of Agumbe’s quieter waterfall experiences.', 'Onake Abbi is for travellers who want some movement in their day. The trail can be slippery in wet months, so proper footwear matters. It gives guests a chance to experience Agumbe on foot rather than only from a car window: leaves underfoot, water sounds growing louder, and the green density that makes this region special.'],
      ['Agumbe Sunset Point', 'A classic Western Ghats viewpoint for layered hills and glowing evening skies.', 'Sunset Point is one of the easiest ways for first-time visitors to understand Agumbe’s setting. On clear evenings, the view opens across a long green drop toward the coast. On misty days, the drama is different but still beautiful, with clouds moving fast and swallowing the road. It is a good soft activity for families and couples.'],
      ['Rainforest Research Station', 'A biodiversity stop connected to Agumbe’s reputation for rainforest conservation.', 'Agumbe’s rainforest identity is strongly tied to reptiles, amphibians, and conservation work. A research-station visit or nature-led interaction, where available, gives travellers context beyond photographs. It helps guests understand why this region matters ecologically and why responsible travel behaviour is important here.']
    ]
  },
  coorg: {
    name: 'Coorg',
    title: 'Coorg: Coffee Estates, Kodava Warmth, and Hill Country Calm',
    subtitle: 'A classic Karnataka escape for plantations, waterfalls, viewpoints, and slow estate stays',
    caption: 'Coffee country with rain, stories, and green roads',
    quote: 'Coorg feels best when the day begins with coffee and has no hurry after it.',
    description: [
      'Coorg, also called Kodagu, is one of South India’s most loved hill destinations because it combines natural beauty with a strong local identity. Coffee plantations, pepper vines, silver oak shade, misty roads, homestays, Kodava food, waterfalls, and viewpoints all sit close enough to make travel feel easy. It is familiar, but when planned well it still feels personal.',
      'The best Coorg trip is not just a checklist of places. It is an estate morning, a waterfall stop, a local meal, a viewpoint at golden hour, and a stay that lets guests hear rain on the roof. The region works for couples, families, friend groups, and workation travellers because it has both comfort and nature.',
      'Coorg has many travel moods. Madikeri gives access and convenience. Plantation belts around Suntikoppa, Siddapura, Virajpet, and Somwarpet feel quieter. Abbey Falls and Raja’s Seat are popular, while coffee walks, estate trails, and local food experiences give the trip its texture.',
      'For Sarva, Coorg should be presented as a stay-led destination. Guests are not only booking a room; they are choosing a rhythm: coffee before breakfast, green roads during the day, and evenings that smell of wet soil and woodsmoke.'
    ],
    spots: [
      ['Abbey Falls', 'A popular waterfall near Madikeri surrounded by coffee and spice estates.', 'Abbey Falls is one of Coorg’s most recognisable stops and works well for first-time visitors. The walk is short, the sound of water builds before the view opens, and the surrounding plantation setting gives it a distinctly Coorg feeling. It is busiest during peak hours, so early visits are better for guests who want photographs and a calmer experience.'],
      ['Raja’s Seat', 'A garden viewpoint in Madikeri known for sunsets and valley views.', 'Raja’s Seat is easy to access and good for families, older travellers, and guests who want a relaxed evening plan. The view is the main draw, especially when clouds move across the valley. It pairs well with a Madikeri town visit and gives travellers a simple sense of Coorg’s rolling terrain.'],
      ['Coffee Estate Walks', 'A slower experience through shaded plantations, pepper vines, and local stories.', 'Estate walks are often more memorable than big sightseeing stops. Guests can see how coffee grows under shade, learn about harvest cycles, smell pepper and wet leaves, and understand the working landscape that defines Coorg. This is especially useful for couples, workation guests, and travellers who enjoy grounded local experiences.'],
      ['Dubare Elephant Camp', 'A riverside stop where families often combine nature, water, and wildlife learning.', 'Dubare works best when positioned carefully as a family-friendly river experience rather than a hurried animal photo stop. Guests can enjoy the Cauvery-side setting, nearby rafting options in season, and the drive through greener parts of Kodagu.'],
      ['Talakaveri', 'A sacred hilltop source of the Cauvery with wide views and cultural importance.', 'Talakaveri adds a cultural and geographic layer to a Coorg trip. The climb, temple setting, and mountain air make it feel different from the plantation belt. It is a longer outing from Madikeri, but worthwhile for guests who want both spiritual and scenic value.']
    ]
  },
  sakleshpur: {
    name: 'Sakleshpur',
    title: 'Sakleshpur: Coffee Hills, Fort Roads, and Monsoon Green',
    subtitle: 'A quiet Malnad escape for estate stays, viewpoints, waterfalls, and railway trails',
    caption: 'Rails, rain, and the smell of raw coffee',
    quote: 'In Sakleshpur, the road itself feels like part of the stay.',
    description: [
      'Sakleshpur is a softer, greener alternative to busier hill stations. Located in Hassan district, it sits among coffee plantations, rolling hills, forested roads, and old railway routes that become especially beautiful in and after the monsoon. It is close enough for weekend travel from Bengaluru, but still has the texture of a proper nature break.',
      'The destination works best for travellers who want calm rather than a crowded sightseeing circuit. Families can enjoy homestays and short drives. Friend groups can plan treks, viewpoints, and plantation trails. Couples can choose tucked-away stays where the main activity is watching rain move across the valley.',
      'Sakleshpur’s charm is its mix of accessibility and atmosphere. Manjarabad Fort gives history and a view. Bisle Ghat offers a wilder mountain feel. Estate walks and local food keep the trip grounded. Seasonal waterfalls and railway trails add adventure when conditions are right.',
      'For Sarva, the page should sell Sakleshpur as an easy green reset: fewer crowds, coffee-country stays, misty roads, and enough activity to fill a weekend without making guests feel scheduled.'
    ],
    spots: [
      ['Manjarabad Fort', 'A star-shaped hill fort with open views over the Western Ghats.', 'Manjarabad Fort is one of Sakleshpur’s most accessible landmarks. Built on a hill, it gives visitors a mix of history, architecture, and landscape without requiring a difficult trek. On clear days, the surrounding hills stretch wide; on misty days, the fort feels moody and cinematic.'],
      ['Bisle Ghat Viewpoint', 'A dramatic forest-and-valley viewpoint on the edge of the Western Ghats.', 'Bisle Ghat is for travellers who want the wilder side of Sakleshpur. The drive itself is part of the experience, moving through dense green stretches and quieter roads. The viewpoint offers layered hills and forest cover, especially beautiful after rain.'],
      ['Jenukal Gudda', 'A trekking and viewpoint experience for guests who want an active day.', 'Jenukal Gudda is suited to guests who enjoy climbs, open views, and a little effort. It should be recommended with local guidance and weather awareness, especially in monsoon months. For active groups, it can become the highlight of a Sakleshpur stay.'],
      ['Coffee Estate Trails', 'Slow plantation paths that show the working landscape behind the destination.', 'Estate trails help guests understand Sakleshpur beyond viewpoints. The shade, coffee bushes, pepper vines, and red earth roads give the region its identity. This is a low-pressure experience that works for couples, families, and workation travellers.'],
      ['Railway Bridge Trail', 'A monsoon-favourite route associated with old tracks, tunnels, and green valleys.', 'The railway trail is part of Sakleshpur’s travel imagination, though access and permissions can vary. It should be suggested responsibly with local guidance. When done right, it gives travellers a memorable mix of rain, bridges, forest, and adventure.']
    ]
  },
  madikeri: {
    name: 'Madikeri',
    title: 'Madikeri: Coorg’s Hill Town for Coffee, Views, and Waterfalls',
    subtitle: 'A convenient base for estate stays, local food, viewpoints, and classic Kodagu drives',
    caption: 'Where time brews like fresh filter coffee',
    quote: 'Madikeri is where Coorg becomes easy to enter.',
    description: [
      'Madikeri is the practical heart of many Coorg trips. It gives travellers quick access to viewpoints, waterfalls, cafes, markets, estate roads, and homestays while still carrying the feel of a hill town. For guests visiting Kodagu for the first time, Madikeri is often the easiest base.',
      'The town works well because it can be both active and relaxed. A family can visit Abbey Falls, Raja’s Seat, and the fort in a day. A couple can spend the morning in a coffee estate and the evening watching clouds from a viewpoint. A workation guest can stay slightly outside town and use Madikeri for food, supplies, and short drives.',
      'Madikeri’s strength is balance. It has enough infrastructure to keep travel comfortable, but the surrounding roads quickly lead into quieter estate country. The page should help guests choose between staying inside town for convenience or outside it for calm.',
      'For Sarva, Madikeri should be framed as the gateway to Coorg: ideal for first-timers, short trips, food-led travel, and guests who want the confidence of being close to everything.'
    ],
    spots: [
      ['Raja’s Seat', 'A sunset viewpoint and garden overlooking the Coorg hills.', 'Raja’s Seat is a simple but important Madikeri stop because it captures the hill-town mood quickly. It is best during early morning or evening when the valley is softer and the light is warmer.'],
      ['Abbey Falls', 'A powerful waterfall set among plantation greenery.', 'Abbey Falls is close enough to Madikeri to fit into most itineraries. It is popular, so timing matters, but it remains a reliable visual highlight for first-time Coorg visitors.'],
      ['Madikeri Fort', 'A historical landmark that adds context to the town beyond nature stops.', 'Madikeri Fort gives guests a short cultural break inside town. It is useful for travellers who enjoy history, architecture, and easy sightseeing between bigger nature plans.'],
      ['Omkareshwara Temple', 'A peaceful temple with distinctive architecture and a central water tank.', 'Omkareshwara Temple is a quiet town stop, often best visited without rushing. It adds spiritual and architectural variety to a Madikeri itinerary.'],
      ['Coffee Estate Experiences', 'Plantation walks, local coffee, and estate conversations just outside town.', 'The strongest Madikeri stays are often slightly outside the centre, where guests can wake up among coffee plants and still reach town easily. Estate experiences make the destination feel personal rather than generic.']
    ]
  },
  ooty: {
    name: 'Ooty',
    title: 'Ooty: Blue Mountain Air, Lakes, Gardens, and Old Hill-Station Charm',
    subtitle: 'A cool Nilgiri escape for families, couples, scenic drives, and slow garden days',
    caption: 'Colonial calm wrapped in eucalyptus wind',
    quote: 'Ooty turns ordinary mornings into something colder, quieter, and clearer.',
    description: [
      'Ooty is one of India’s best-known hill stations, and its appeal is still easy to understand: cool weather, eucalyptus-scented air, lakes, gardens, tea slopes, colonial-era buildings, and mountain roads. It can be busy, but with the right stay and route, it becomes a gentle highland pause.',
      'The destination works well for families because it has accessible attractions and predictable comforts. It works for couples because the weather, views, and quieter outskirts create a romantic mood. It works for older travellers because many experiences do not require hard trekking.',
      'The trick with Ooty is planning around crowd flow. Popular places like Ooty Lake and the Botanical Garden are best visited early. Doddabetta, tea factory stops, and drives toward Avalanche or Coonoor can give the trip more breathing room. A good stay outside the busiest centre can change the entire experience.',
      'For Sarva, Ooty should be positioned as a classic hill retreat with curated calm: choose better timings, softer stays, and a mix of iconic spots and quieter Nilgiri corners.'
    ],
    spots: [
      ['Ooty Lake and Boat House', 'A classic family-friendly lake experience close to town.', 'Ooty Lake is central, accessible, and familiar. It is best for families and first-time visitors who want boating, easy walking, and a landmark experience. It can get crowded, so early visits are better.'],
      ['Government Botanical Garden', 'A landscaped garden with old trees, lawns, and seasonal flower displays.', 'The Botanical Garden is one of Ooty’s most enduring attractions. It gives travellers a quiet green space inside the hill station and works especially well for families, older guests, and slow walkers.'],
      ['Doddabetta Peak', 'The highest point around Ooty with broad Nilgiri views.', 'Doddabetta is a useful viewpoint for guests who want to understand the scale of the Nilgiris. Weather changes quickly, so visibility can vary, but the drive and cool air are part of the experience.'],
      ['Tea Factory and Museum', 'A short, practical stop for tea processing, tasting, and local shopping.', 'A tea factory visit helps connect Ooty’s scenery with the working landscape around it. It is easy to fit into a half-day route and gives guests something tactile to remember.'],
      ['Avalanche Lake Route', 'A quieter nature outing with water, forest, and softer mountain scenery.', 'Avalanche is better for travellers who want to move away from the central tourist circuit. Access can depend on rules and timings, but the route adds a more spacious, nature-first side to Ooty.']
    ]
  },
  wayanad: {
    name: 'Wayanad',
    title: 'Wayanad: Forest Edges, High Trails, Waterfalls, and Kerala Hill Calm',
    subtitle: 'A green Kerala escape for cabins, treks, caves, dams, wildlife, and scenic drives',
    caption: "Kerala's forest heart, always listening",
    quote: 'Wayanad does not perform wilderness. It lets you enter it slowly.',
    description: [
      'Wayanad is one of Kerala’s most versatile nature destinations. It has forest roads, high viewpoints, waterfalls, tea and spice landscapes, caves, dams, wildlife edges, and cabin-style stays that feel tucked into green. The region can be adventurous or gentle depending on how the itinerary is built.',
      'For active travellers, Wayanad offers treks, viewpoints, caves, and long scenic drives. For families, it offers waterfalls, lake and dam visits, plantation experiences, and comfortable resorts. For couples, the best experience is often a quiet stay with one meaningful outing each day.',
      'The destination has several zones, so planning matters. Lakkidi and Vythiri feel misty and high. Kalpetta works as a practical base. Sultan Bathery and Mananthavady open different routes toward heritage, forest, and wildlife experiences. Guests should not try to cover everything in one short stay.',
      'For Sarva, Wayanad should feel like a layered forest retreat: a place where guests can choose between trekking, reading, driving, photographing, or simply doing very little among trees.'
    ],
    spots: [
      ['Chembra Peak', 'A well-known trek area associated with grassland views and the famous heart-shaped lake route.', 'Chembra is Wayanad’s iconic active experience, but access can depend on permissions and seasonal rules. It should be recommended with local guidance. For fit travellers, the reward is the feeling of being above the green folds of the district.'],
      ['Edakkal Caves', 'A heritage site with ancient rock markings and a short climb.', 'Edakkal adds history and archaeology to a nature-heavy Wayanad trip. The climb requires some effort, but the experience is distinctive and gives travellers a story beyond views and waterfalls.'],
      ['Soochipara Falls', 'A popular waterfall experience surrounded by forested slopes.', 'Soochipara is strong for guests who want water, photographs, and a sense of the tropical landscape. Conditions vary by season, and it is best planned with enough time rather than squeezed into a rushed day.'],
      ['Banasura Sagar Dam', 'A wide water-and-hill landscape suited to families and scenic drives.', 'Banasura gives Wayanad a more open, expansive mood. It is good for families, groups, and travellers who want a less strenuous outing with strong views.'],
      ['Lakkidi View Point', 'A misty gateway viewpoint with layered hills and dramatic weather.', 'Lakkidi is often the first strong visual welcome into Wayanad. It is especially atmospheric in rain or mist, and it helps travellers understand why the district feels different from the plains below.']
    ]
  },
  chikkamagalur: {
    name: 'Chikkamagalur',
    title: 'Chikkamagalur: Coffee Slopes, Mountain Roads, and Viewpoint Weekends',
    subtitle: 'Karnataka coffee country for estate stays, peaks, waterfalls, and slow hillside mornings',
    caption: 'Where mornings walk through mist',
    quote: 'Chikkamagalur is best when coffee is not a drink but the landscape itself.',
    description: [
      'Chikkamagalur is one of Karnataka’s strongest weekend destinations because it has the right mix of coffee estates, mountain roads, viewpoints, waterfalls, and stays that feel close to nature. It can be relaxed, adventurous, romantic, or family-friendly depending on where guests stay and how much they want to move.',
      'The region is deeply tied to coffee, and that should shape the content. A stay here is not just a bed near tourist spots; it is a morning inside plantation shade, a drive toward a peak, a local meal, and the smell of rain on red soil. The best itineraries leave room for weather and slow starts.',
      'Mullayanagiri and Baba Budangiri give the dramatic highland experience. Estate walks and coffee tastings give the trip its local texture. Waterfalls and ghat drives make the journey feel bigger. It is a destination that rewards both early risers and people who want to do less.',
      'For Sarva, Chikkamagalur should be positioned as a scenic coffee-country base: perfect for couples, small groups, bikers, workation guests, and families who want comfort surrounded by green.'
    ],
    spots: [
      ['Mullayanagiri', 'Karnataka’s highest peak and the headline viewpoint for Chikkamagalur.', 'Mullayanagiri is the big-view experience travellers expect from Chikkamagalur. The climb and road can be busy, but the open mountain air and sweeping views make it worthwhile. Early morning is usually the best time.'],
      ['Baba Budangiri', 'A mountain range tied to coffee history, shrine visits, and dramatic drives.', 'Baba Budangiri gives the trip both scenery and cultural context. The route is beautiful, and the area pairs well with nearby viewpoints when weather is clear.'],
      ['Hebbe Falls', 'A waterfall outing for travellers willing to plan around access and travel time.', 'Hebbe Falls is a stronger day plan than a quick stop. It suits guests who want a more active nature experience and are comfortable with changing local transport or access conditions.'],
      ['Coffee Estate Walks', 'Plantation trails that explain the region’s identity better than any viewpoint.', 'Estate walks are essential to Chikkamagalur. They slow the trip down and help guests notice shade trees, coffee plants, pepper, birds, and the daily life of the landscape.'],
      ['Hirekolale Lake', 'A calm lake setting with hills in the background, good for softer evenings.', 'Hirekolale Lake is useful for guests who want a peaceful photo stop without a hard trek. It adds balance to an itinerary dominated by peaks and drives.']
    ]
  },
  udupi: {
    name: 'Udupi',
    title: 'Udupi: Temple Streets, Malpe Beach, Island Light, and Coastal Food',
    subtitle: 'A coastal Karnataka base for temples, beaches, seafood evenings, and family-friendly sea air',
    caption: 'Coastal divinity and temple bells',
    quote: 'Udupi carries the coast gently: prayer in the morning, salt air by evening.',
    description: [
      'Udupi is a layered coastal destination. It is not only a beach town and not only a temple town; it is both. The Krishna temple, local food, Malpe Beach, St. Mary’s Island, quiet coastal drives, and nearby river-mouth landscapes make it a strong base for a relaxed Karnataka coast trip.',
      'The destination is especially useful for families and travellers who want the sea without an overwhelming party atmosphere. Days can be built around temple visits, beach time, island ferries when available, and simple seafood or vegetarian meals. Evenings are best kept unhurried.',
      'Udupi also works as part of a longer coastal route with Mangalore, Kundapura, Maravanthe, Murudeshwar, and Gokarna. For guests staying longer, it offers both spiritual rhythm and sea-facing downtime.',
      'For Sarva, Udupi should be positioned as calm coastal travel: clean planning, comfortable stays, temple culture, beach air, and food that becomes part of the memory.'
    ],
    spots: [
      ['Sri Krishna Matha', 'Udupi’s central spiritual landmark and the heart of the temple town.', 'Sri Krishna Matha gives Udupi its cultural identity. Visitors come for darshan, temple architecture, rituals, and the devotional atmosphere around the car street. It is best visited with respect for timing, dress, and local customs.'],
      ['Malpe Beach', 'A broad, accessible beach for sunsets, families, and ferry access.', 'Malpe is the easiest beach experience near Udupi. It is good for families, evening walks, and travellers who want the sea without going far from town. It also acts as the starting point for many island trips.'],
      ['St. Mary’s Island', 'A distinctive island known for rock formations and blue coastal views.', 'St. Mary’s Island is one of the most memorable experiences near Udupi when ferry services and weather allow. The basalt rock formations, water colour, and open island setting make it visually different from a normal beach stop.'],
      ['Kaup Beach and Lighthouse', 'A scenic beach with a lighthouse and strong sunset appeal.', 'Kaup adds a more dramatic coastal frame to the Udupi itinerary. The lighthouse area is popular for views and photographs, and it works well as an evening outing.'],
      ['Delta Beach', 'A quieter river-meets-sea landscape for slower coastal time.', 'Delta Beach gives guests a softer, less crowded coastal experience. It is useful for travellers who want a drive, sunset, and open water without the busier feel of the main beach areas.']
    ]
  },
  gokarna: {
    name: 'Gokarna',
    title: 'Gokarna: Beach Trails, Temple Lanes, Cliffs, and Quiet Sea Days',
    subtitle: 'A slower coastal escape for beach walks, sunsets, yoga mornings, and cliffside views',
    caption: 'Beach trails for quiet souls',
    quote: 'Gokarna is the coast after it has stopped trying to impress anyone.',
    description: [
      'Gokarna is one of Karnataka’s most characterful coastal destinations because it balances temple-town identity with a chain of beaches that can feel relaxed, scenic, and personal. It is quieter than Goa in mood, but still has enough cafes, stays, and beach routes to support a full trip.',
      'The destination works for couples, friend groups, solo travellers, and guests who want the sea without a heavily commercial setting. Some people come for beach hopping and sunset walks; others come for yoga, reading, seafood, temple visits, or simply staying close to the sound of waves.',
      'The beach trail is the heart of the experience. Main Beach gives access to town and temple life. Kudle is relaxed and social. Om Beach is iconic. Half Moon and Paradise feel more tucked away depending on access and season. The best itinerary should not rush all of them in one day.',
      'For Sarva, Gokarna should be presented as mindful coastal travel: simple stays, clean beach time, slower movement, and enough practical guidance to help guests choose the right beach mood.'
    ],
    spots: [
      ['Om Beach', 'Gokarna’s most recognisable beach, shaped like the sacred Om symbol.', 'Om Beach is the classic Gokarna postcard. It is good for first-time visitors, beach cafes, walks, and easy access compared with the more hidden coves. Early mornings and late afternoons are best.'],
      ['Kudle Beach', 'A relaxed beach with a softer social mood and sunset appeal.', 'Kudle is often where travellers slow down. It has a wider, more relaxed feel and works well for couples, friend groups, and guests who want beach time without constantly moving.'],
      ['Half Moon Beach', 'A smaller cove reached by trail or boat depending on conditions.', 'Half Moon is for guests who want the beach circuit to feel more adventurous. Access should be checked locally, especially by season, but the reward is a quieter coastal atmosphere.'],
      ['Paradise Beach', 'A more secluded beach experience for travellers comfortable with basic access.', 'Paradise Beach is best framed as a rawer, more minimal outing rather than a polished attraction. Guests should carry water, respect local conditions, and avoid treating it like a party spot.'],
      ['Mahabaleshwar Temple and Main Beach', 'The spiritual and town-side anchor of Gokarna.', 'Gokarna’s temple identity matters. A visit to the Mahabaleshwar Temple area and Main Beach gives travellers context before they move into the beach trail. It is the part of Gokarna that keeps the destination rooted.']
    ]
  }
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
  console.log(`Uploaded ${url}`)
  return data.secure_url
}

loadEnv()
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const cache = new Map()

for (const [slug, item] of Object.entries(content)) {
  const imageSources = sourceImages[slug]
  const urls = []
  for (const imageSource of imageSources) {
    urls.push(await uploadToCloudinary(imageSource, cache))
  }

  const spots = item.spots.map(([name, preview, description], index) => ({
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

  await Place.updateOne(
    { slug },
    {
      $set: {
        ...item,
        slug,
        heroImage: urls[0],
        image: urls[0],
        images: urls,
        spots,
      },
    },
    { upsert: true, runValidators: true }
  )
  console.log(`Updated content and images: ${item.name}`)
}

console.log(`Places updated: ${Object.keys(content).length}`)
console.log(`Unique image sources uploaded: ${cache.size}`)

await mongoose.disconnect()
