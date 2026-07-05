import {
  PrismaClient,
  Role,
  RoomType,
  GenderPreference,
  Furnishing,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ── Seed owner ───────────────────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: "owner@stayz.dev" },
    update: {
      isSuperhost: true,
      responseRate: "100%",
      responseTimeLabel: "within an hour",
      yearsHosting: 1,
      joinedYear: 2025,
    },
    create: {
      email: "owner@stayz.dev",
      name: "Seed Owner",
      role: Role.OWNER,
      isSuperhost: true,
      responseRate: "100%",
      responseTimeLabel: "within an hour",
      yearsHosting: 1,
      joinedYear: 2025,
    },
  });

  console.log(`✅ Seed owner ready — id: ${owner.id}`);

  // Seed host personal details (idempotent — skip if already present)
  const existingDetails = await prisma.hostPersonalDetail.count({
    where: { userId: owner.id },
  });
  if (existingDetails === 0) {
    await prisma.hostPersonalDetail.createMany({
      data: [
        { userId: owner.id, icon: "cake",   text: "Born in the 90s" },
        { userId: owner.id, icon: "school", text: "Studied at IIT Delhi" },
      ],
    });
    console.log("✅ Host personal details seeded.");
  }

  // ── Amenity catalogue ────────────────────────────────────────────────────────
  const amenityDefs = [
    { name: "WiFi",        icon: "wifi",                  description: "High-speed internet" },
    { name: "AC",          icon: "ac_unit",               description: "Central climate control" },
    { name: "Parking",     icon: "local_parking",         description: "Free parking on premises" },
    { name: "Kitchen",     icon: "kitchen",               description: "Full kitchen access" },
    { name: "Washer",      icon: "local_laundry_service", description: "In-unit laundry" },
    { name: "TV",          icon: "tv",                    description: "Smart TV" },
    { name: "Elevator",    icon: "elevator",              description: "High-speed lift" },
    { name: "Power Backup",icon: "electric_bolt",         description: "24/7 power backup" },
  ];

  for (const def of amenityDefs) {
    await prisma.amenity.upsert({
      where: { name: def.name },
      update: { icon: def.icon, description: def.description },
      create: def,
    });
  }
  console.log("✅ Amenity catalogue ready.");

  // ── Demo listing (Skynest) ────────────────────────────────────────────────────
  const skynest = await prisma.listing.upsert({
    where: { id: "skynest-skyline-views" },
    update: {},
    create: {
      id: "skynest-skyline-views",
      ownerId: owner.id,
      title: "Skynest Skyline Views",
      description:
        "Perched above Bhopal's skyline, Skynest is a brutalist-lite penthouse built for Gen Z urban nomads. Floor-to-ceiling glass, velvet minimalism, and smart-home everything — this is city living at its most cinematic.",
      descriptionExtended:
        "Wake up to panoramic views, work from the marble island, and unwind on the private balcony as the city lights up. Every detail — from the smart lock to the soaking tub — is designed for frictionless, high-vibe stays.",
      propertyType: "Entire apartment",
      city: "Bhopal",
      locality: "New Market",
      address: "Skynest Tower, New Market, Bhopal",
      pincode: "462003",
      monthlyRent: 45000,
      pricePerNight: 8499,
      deposit: 90000,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      mapLat: 23.2599,
      mapLng: 77.4126,
      mapImageUrl:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
      roomType: RoomType.FLAT,
      furnishing: Furnishing.FURNISHED,
      genderPreference: GenderPreference.ANY,
      isAvailable: true,
      status: "ACTIVE",
    },
  });

  console.log(`✅ Skynest listing ready — id: ${skynest.id}`);

  // Highlights
  const highlightCount = await prisma.highlight.count({
    where: { listingId: skynest.id },
  });
  if (highlightCount === 0) {
    await prisma.highlight.createMany({
      data: [
        { listingId: skynest.id, icon: "workspace_premium", title: "Self check-in",   description: "Check yourself in with the high-tech smart lock system.", sortOrder: 0 },
        { listingId: skynest.id, icon: "location_on",       title: "Great location",  description: "100% of recent guests gave the location a 5-star rating.", sortOrder: 1 },
      ],
    });
    console.log("✅ Highlights seeded.");
  }

  // Sleeping arrangements
  const sleepCount = await prisma.sleepingArrangement.count({
    where: { listingId: skynest.id },
  });
  if (sleepCount === 0) {
    await prisma.sleepingArrangement.create({
      data: {
        listingId: skynest.id,
        icon: "king_bed",
        name: "Bedroom",
        description: "1 king bed",
        sortOrder: 0,
      },
    });
    console.log("✅ Sleeping arrangements seeded.");
  }

  // Things to know
  const thingCount = await prisma.thingToKnow.count({
    where: { listingId: skynest.id },
  });
  if (thingCount === 0) {
    await prisma.thingToKnow.createMany({
      data: [
        { listingId: skynest.id, icon: "schedule",    title: "Check-in / Check-out", content: "Check-in after 3:00 PM · Check-out before 11:00 AM", sortOrder: 0 },
        { listingId: skynest.id, icon: "smoke_free",  title: "House rules",          content: "No smoking · No parties · Quiet hours after 10 PM",   sortOrder: 1 },
        { listingId: skynest.id, icon: "event_busy",  title: "Cancellation",         content: "Free cancellation for 48 hours. Review StayZ's full policy.", sortOrder: 2 },
      ],
    });
    console.log("✅ Things to know seeded.");
  }

  // Link amenities (WiFi, AC, Kitchen, Washer, TV, Elevator)
  const linkedAmenityNames = ["WiFi", "AC", "Kitchen", "Washer", "TV", "Elevator"];
  const amenities = await prisma.amenity.findMany({
    where: { name: { in: linkedAmenityNames } },
    select: { id: true, name: true },
  });
  for (const amenity of amenities) {
    await prisma.listingAmenity.upsert({
      where: { listingId_amenityId: { listingId: skynest.id, amenityId: amenity.id } },
      update: {},
      create: { listingId: skynest.id, amenityId: amenity.id },
    });
  }
  console.log("✅ Amenities linked to Skynest.");

  // Images
  const imgCount = await prisma.listingImage.count({
    where: { listingId: skynest.id },
  });
  if (imgCount === 0) {
    await prisma.listingImage.createMany({
      data: [
        { listingId: skynest.id, sortOrder: 0, url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5RRUIGEH1vuGQmpBNY4DiB8kHOnAiBHtXAcBva5KcIseLGGPiz1_K7mfdY5SdvoKptcdaOPhfa4DQpuzAHHDuS9_QMXYEpEHObJ1iNqj-LW-TTZS2p_wKitER5PFoqQs0g-0urHqo1hrdi8T8u5kKbK10FC-UnquzXuJ0IXmMfpoq66ZrM0jEd2JoSaTpDS1iId7KPDgHx0MOp7C7apa1_xUgYL3YTgQXJfJy6uCkaj6ThGfpMuGyfw", alt: "Penthouse living room with floor-to-ceiling glass and city skyline views at twilight" },
        { listingId: skynest.id, sortOrder: 1, url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNrKSYPjPuJ0TfvngxdOKv2T-0PVyC_0VApNRYa4CWs7UDbQTzanNaUVmRwupp53q9D3idOajkU0nmz_IjSoh00MmBM3FG0ZIQPOj2s8PQP8Kocka2S1vWSLfbaQBtGfuaPvB6Qp2D5M-MZJQMd7XgCH1D3IoRlMAqaLHKqkq9RE8q4ZtbGpO0SAHtZOQTJSjQ0nyXppIDCwEBp0n7wcxrfVMZF43rCuPyr3Rud9BtwdLsKXJRGL3Y7A", alt: "Master bedroom with charcoal linens and city lights reflected in a circular mirror" },
        { listingId: skynest.id, sortOrder: 2, url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgUxa7d8u8bUzP3IYPWMRmnKGob38Dm-RgQRFn1AbuUP4cMfIa4Q-s7OVIY0BwauqccwedEoWBGsh6MQhCLPVru7HILYwhLJA9MSzLY7mYcLB2PfqJX1u2AXe4CGfeJpEoWpAioWNh9MfRhadDFJrJAuFbLiphbG_G4iZwHVyNHg4TOrGw85tuHHUkOpIbYVQN9CrE4nbs6ruo_1DUybG2ySoKpW2ha5Pb5hWaXpnXV1wfS_rbgnsbYQ", alt: "Private balcony at night overlooking Bhopal's illuminated modern district" },
        { listingId: skynest.id, sortOrder: 3, url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_vbWMIFb37EuEfOTtJUe5FysDC5OHRC73bN2SX-2AsQldm38OAel9NNWNdueJuP2i_bzlQmH9r4cDli5bkxgjPSdzXVqNlI-intHzncLW1DbiPeXB7smsKwG_jPHcct_OpIRQAIhvGLaUmZ3u0mqU_wt436aGo2imGlA7DRnYKqjOKGrrOCc_-Xdg4Ti2ydy728c18U3R1FSf3LCGltBnoJrwkNXnwpvxkO5WYrrSoPz1XOhoVHqmWw", alt: "Sleek matte-black kitchen with marble island and recessed spotlighting" },
        { listingId: skynest.id, sortOrder: 4, url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBysexXzV_uMTE0HFjlvxKG1r40TjsSY9xFn3oABGK8jbRj4OCYL7GZ2WC-83xbGNidrtfLspss8NsdyCVO1BlR90LUZ8Zsv28WtZaEg-j5yAKh2s5psoVhTN002Wiv4TjMffdmpIVtam5nZaA3r3QP_RVcydMpLLkEs6za6Jc5a8mgjk0nrB-vUiJXS_uLhFI5_RMJByIryO02fyd-Wr8a1PRedgTAwaNIdsY-F20Wrq5DfFfR4_Digw", alt: "Luxury soaking tub next to panoramic window with soft city light glow" },
      ],
    });
    console.log("✅ Images seeded.");
  }

  // ── Bulk listing seeds (original 6 — no new optional fields required) ─────────
  await prisma.listing.createMany({
    data: [
      {
        ownerId: owner.id,
        title: "Chill single room in the heart of Lashkar",
        description:
          "Bright, airy single room right in the busiest part of Gwalior — groceries, chai spots, and autos literally 2 mins away. Perfect if you want your own space without burning a hole in your pocket. Power backup, clean washroom, no drama.",
        city: "Gwalior", locality: "Lashkar",
        address: "Near Phool Bagh Chowk, Lashkar", pincode: "474001",
        monthlyRent: 5500, deposit: 11000,
        roomType: RoomType.SINGLE, genderPreference: GenderPreference.ANY,
        furnishing: Furnishing.SEMI_FURNISHED, isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Budget shared room for working folks — Hazira, Gwalior",
        description:
          "Decent shared double-occupancy room for two working professionals who just need a clean place to crash. Washing machine access, common kitchen, and a surprisingly good WiFi connection. No boomers, vibes only.",
        city: "Gwalior", locality: "Hazira",
        address: "Hazira Road, Near Bus Stand", pincode: "474003",
        monthlyRent: 4000, deposit: 8000,
        roomType: RoomType.SHARED, genderPreference: GenderPreference.MALE,
        furnishing: Furnishing.UNFURNISHED, isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Girls-only PG in Vijay Nagar — fully loaded 🔥",
        description:
          "Safe, fully furnished girls PG in the most happening locality of Indore. Home-cooked meals, AC room, 24/7 security, and a super-chill vibe with other working girls and students. This one fills up fast so don't sleep on it.",
        city: "Indore", locality: "Vijay Nagar",
        address: "Scheme 54, Vijay Nagar", pincode: "452010",
        monthlyRent: 8500, deposit: 17000,
        roomType: RoomType.PG, genderPreference: GenderPreference.FEMALE,
        furnishing: Furnishing.FURNISHED, isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Spacious 1BHK flat — Koramangala, Bangalore",
        description:
          "Full flat to yourself in the middle of Koramangala — walking distance to cafes, coworking spots, and literally every food delivery zone in existence. Semi-furnished with a modular kitchen, ideal for someone who actually cooks. One month deposit, no hidden charges.",
        city: "Bangalore", locality: "Koramangala",
        address: "5th Block, Koramangala", pincode: "560095",
        monthlyRent: 18000, deposit: 36000,
        roomType: RoomType.FLAT, genderPreference: GenderPreference.ANY,
        furnishing: Furnishing.SEMI_FURNISHED, isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Affordable PG for boys near DB City — Bhopal",
        description:
          "Clean, no-nonsense PG for working guys and students near DB City Mall. Shared rooms available with attached bath, unlimited WiFi, and a common area to hang. Monthly rent is all-inclusive — water, electricity, the works.",
        city: "Bhopal", locality: "Arera Colony",
        address: "E-7 Arera Colony, Near DB City", pincode: "462016",
        monthlyRent: 6500, deposit: 13000,
        roomType: RoomType.PG, genderPreference: GenderPreference.MALE,
        furnishing: Furnishing.FURNISHED, isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Cozy shared room near FC Road — Pune",
        description:
          "Super chill shared room in the most student-friendly belt of Pune — minutes from FC Road, Deccan, and Shivajinagar. Two per room setup with individual study tables, decent storage, and a landlord who actually respects your privacy. Deposit waived for 6-month commitments.",
        city: "Pune", locality: "Deccan Gymkhana",
        address: "Near Garware College, FC Road", pincode: "411004",
        monthlyRent: 7200, deposit: null,
        roomType: RoomType.SHARED, genderPreference: GenderPreference.ANY,
        furnishing: Furnishing.SEMI_FURNISHED, isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ 6 bulk listings seeded (skipDuplicates).");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
