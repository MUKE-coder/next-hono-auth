import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Hash passwords
  const adminPassword = await bcrypt.hash("Admin@2025", 12);
  const userPassword = await bcrypt.hash("User@2025", 12);

  // Create Admin User with Profile
  const admin = await prisma.user.create({
    data: {
      surname: "Admin",
      otherNames: "System",
      name: "System Admin",
      email: "admin@admin.com",
      phone: "+256700000001",
      nin: "CF12345678901234",
      role: "ADMIN",
      password: adminPassword,
      status: "ACTIVE",
      isVerified: true,
      profile: {
        create: {
          gender: "MALE",
          dateOfBirth: new Date("1980-01-01"),
          ninNumber: "CF12345678901234",
          homeAddress: "Kampala, Uganda",
          workplaceAddress: "Central Office, Kampala",
          district: "Kampala",
          title: "System Administrator",
          employeeNo: "EMP001",
          computerNumber: "COMP001",
          presentSalary: 5000000.0,
          category: "PUBLIC_SERVICE",
          memberNumber: "GU001",
          trackingNumber: "TRK001",
          lastStep: 5
        }
      }
    },
    include: {
      profile: true
    }
  });

  // Create Regular User with Profile
  const user = await prisma.user.create({
    data: {
      surname: "Doe",
      otherNames: "John",
      name: "John Doe",
      email: "user@user.com",
      phone: "+256700000002",
      nin: "CF98765432109876",
      role: "USER" as UserRole,
      password: userPassword,
      status: "ACTIVE",
      isVerified: true,
      profile: {
        create: {
          gender: "MALE",
          dateOfBirth: new Date("1990-05-15"),
          ninNumber: "CF98765432109876",
          homeAddress: "Entebbe, Uganda",
          workplaceAddress: "Ministry of Health, Kampala",
          district: "Wakiso",
          title: "Health Officer",
          employeeNo: "EMP002",
          computerNumber: "COMP002",
          presentSalary: 2500000.0,
          category: "PUBLIC_SERVICE",
          memberNumber: "GU002",
          trackingNumber: "TRK002",
          lastStep: 3
        }
      }
    },
    include: {
      profile: true
    }
  });

  // Create some sample user logs
  await prisma.userLog.createMany({
    data: [
      {
        name: "System Admin",
        activity: "Login",
        time: new Date().toISOString(),
        ipAddress: "127.0.0.1",
        device: "Desktop - Chrome",
        userId: admin.id
      },
      {
        name: "John Doe",
        activity: "Profile Update",
        time: new Date().toISOString(),
        ipAddress: "192.168.1.100",
        device: "Mobile - Safari",
        userId: user.id
      }
    ]
  });

  console.log("Seed completed successfully!");
  console.log("Created users:");
  console.log(`Admin: ${admin.email} - Password: Admin@2025`);
  console.log(`User: ${user.email} - Password: User@2025`);
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
