import { PrismaClient, TimeSlot } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, format } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_SEED_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "admin1234";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: { username: adminUsername, passwordHash },
  });

  // Reset demo data (keep admin user)
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();

  const departments = [
    {
      id: "obgyn",
      name: "婦產科",
      description: "提供全面的婦女健康照護，包含產檢、婦科疾病治療及微創手術。",
      icon: "Baby",
    },
    {
      id: "pediatrics",
      name: "小兒科",
      description: "呵護寶寶的健康成長，提供疫苗接種、生長評估及常見兒科疾病治療。",
      icon: "Trees",
    },
    {
      id: "surgery",
      name: "乳房外科",
      description: "專注於乳房健康篩檢、診斷及治療，守護女性自信與健康。",
      icon: "Heart",
    },
    {
      id: "internal",
      name: "內科",
      description: "一般內科疾病診治，慢性病管理。",
      icon: "Stethoscope",
    },
  ];

  await prisma.department.createMany({ data: departments });

  const doctors = [
    {
      id: "dr-lee",
      name: "李宜明",
      departmentId: "obgyn",
      title: "院長",
      specialties: ["一般產科", "高危險妊娠", "婦科腫瘤", "腹腔鏡手術"],
      imageUrl: "/images/doctor-lee.png",
      introduction: "致力於婦產科領域三十餘年，經驗豐富，視病猶親。",
      isAvailable: true,
    },
    {
      id: "dr-chen",
      name: "陳曼玲",
      departmentId: "obgyn",
      title: "主治醫師",
      specialties: ["青少女保健", "更年期障礙", "婦科微創手術"],
      imageUrl: "/images/doctor-chen.png",
      introduction: "細心溫柔的診療風格，深受女性患者信賴。",
      isAvailable: true,
    },
    {
      id: "dr-hong",
      name: "洪晟哲",
      departmentId: "pediatrics",
      title: "小兒科主任",
      specialties: ["小兒過敏", "氣喘", "新生兒照護"],
      imageUrl: "/images/doctor-hong.png",
      introduction: "專注於兒童過敏免疫領域，守護孩子的呼吸健康。",
      isAvailable: true,
    },
    {
      id: "dr-li-wan",
      name: "李婉華",
      departmentId: "surgery",
      title: "乳房外科醫師",
      specialties: ["乳房超音波", "乳房手術", "乳癌篩檢"],
      imageUrl: "/images/doctor-li-wan.png",
      introduction: "專業細緻的檢查，早期發現早期治療。",
      isAvailable: true,
    },
  ];

  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { id: doctor.id },
      update: {
        name: doctor.name,
        title: doctor.title,
        introduction: doctor.introduction,
        imageUrl: doctor.imageUrl,
        isAvailable: doctor.isAvailable,
        specialties: doctor.specialties,
        departmentId: doctor.departmentId,
      },
      create: {
        id: doctor.id,
        name: doctor.name,
        title: doctor.title,
        introduction: doctor.introduction,
        imageUrl: doctor.imageUrl,
        isAvailable: doctor.isAvailable,
        specialties: doctor.specialties,
        departmentId: doctor.departmentId,
      },
    });
  }

  const timeSlots: Array<{ slot: TimeSlot; start: string; end: string; days: number[] }> = [
    { slot: "Morning", start: "09:00", end: "12:00", days: [1, 2, 3, 4, 5, 6] },
    { slot: "Afternoon", start: "14:00", end: "17:00", days: [2, 4, 6] },
    { slot: "Evening", start: "18:00", end: "21:00", days: [1, 3, 5] },
  ];

  const today = new Date();
  const schedules: Array<{
    id: string;
    doctorId: string;
    date: Date;
    timeSlot: TimeSlot;
    startTime: string;
    endTime: string;
    maxPatients: number;
    isAvailable: boolean;
  }> = [];

  for (const doctor of doctors) {
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay(); // 0 Sunday
      if (dayOfWeek === 0) continue;

      for (const slot of timeSlots) {
        if (!slot.days.includes(dayOfWeek)) continue;
        const id = `${doctor.id}-${format(date, "yyyyMMdd")}-${slot.slot}`;
        schedules.push({
          id,
          doctorId: doctor.id,
          date,
          timeSlot: slot.slot,
          startTime: slot.start,
          endTime: slot.end,
          maxPatients: 30,
          isAvailable: true,
        });
      }
    }
  }

  await prisma.schedule.createMany({ data: schedules });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
