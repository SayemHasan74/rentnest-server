import { PrismaClient, PropertyStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminCredentials = {
  email: "admin@rentnest.com",
  password: "admin123"
};

const categories = [
  {
    name: "Apartment",
    description: "Multi-unit rental homes suitable for individuals and families."
  },
  {
    name: "House",
    description: "Standalone rental homes with more private living space."
  },
  {
    name: "Studio",
    description: "Compact single-room rentals for simple city living."
  },
  {
    name: "Condo",
    description: "Privately owned units available for rent in managed buildings."
  }
];

const hashPassword = async (password: string) => bcrypt.hash(password, 12);

async function main() {
  const [adminPassword, landlordPassword, tenantPassword] = await Promise.all([
    hashPassword(adminCredentials.password),
    hashPassword("landlord123"),
    hashPassword("tenant123")
  ]);

  await prisma.user.upsert({
    where: { email: adminCredentials.email },
    update: {
      name: "RentNest Admin",
      password: adminPassword,
      role: UserRole.ADMIN
    },
    create: {
      name: "RentNest Admin",
      email: adminCredentials.email,
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: "+8801700000000",
      address: "Dhaka, Bangladesh"
    }
  });

  const landlord = await prisma.user.upsert({
    where: { email: "landlord@rentnest.com" },
    update: {
      name: "Sample Landlord",
      password: landlordPassword,
      role: UserRole.LANDLORD
    },
    create: {
      name: "Sample Landlord",
      email: "landlord@rentnest.com",
      password: landlordPassword,
      role: UserRole.LANDLORD,
      phone: "+8801711111111",
      address: "Gulshan, Dhaka"
    }
  });

  await prisma.user.upsert({
    where: { email: "tenant@rentnest.com" },
    update: {
      name: "Sample Tenant",
      password: tenantPassword,
      role: UserRole.TENANT
    },
    create: {
      name: "Sample Tenant",
      email: "tenant@rentnest.com",
      password: tenantPassword,
      role: UserRole.TENANT,
      phone: "+8801722222222",
      address: "Banani, Dhaka"
    }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category
    });
  }

  const apartmentCategory = await prisma.category.findUniqueOrThrow({
    where: { name: "Apartment" }
  });

  const houseCategory = await prisma.category.findUniqueOrThrow({
    where: { name: "House" }
  });

  const sampleProperties = [
    {
      title: "Bright Two Bedroom Apartment",
      description:
        "A comfortable apartment with natural light, balcony access, and nearby grocery stores.",
      location: "Banani, Dhaka",
      address: "Road 11, Banani, Dhaka",
      rentAmount: "42000",
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1150,
      amenities: ["WiFi", "Lift", "Generator", "Security"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
      ],
      status: PropertyStatus.AVAILABLE,
      landlordId: landlord.id,
      categoryId: apartmentCategory.id
    },
    {
      title: "Family House Near Park",
      description:
        "A spacious family house with parking, a small garden, and easy access to schools.",
      location: "Uttara, Dhaka",
      address: "Sector 7, Uttara, Dhaka",
      rentAmount: "65000",
      bedrooms: 4,
      bathrooms: 3,
      areaSqFt: 2200,
      amenities: ["Parking", "Garden", "Gas", "Security"],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
      ],
      status: PropertyStatus.AVAILABLE,
      landlordId: landlord.id,
      categoryId: houseCategory.id
    }
  ];

  for (const property of sampleProperties) {
    const existingProperty = await prisma.property.findFirst({
      where: {
        title: property.title,
        landlordId: landlord.id
      }
    });

    if (existingProperty) {
      await prisma.property.update({
        where: { id: existingProperty.id },
        data: property
      });
    } else {
      await prisma.property.create({
        data: property
      });
    }
  }

  console.log("Seed completed.");
  console.log(`Admin Email: ${adminCredentials.email}`);
  console.log(`Admin Password: ${adminCredentials.password}`);
}

main()
  .catch((error) => {
    console.error("Seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
