import React, { useState } from "react";

// Definindo os horários dos períodos
const periods = {
  morning: ["Período 1", "Período 2", "Período 3", "Período 4", "Período 5"],
  afternoon: ["Período 1", "Período 2", "Período 3", "Período 4", "Período 5"],
};

const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const initializeSchedule = (rooms) => {
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

const allocateSubject = (schedule, teachers, subject) => {
  let subjectTeachers = Object.keys(teachers).filter(
    (teacher) => teachers[teacher] === subject
  );

  for (let teacher of subjectTeachers) {
    let periodsPerTeacher = 4; // Cada professor terá 4 períodos
    let attempts = 0; // Limitar o número de tentativas para evitar loop infinito

    while (periodsPerTeacher > 0 && attempts < 100) {
      let turn = periodsPerTeacher > 2 ? "afternoon" : "morning"; // Primeiro preenche 2 períodos da tarde
      let room =
        Object.keys(schedule)[
          Math.floor(Math.random() * Object.keys(schedule).length)
        ];
      let day = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
      let period = Math.floor(Math.random() * 5);

      // Verificar se já existe a mesma aula no mesmo dia e turno
      let periodOccupied = false;
      for (let r of Object.keys(schedule)) {
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
      alert(`Não foi possível alocar todos os períodos para ${teacher}`);
    }
  }
};

const allocatePeriods = (schedule, teachers, subjects) => {
  for (let subject of subjects) {
    allocateSubject(schedule, teachers, subject);
  }
};

const ScheduleTable = () => {
  const [teachers, setTeachers] = useState({});
  const [rooms, setRooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [inputFields, setInputFields] = useState({
    teacherName: "",
    teacherSubject: "",
    room: "",
    subject: "",
  });
console.log(scheduleData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields({
      ...inputFields,
      [name]: value,
    });
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    setTeachers({
      ...teachers,
      [inputFields.teacherName]: inputFields.teacherSubject,
    });
    setInputFields({ ...inputFields, teacherName: "", teacherSubject: "" });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    setRooms([...rooms, inputFields.room]);
    setInputFields({ ...inputFields, room: "" });
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    setSubjects([...subjects, inputFields.subject]);
    setInputFields({ ...inputFields, subject: "" });
  };

  const handleGenerateSchedule = () => {
    if (!teachers || !rooms || !subjects) {
      return alert("Preencha os campos antes de gerar a grade horária");
    }
    const schedule = initializeSchedule(rooms);
    allocatePeriods(schedule, teachers, subjects);
    setScheduleData(schedule);
  };

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
      <div className="flex">
        <div className="w-1/2">
          <form onSubmit={handleAddTeacher} className="mb-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">Adicionar Professores</h2>
            <input
              type="text"
              name="teacherName"
              value={inputFields.teacherName}
              onChange={handleInputChange}
              placeholder="Nome do Professor"
              className="px-4 py-2 border rounded mb-2"
            />
            <input
              type="text"
              name="teacherSubject"
              value={inputFields.teacherSubject}
              onChange={handleInputChange}
              placeholder="Matéria"
              className="px-4 py-2 border rounded mb-2"
            />
            <div>
              <button
                type="button"
                onClick={handleAddTeacher}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
              >
                Adicionar Professor
              </button>
            </div>
          </form>

          <form onSubmit={handleAddRoom} className="mb-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">Adicionar Salas</h2>
            <input
              type="text"
              name="room"
              value={inputFields.room}
              onChange={handleInputChange}
              placeholder="Nome da Sala"
              className="px-4 py-2 border rounded mb-2"
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
              Adicionar Sala
            </button>
          </form>

          <form className="mb-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">Adicionar Matérias</h2>
            <input
              type="text"
              name="subject"
              value={inputFields.subject}
              onChange={handleInputChange}
              placeholder="Nome da Matéria"
              className="px-4 py-2 border rounded mb-2"
            />
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
              Adicionar Matéria
            </button>
          </form>

          <div className="mb-8 flex justify-center items-center">
            <button
              onClick={handleGenerateSchedule}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Gerar Cronograma
            </button>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          <div className="mb-4 h-40 overflow-y-scroll">
            <h2 className="text-xl font-bold mb-2">Professores Adicionados</h2>
            <ul className="list-disc pl-6">
              {Object.keys(teachers).map((teacher) => (
                <li key={teacher}>
                  {teacher} - {teachers[teacher]}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4 h-40 overflow-y-scroll">
            <h2 className="text-xl font-bold mb-2">Salas Adicionadas</h2>
            <ul className="list-disc pl-6">
              {rooms.map((room, index) => (
                <li key={index}>{room}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4 h-40 overflow-y-scroll">
            <h2 className="text-xl font-bold mb-2">Matérias Adicionadas</h2>
            <ul className="list-disc pl-6">
              {subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {scheduleData !== null && (
        <>
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
                    <table className="min-w-full  border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Horário</th>
                          <th className="py-2 px-4 border-b">Professor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {console.log(periods.morning.length)}
                        {periods.morning.length > 0 &&
                          periods.morning.map((period, index) => (
                            <tr key={index}>
                              <td className="py-2 px-4 border-b">{period}</td>
                              <td className="py-2 px-4 border-b">
                                {/* {console.log(
                                  scheduleData[room][day]
                                    ? scheduleData[room][day].morning[index]
                                    : "",
                                  "=========",
                                  period
                                )} */}
                                {scheduleData[room][day].morning[index]
                                  ? scheduleData[room][day].morning[index]
                                  : "" || "Livre"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <h4 className="text-lg font-semibold mb-2">Tarde</h4>
                    <table className="min-w-full  border border-gray-200">
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
                              {scheduleData[room][day].afternoon[index] ||
                                "Livre"}
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
        </>
      )}
    </div>
  );
};

export default ScheduleTable;
