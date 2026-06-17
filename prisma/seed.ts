import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "Yasmine Kost",
  tagline: "Hunian nyaman, bersih, dan tepercaya untuk mahasiswa & pekerja muda",
  whatsapp: "628125679294",
  phone: "0812-5679-294",
  email: "aztgamingvlog01@gmail.com",
  address: "Jl. Prof M Yamin Gg. Sekadim No 19, Pontianak",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Jl.%20Prof%20M%20Yamin%20Gg.%20Sekadim%20No%2019%2C%20Pontianak&output=embed",
  bankName: "Bank BCA",
  bankAccountNumber: "1234567890",
  bankAccountHolder: "Yasmine Kost",
  nearbyInfo:
    "Dekat kampus, minimarket, warung makan, dan akses transportasi umum.",
  minRentMonths: "1",
  startingPrice: "600000",
  heroImage: "",
};

const FACILITIES: { name: string; icon: string; description: string }[] = [
  { name: "WiFi Cepat", icon: "wifi", description: "Internet unlimited di seluruh area kost" },
  { name: "Dapur Bersama", icon: "cooking-pot", description: "Dapur lengkap untuk memasak" },
  { name: "Parkir Luas", icon: "bike", description: "Parkir motor & mobil yang aman" },
  { name: "Area Jemur", icon: "shirt", description: "Ruang jemur pakaian yang luas" },
  { name: "Keamanan 24 Jam", icon: "shield-check", description: "CCTV & akses terkontrol" },
  { name: "Ruang Tamu", icon: "sofa", description: "Ruang santai bersama untuk menerima tamu" },
  { name: "Air Bersih", icon: "droplets", description: "Air bersih mengalir 24 jam" },
  { name: "Listrik", icon: "zap", description: "Token listrik sudah termasuk biaya sewa" },
];

const ROOM_FACILITY_SETS = [
  ["Kasur", "Lemari", "Meja Belajar", "WiFi"],
  ["Kasur", "Lemari", "Meja Belajar", "WiFi", "AC", "Kamar Mandi Dalam"],
  ["Kasur", "Lemari", "Meja Belajar", "WiFi", "Kipas Angin"],
];

async function main() {
  console.log("🌱 Menyiapkan data awal Yasmine Kost...");

  // 1. Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@yasminekost.com")
    .toLowerCase()
    .trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const adminName = process.env.ADMIN_NAME || "Pemilik Yasmine Kost";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, password: passwordHash, role: "ADMIN" },
    create: {
      email: adminEmail,
      name: adminName,
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin: ${adminEmail} (password: ${adminPassword})`);

  // 2. Site settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`✓ ${Object.keys(DEFAULT_SETTINGS).length} pengaturan situs`);

  // 3. Facilities
  await prisma.facility.deleteMany();
  await prisma.facility.createMany({
    data: FACILITIES.map((f, i) => ({ ...f, sort: i })),
  });
  console.log(`✓ ${FACILITIES.length} fasilitas bersama`);

  // 4. 12 kamar
  const categories = ["PUTRA", "PUTRI", "CAMPUR"];
  for (let i = 1; i <= 12; i++) {
    const floor = i <= 6 ? "A" : "B";
    const num = String(((i - 1) % 6) + 1).padStart(2, "0");
    const number = `${floor}-${num}`;
    const category = categories[i % 3];
    const tier = i % 3; // 0,1,2 -> menentukan fasilitas & harga
    const facilities = ROOM_FACILITY_SETS[tier];
    const hasAC = facilities.includes("AC");
    const privateBath = facilities.includes("Kamar Mandi Dalam");
    const monthlyPrice = 900_000 + tier * 350_000; // 900rb / 1.25jt / 1.6jt
    const deposit = Math.round(monthlyPrice / 2);

    await prisma.room.upsert({
      where: { number },
      update: {},
      create: {
        number,
        name: `Kamar ${number}`,
        category,
        monthlyPrice,
        deposit,
        size: tier === 2 ? "3x4 m" : "3x3 m",
        privateBath,
        hasAC,
        description:
          "Kamar nyaman dengan pencahayaan baik, cocok untuk mahasiswa maupun pekerja. Lingkungan tenang dan bersih.",
        status: i % 4 === 0 ? "OCCUPIED" : "AVAILABLE",
        facilities: JSON.stringify(facilities),
      },
    });
  }
  console.log("✓ 12 kamar");

  console.log("✅ Selesai. Jalankan `npm run dev` lalu buka http://localhost:3000");
}

main()
  .catch((e) => {
    console.error("❌ Gagal seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
