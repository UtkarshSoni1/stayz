// "use client"
import { PrismaClient, Role, RoomType, GenderPreference, Furnishing } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ── Upsert seed owner ────────────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: "owner@stayz.dev" },
    update: {},
    create: {
      email: "owner@stayz.dev",
      name: "Seed Owner",
      role: Role.OWNER,
    },
  });

  console.log(`✅ Seed owner ready — id: ${owner.id}`);

  // ── Listings ─────────────────────────────────────────────────────────────────
  await prisma.listing.createMany({
    data: [
      {
        ownerId: owner.id,
        title: "Chill single room in the heart of Lashkar",
        description:
          "Bright, airy single room right in the busiest part of Gwalior — groceries, chai spots, and autos literally 2 mins away. Perfect if you want your own space without burning a hole in your pocket. Power backup, clean washroom, no drama.",
        city: "Gwalior",
        locality: "Lashkar",
        address: "Near Phool Bagh Chowk, Lashkar",
        pincode: "474001",
        monthlyRent: 5500,
        deposit: 11000,
        roomType: RoomType.SINGLE,
        genderPreference: GenderPreference.ANY,
        furnishing: Furnishing.SEMI_FURNISHED,
        isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Budget shared room for working folks — Hazira, Gwalior",
        description:
          "Decent shared double-occupancy room for two working professionals who just need a clean place to crash. Washing machine access, common kitchen, and a surprisingly good WiFi connection. No boomers, vibes only.",
        city: "Gwalior",
        locality: "Hazira",
        address: "Hazira Road, Near Bus Stand",
        pincode: "474003",
        monthlyRent: 4000,
        deposit: 8000,
        roomType: RoomType.SHARED,
        genderPreference: GenderPreference.MALE,
        furnishing: Furnishing.UNFURNISHED,
        isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Girls-only PG in Vijay Nagar — fully loaded 🔥",
        description:
          "Safe, fully furnished girls PG in the most happening locality of Indore. Home-cooked meals, AC room, 24/7 security, and a super-chill vibe with other working girls and students. This one fills up fast so don't sleep on it.",
        city: "Indore",
        locality: "Vijay Nagar",
        address: "Scheme 54, Vijay Nagar",
        pincode: "452010",
        monthlyRent: 8500,
        deposit: 17000,
        roomType: RoomType.PG,
        genderPreference: GenderPreference.FEMALE,
        furnishing: Furnishing.FURNISHED,
        isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Spacious 1BHK flat — Koramangala, Bangalore",
        description:
          "Full flat to yourself in the middle of Koramangala — walking distance to cafes, coworking spots, and literally every food delivery zone in existence. Semi-furnished with a modular kitchen, ideal for someone who actually cooks. One month deposit, no hidden charges.",
        city: "Bangalore",
        locality: "Koramangala",
        address: "5th Block, Koramangala",
        pincode: "560095",
        monthlyRent: 18000,
        deposit: 36000,
        roomType: RoomType.FLAT,
        genderPreference: GenderPreference.ANY,
        furnishing: Furnishing.SEMI_FURNISHED,
        isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Affordable PG for boys near DB City — Bhopal",
        description:
          "Clean, no-nonsense PG for working guys and students near DB City Mall. Shared rooms available with attached bath, unlimited WiFi, and a common area to hang. Monthly rent is all-inclusive — water, electricity, the works.",
        city: "Bhopal",
        locality: "Arera Colony",
        address: "E-7 Arera Colony, Near DB City",
        pincode: "462016",
        monthlyRent: 6500,
        deposit: 13000,
        roomType: RoomType.PG,
        genderPreference: GenderPreference.MALE,
        furnishing: Furnishing.FURNISHED,
        isAvailable: true,
      },
      {
        ownerId: owner.id,
        title: "Cozy shared room near FC Road — Pune",
        description:
          "Super chill shared room in the most student-friendly belt of Pune — minutes from FC Road, Deccan, and Shivajinagar. Two per room setup with individual study tables, decent storage, and a landlord who actually respects your privacy. Deposit waived for 6-month commitments.",
        city: "Pune",
        locality: "Deccan Gymkhana",
        address: "Near Garware College, FC Road",
        pincode: "411004",
        monthlyRent: 7200,
        deposit: null,
        roomType: RoomType.SHARED,
        genderPreference: GenderPreference.ANY,
        furnishing: Furnishing.SEMI_FURNISHED,
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ 6 listings seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
