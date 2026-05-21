const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clean existing data to ensure a fresh start
  console.log("Cleaning existing data...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Creating new products...");
  
  // Odisha dishes
  const arisaPitha = await prisma.product.create({
    data: {
      sku: "odisha-arisa-pitha",
      name: "Arisa Pitha",
      description: "A traditional crispy sweet pancake from Odisha, made with premium rice flour, rich organic jaggery, and garnished with roasted sesame seeds. Crispy on the outside and soft inside.",
      price: 199.0,
      state: "Odisha",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80",
      weight: 0.5, // 500g package
      length: 15.0,
      breadth: 15.0,
      height: 5.0,
    },
  });

  const chhenaGaja = await prisma.product.create({
    data: {
      sku: "odisha-gaja",
      name: "Chhena Gaja",
      description: "A classic sweet from Odisha made of fresh cottage cheese (chhena) and semolina, lightly kneaded, shaped into rectangular blocks, deep-fried and soaked in cardamom-infused sugar syrup.",
      price: 249.0,
      state: "Odisha",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80",
      weight: 0.5, // 500g package
      length: 15.0,
      breadth: 15.0,
      height: 5.0,
    },
  });

  console.log("Seed data created successfully:");
  console.log(`- Created Product: ${arisaPitha.name} (SKU: ${arisaPitha.sku})`);
  console.log(`- Created Product: ${chhenaGaja.name} (SKU: ${chhenaGaja.sku})`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
