import { Department, Doctor, Schedule } from "@/types";
import { addDays, format, setHours, setMinutes } from "date-fns";

export const departments: Department[] = [
    {
        id: "obgyn",
        name: "婦產科",
        description: "提供全面的婦女健康照護，包含產檢、婦科疾病治療及微創手術。",
        icon: "Baby"
    },
    {
        id: "pediatrics",
        name: "小兒科",
        description: "呵護寶寶的健康成長，提供疫苗接種、生長評估及常見兒科疾病治療。",
        icon: "Trees" // Using 'Trees' as a proxy for growth/sprout if needed, or just generic
    },
    {
        id: "surgery",
        name: "乳房外科",
        description: "專注於乳房健康篩檢、診斷及治療，守護女性自信與健康。",
        icon: "Heart"
    },
    {
        id: "internal",
        name: "內科",
        description: "一般內科疾病診治，慢性病管理。",
        icon: "Stethoscope"
    }
];

export const initialDoctors: Doctor[] = [
    {
        id: "dr-lee",
        name: "李宜明",
        department: "obgyn",
        title: "院長",
        specialties: ["一般產科", "高危險妊娠", "婦科腫瘤", "腹腔鏡手術"],
        imageUrl: "/images/doctor-lee.png",
        introduction: "致力於婦產科領域三十餘年，經驗豐富，視病猶親。",
        isAvailable: true
    },
    {
        id: "dr-chen",
        name: "陳曼玲",
        department: "obgyn",
        title: "主治醫師",
        specialties: ["青少女保健", "更年期障礙", "婦科微創手術"],
        imageUrl: "/images/doctor-chen.png",
        introduction: "細心溫柔的診療風格，深受女性患者信賴。",
        isAvailable: true
    },
    {
        id: "dr-hong",
        name: "洪晟哲",
        department: "pediatrics",
        title: "小兒科主任",
        specialties: ["小兒過敏", "氣喘", "新生兒照護"],
        imageUrl: "/images/doctor-hong.png",
        introduction: "專注於兒童過敏免疫領域，守護孩子的呼吸健康。",
        isAvailable: true
    },
    {
        id: "dr-li-wan",
        name: "李婉華",
        department: "surgery",
        title: "乳房外科醫師",
        specialties: ["乳房超音波", "乳房手術", "乳癌篩檢"],
        imageUrl: "/images/doctor-li-wan.png",
        introduction: "專業細緻的檢查，早期發現早期治療。",
        isAvailable: true
    }
];

// Helper to generate schedules for the next 7 days
const generateSchedules = (): Schedule[] => {
    const schedules: Schedule[] = [];
    const doctors = initialDoctors;
    const timeSlots = [
        { slot: 'Morning', start: '09:00', end: '12:00' },
        { slot: 'Afternoon', start: '14:00', end: '17:00' },
        { slot: 'Evening', start: '18:00', end: '21:00' }
    ];

    const today = new Date();

    doctors.forEach(doctor => {
        for (let i = 0; i < 14; i++) { // Generate for 2 weeks
            const currentDate = addDays(today, i);
            const dayOfWeek = currentDate.getDay(); // 0 is Sunday

            if (dayOfWeek === 0) continue; // Skip Sundays for now

            // Randomly assign slots
            timeSlots.forEach(slot => {
                if (Math.random() > 0.4) { // 60% chance to have a shift
                    schedules.push({
                        id: `${doctor.id}-${format(currentDate, 'yyyyMMdd')}-${slot.slot}`,
                        doctorId: doctor.id,
                        date: currentDate,
                        timeSlot: slot.slot as 'Morning' | 'Afternoon' | 'Evening',
                        startTime: slot.start,
                        endTime: slot.end,
                        maxPatients: 30,
                        currentPatients: Math.floor(Math.random() * 10),
                        isAvailable: true
                    });
                }
            });
        }
    });

    return schedules;
};

export const initialSchedules: Schedule[] = generateSchedules();
