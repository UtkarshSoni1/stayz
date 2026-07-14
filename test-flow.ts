import { prisma } from "./lib/prisma";
import { createVerificationToken, consumeVerificationToken } from "./lib/verification-token";

async function run() {
  console.log("1. Generating token...");
  const email = "test@example.com";
  
  // Clean up existing
  await prisma.user.deleteMany({ where: { email } }).catch(()=>console.log("No user to delete"));
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  
  await prisma.user.create({
    data: { name: "Test", email, password: "hash" },
  });

  const rawToken = await createVerificationToken(email);
  console.log("Raw Token:", rawToken, "Length:", rawToken.length);

  const tokenInDb = await prisma.verificationToken.findFirst({ where: { identifier: email } });
  console.log("Token in DB (Hashed):", tokenInDb?.token);

  console.log("2. Consuming token...");
  const result = await consumeVerificationToken(rawToken);
  console.log("Consume Result:", result);
}

run().catch(console.error).finally(() => prisma.$disconnect());
