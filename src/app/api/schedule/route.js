import dbConnect from "../../lib/dbConnect";
import { Room, Teacher, Timeslot, Class } from "../../models";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  try {
    const schedule = initializeSchedule();
    console.log("Iniciando");
    console.log(schedule);
    allocatePeriods(schedule);
    printSchedule(schedule);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("fim do programa");
  }
  // try {
  //   const rooms = await Room.find();
  //   const teachers = await Teacher.find();
  //   console.log("rooms", rooms);
  //   console.log("teachers", teachers);
  //   const schedule = [];
  //   console.log("schedule", schedule);

  //   for (const room of rooms) {
  //     for (let i = 0; i < 4; i++) {
  //       const isAfternoon = i === 3;
  //       const day = days[Math.floor(Math.random() * days.length)];
  //       const period = isAfternoon ? "Afternoon" : "Morning";
  //       const time =
  //         times[period][Math.floor(Math.random() * times[period].length)];

  //       const timeslot = await Timeslot.create({ day, period, time });

  //       const availableTeacher =
  //         teachers[Math.floor(Math.random() * teachers.length)];

  //       const newClass = await Class.create({
  //         room_id: room._id,
  //         teacher_id: availableTeacher._id,
  //         timeslot_id: timeslot._id,
  //         subject: "Portuguese",
  //       });

  //       schedule.push(newClass);
  //     }
  //   }

  //   return NextResponse.json({
  //     message: "Schedule created successfully",
  //     success: true,
  //     schedule,
  //   });
  // } catch (err) {
  //   console.log(err);
  //   return NextResponse.json({
  //     message: "An error occurred",
  //     success: false,
  //     error: err.message,
  //   });
  // }
}

const rooms = ["Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala 5"];
const teachers = {
  "Português 1": "Português",
  "Português 2": "Português",
  "Matemática 1": "Matemática",
  "Matemática 2": "Matemática",
};

// Definindo os horários dos períodos
const periods = {
  morning: [
    "7h30 - 8h20",
    "8h20 - 9h10",
    "9h10 - 10h00",
    "10h15 - 11h05",
    "11h05 - 11h55",
  ],
  afternoon: [
    "13h15 - 14h05",
    "14h05 - 14h55",
    "14h55 - 15h45",
    "16h00 - 16h50",
    "16h50 - 17h40",
  ],
};

const initializeSchedule = () => {
  const schedule = {};
  for (let room of rooms) {
    schedule[room] = {
      morning: Array(5).fill(null), // 5 períodos na manhã
      afternoon: Array(5).fill(null), // 5 períodos na tarde
    };
  }
  return schedule;
};

const allocateSubject = (schedule, subject) => {
  let subjectTeachers = Object.keys(teachers).filter(
    (teacher) => teachers[teacher] === subject
  );

  for (let teacher of subjectTeachers) {
    let periodsPerTeacher = 4; // Cada professor terá 4 períodos
    let afternoonPeriods = 0;

    while (periodsPerTeacher > 0) {
      let turn = afternoonPeriods < 2 ? "afternoon" : "morning"; // Primeiro preenche 2 períodos da tarde
      if (turn === "afternoon") afternoonPeriods++;
      let room = rooms[Math.floor(Math.random() * rooms.length)];
      let period = Math.floor(Math.random() * 5);

      if (!schedule[room][turn][period]) {
        schedule[room][turn][period] = teacher;
        periodsPerTeacher--;
      }

      // Prevenção de loop infinito
      if (periodsPerTeacher === 0 && afternoonPeriods < 2) {
        for (let r of rooms) {
          for (let p = 0; p < 5; p++) {
            if (!schedule[r]["afternoon"][p]) {
              schedule[r]["afternoon"][p] = teacher;
              afternoonPeriods++;
              periodsPerTeacher--;
              if (afternoonPeriods >= 2) break;
            }
          }
          if (afternoonPeriods >= 2) break;
        }
      }
    }
  }
};

const allocatePeriods = (schedule) => {
  const subjects = ["Português", "Matemática"];
  for (let subject of subjects) {
    console.log(`Alocando horários para ${subject}`);
    allocateSubject(schedule, subject);
  }
};

const printSchedule = (schedule) => {
  console.log("Horário das Salas:");
  for (let room of rooms) {
    console.log(`\n${room}`);
    console.log("Manhã:");
    schedule[room].morning.forEach((teacher, index) => {
      console.log(`${periods.morning[index]} - ${teacher ? teacher : "Livre"}`);
    });
    console.log("Tarde:");
    schedule[room].afternoon.forEach((teacher, index) => {
      console.log(
        `${periods.afternoon[index]} - ${teacher ? teacher : "Livre"}`
      );
    });
  }
};
