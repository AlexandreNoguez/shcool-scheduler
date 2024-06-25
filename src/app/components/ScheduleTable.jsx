import React, { useState, useEffect } from "react";

// Definindo os horários dos períodos
const periods = {
  morning: ["Período 1", "Período 2", "Período 3", "Período 4", "Período 5"],
  afternoon: ["Período 1", "Período 2", "Período 3", "Período 4", "Período 5"],
};

const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const rooms = ["Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala 5"];
const teachers = {
  "Português 1": "Português",
  "Português 2": "Português",
  "Matemática 1": "Matemática",
  "Matemática 2": "Matemática",
  "Geografia 1": "Geografia",
  "Geografia 2": "Geografia",
};

const initializeSchedule = () => {
  const schedule = {};
  for (let room of rooms) {
    schedule[room] = {};
    for (let day of daysOfWeek) {
      schedule[room][day] = {
        morning: Array(5).fill(null), // 5 períodos na manhã
        afternoon: Array(5).fill(null), // 5 períodos na tarde
      };
    }
  }
  return schedule;
};

const allocateSubject = (schedule, subject) => {
  let subjectTeachers = Object.keys(teachers).filter(
    (teacher) => teachers[teacher] === subject
  );

  for (let teacher of subjectTeachers) {
    let periodsPerTeacher = 4; // Cada professor terá 4 períodos
    let attempts = 0; // Limitar o número de tentativas para evitar loop infinito

    while (periodsPerTeacher > 0 && attempts < 100) {
      let turn = periodsPerTeacher > 2 ? "afternoon" : "morning"; // Primeiro preenche 2 períodos da tarde
      let room = rooms[Math.floor(Math.random() * rooms.length)];
      let day = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
      let period = Math.floor(Math.random() * 5);

      // Verificar se já existe a mesma aula no mesmo dia e turno
      let periodOccupied = false;
      for (let r of rooms) {
        if (schedule[r][day][turn][period] === teacher) {
          periodOccupied = true;
          break;
        }
      }

      if (!schedule[room][day][turn][period] && !periodOccupied) {
        schedule[room][day][turn][period] = teacher;
        periodsPerTeacher--;
      }
      attempts++;
    }

    if (periodsPerTeacher > 0) {
      console.log(`Não foi possível alocar todos os períodos para ${teacher}`);
    }
  }
};

const allocatePeriods = (schedule) => {
  const subjects = ["Português", "Matemática", "Geografia"];
  for (let subject of subjects) {
    console.log(`Alocando horários para ${subject}`);
    allocateSubject(schedule, subject);
  }
};

const ScheduleTable = () => {
  const [scheduleData, setScheduleData] = useState(initializeSchedule());
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const schedule = initializeSchedule();
    allocatePeriods(schedule);
    setScheduleData(schedule);
  }, []);

  const handleNextPage = () => {
    if (currentPage < rooms.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const room = rooms[currentPage];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Anterior
        </button>
        <span className="text-xl font-bold">{room}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === rooms.length - 1}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Próximo
        </button>
      </div>
      <div className="mb-8">
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{day}</h3>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <h4 className="text-lg font-semibold mb-2">Manhã</h4>
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
                          {scheduleData[room][day].morning[index] || "Livre"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <h4 className="text-lg font-semibold mb-2">Tarde</h4>
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
                          {scheduleData[room][day].afternoon[index] || "Livre"}
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
    </div>
  );
};

export default ScheduleTable;
