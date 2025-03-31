import { PrismaClient, UserSex, Day, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ADMIN
  await prisma.admin.createMany({
    data: [
      { id: "admin1", username: "harshit" },
      { id: "admin2", username: "manodeep" }
    ],
  });

  // GRADE
  await prisma.grade.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({ level: i + 1 })),
  });

  // SUBJECT (Created before assigning to teachers)
  const subjectData = [
    { name: "Computer Networks" },
    { name: "VLSI" },
    { name: "Cloud Computing" },
    { name: "Software Engineering" },
    { name: "Engineering Economics" },
    { name: "RES" },
    { name: "CN LAB" },
    { name: "VLSI LAB" },
  ];
  await prisma.subject.createMany({ data: subjectData });

  // Fetch subjects after creation
  const subjects = await prisma.subject.findMany();

  // TEACHER (Now correctly assigned subjects)
  const teachers = await Promise.all(
    Array.from({ length: 15 }, async (_, i) =>
      prisma.teacher.create({
        data: {
          id: `teacher${i + 1}`,
          username: `teacher${i + 1}`,
          name: `TName${i + 1}`,
          surname: `TSurname${i + 1}`,
          email: `teacher${i + 1}@example.com`,
          phone: `123-456-789${i + 1}`,
          address: `Address${i + 1}`,
          bloodType: "A+",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          birthday: new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000),
          subjects: { connect: [{ id: subjects[i % subjects.length].id }] }, // Now subjects exist!
        },
      })
    )
  );

  // CLASS (Assigned valid supervisors)
  await prisma.class.createMany({
    data: Array.from({ length: 6 }, (_, i) => ({
      name: `${i + 1}A`,
      gradeID: i + 1,
      capacity: Math.floor(Math.random() * 6) + 15,
      supervisorID: teachers[i]?.id ?? null, // Ensuring valid teacher assignment
    })),
  });

  // LESSON
  await prisma.lesson.createMany({
    data: Array.from({ length: 30 }, (_, i) => ({
      name: `Lesson${i + 1}`,
      day: Object.values(Day)[i % Object.keys(Day).length], // Random day
      startTime: new Date(Date.now() + 3600000), // 1 hour later
      endTime: new Date(Date.now() + 10800000), // 3 hours later
      subjectID: subjects[i % subjects.length].id, // Ensure subject exists
      classID: (i % 6) + 1,
      teacherID: teachers[i % teachers.length]?.id ?? null, // Ensure valid teacher
    })),
  });

  // PARENT
  await prisma.parent.createMany({
    data: Array.from({ length: 25 }, (_, i) => ({
      id: `parentId${i + 1}`,
      username: `parentId${i + 1}`,
      name: `PName ${i + 1}`,
      surname: `PSurname ${i + 1}`,
      email: `parent${i + 1}@example.com`,
      phone: `+91-1234567898${i + 1}`,
      address: `Address${i + 1}`,
    })),
  });


  const existingParents = await prisma.parent.findMany({ select: { id: true } });
  const parentIds = existingParents.map(p => p.id);
  // STUDENT
  await prisma.student.createMany({
    data: Array.from({ length: 50 }, (_, i) => ({
      id: `student${i + 1}`,
      username: `student${i + 1}`,
      name: `SName${i + 1}`,
      surname: `SSurname ${i + 1}`,
      email: `student${i + 1}@example.com`,
      phone: `+91-1234567898${i + 1}`,
      address: `Address${i + 1}`,
      bloodType: "O-",
      sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
      parentID: parentIds[i % parentIds.length], // ✅ Ensure parent exists
      gradeID: (i % 6) + 1,
      classID: (i % 6) + 1,
      birthday: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000),
    })),
  });

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        uploadedAt: new Date(),
        lessonID: (i % 30) + 1,
        teacherID: `teacher${(i % 15) + 1}`,
        records: {
          create: [
            {
              studentID: `student${i}`,
              status: i % 2 === 0 ? Status.PRESENT : Status.ABSENT,
              attentiveness: i % 2 === 0 ? Math.floor(Math.random() * 101) : null,
            },
          ],
        },
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
        classID: (i % 5) + 1,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classID: (i % 5) + 1,
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error in seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
