import { PrismaClient, UserSex, Day, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ADMIN
  await Promise.all([
    prisma.admin.upsert({
      where: { id: "admin1" },
      update: {},
      create: { id: "admin1", username: "harshit" }
    }),
    prisma.admin.upsert({
      where: { id: "admin2" },
      update: {},
      create: { id: "admin2", username: "manodeep" }
    })
  ]);

  // GRADE
  for (let i = 1; i <= 10; i++) {
    await prisma.grade.upsert({
      where: { level: i },
      update: {},
      create: { level: i }
    });
  }

  // SUBJECT
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

  for (const subject of subjectData) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject
    });
  }

  // Fetch subjects after creation
  const subjects = await prisma.subject.findMany();

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.upsert({
      where: { id: `teacher${i}` },
      update: {
        subjects: { connect: [{ id: subjects[i % subjects.length].id }] }
      },
      create: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        birthday: new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000),
        subjects: { connect: [{ id: subjects[i % subjects.length].id }] }
      }
    });
  }

  const teachers = await prisma.teacher.findMany();

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.upsert({
      where: { name: `${i}A` },
      update: {
        supervisorID: teachers[i - 1]?.id ?? null
      },
      create: {
        name: `${i}A`,
        gradeID: i,
        capacity: Math.floor(Math.random() * 6) + 15,
        supervisorID: teachers[i - 1]?.id ?? null
      }
    });
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.upsert({
      where: { id: `parentId${i}` },
      update: {},
      create: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `+91-1234567898${i}`,
        address: `Address${i}`
      }
    });
  }

  const parents = await prisma.parent.findMany();

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.student.upsert({
      where: { id: `student${i}` },
      update: {},
      create: {
        id: `student${i}`,
        username: `student${i}`,
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `+91-1234567898${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentID: parents[i % parents.length].id,
        gradeID: (i % 6) + 1,
        classID: (i % 6) + 1,
        birthday: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000)
      }
    });
  }

  const classes = await prisma.class.findMany();

  // Create lessons first
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson ${i}`,
        day: Day.MONDAY,
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
        subjectID: subjects[i % subjects.length].id,
        classID: classes[i % classes.length].id,
        teacherID: teachers[i % teachers.length].id
      }
    });
  }

  const lessons = await prisma.lesson.findMany();

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    const attendance = await prisma.attendance.upsert({
      where: {
        id: i
      },
      update: {
        uploadedAt: new Date(),
        lessonID: lessons[i % lessons.length].id,
        teacherID: teachers[i % teachers.length].id,
      },
      create: {
        id: i,
        uploadedAt: new Date(),
        lessonID: lessons[i % lessons.length].id,
        teacherID: teachers[i % teachers.length].id,
      }
    });

    // Create attendance records for multiple students
    for (let j = 1; j <= 5; j++) {
      const studentId = `student${(i + j) % 50 + 1}`; // Cycle through students
      await prisma.attendanceRecord.create({
        data: {
          studentID: studentId,
          attendanceID: attendance.id,
          status: j % 2 === 0 ? Status.PRESENT : Status.ABSENT,
          attentiveness: j % 2 === 0 ? Math.floor(Math.random() * 101) : null,
        }
      });
    }
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.upsert({
      where: { id: i },
      update: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
        classID: (i % 5) + 1,
      },
      create: {
        id: i,
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
        classID: (i % 5) + 1,
      }
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.upsert({
      where: { id: i },
      update: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classID: (i % 5) + 1,
      },
      create: {
        id: i,
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classID: (i % 5) + 1,
      }
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
