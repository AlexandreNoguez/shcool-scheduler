import React, { useState, useEffect } from "react";

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

const rooms = ["Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala 5"];
const teachers = {
  "Português 1": "Português",
  "Português 2": "Português",
  "Matemática 1": "Matemática",
  "Matemática 2": "Matemática",
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

const ScheduleTable = () => {
  const [scheduleData, setScheduleData] = useState(initializeSchedule());

  useEffect(() => {
    const schedule = initializeSchedule();
    allocatePeriods(schedule);
    setScheduleData(schedule);
  }, []);

  return (
    <div className="p-6">
      {rooms.map((room) => (
        <div key={room} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{room}</h2>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2">
              <h3 className="text-xl font-semibold mb-2">Manhã</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Horário</th>
                    <th className="py-2 px-4 border-b">Professor</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.morning.map((period, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{period}</td>
                      <td className="py-2 px-4 border-b">
                        {scheduleData[room].morning[index] || "Livre"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <h3 className="text-xl font-semibold mb-2">Tarde</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Horário</th>
                    <th className="py-2 px-4 border-b">Professor</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.afternoon.map((period, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{period}</td>
                      <td className="py-2 px-4 border-b">
                        {scheduleData[room].afternoon[index] || "Livre"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleTable;
