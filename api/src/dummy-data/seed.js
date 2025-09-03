
const { PrismaClient } = require("@prisma/client");
const regionsData = require("../regions.json");
const votenamesData = require("../votenames.json");

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  for (const region of regionsData) {
    await prisma.region.create({
      data: {
        id: region.id,
        name: region.name,
        coordinator: region.coordinator,
        contact: region.contact,
        email: region.email,
      },
    });
  }

  for (const votename of votenamesData) {
    await prisma.voteName.create({
      data: {
        id: votename.id,
        code: votename.code,
        name: votename.name,
        region: {
          connect: { id: votename.regionId },
        },
      },
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


