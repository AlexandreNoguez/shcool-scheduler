"use client";
import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    (teacher) => teachers[teacher].subject === subject
  );

  for (let teacher of subjectTeachers) {
    let periodsPerTeacher = teachers[teacher].periods; // Usando o valor de períodos definido para o professor
    let attempts = 0; // Limitar o número de tentativas para evitar loop infinito

    while (periodsPerTeacher > 0 && attempts < 1000) {
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
  const [inputFields, setInputFields] = useState({
    teacherName: "",
    teacherSubject: "",
    teacherPeriods: 0, // Adicionando campo para número de períodos
    room: "",
    subject: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields({
      ...inputFields,
      [name]: value,
    });
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (
      !inputFields.teacherName ||
      !inputFields.teacherPeriods ||
      !inputFields.teacherSubject
    ) {
      return alert("Primeiro preencha para adicionar");
    }
    setTeachers({
      ...teachers,
      [inputFields.teacherName]: {
        subject: inputFields.teacherSubject,
        periods: parseInt(inputFields.teacherPeriods, 10), // Salvando o número de períodos como número
      },
    });
    setInputFields({
      ...inputFields,
      teacherName: "",
      teacherSubject: "",
      teacherPeriods: 0,
    });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!inputFields.room) {
      return alert("Primeiro preencha para adicionar");
    }
    setRooms([...rooms, inputFields.room]);
    setInputFields({ ...inputFields, room: "" });
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!inputFields.subject) {
      return alert("Primeiro preencha para adicionar");
    }
    setSubjects([...subjects, inputFields.subject]);
    setInputFields({ ...inputFields, subject: "" });
  };

  const handleGenerateSchedule = () => {
    if (!rooms.length && !subjects.length) {
      return alert("Preencha os campos antes de gerar a grade horária");
    }
    const schedule = initializeSchedule(rooms);
    allocatePeriods(schedule, teachers, subjects);
    setScheduleData(schedule);
  };

  const handleDownloadPDF = () => {
    const docDefinition = {
      content: rooms.flatMap((room) => {
        return daysOfWeek.flatMap((day) => {
          return [
            { text: `${day} - Turma ${room}`, style: "header" },
            { text: "Manhã", style: "subheader" },
            {
              table: {
                headerRows: 1,
                widths: ["*", "*"],
                body: [
                  ["Horário", "Professor"],
                  ...periods.morning.map((period, index) => [
                    period,
                    scheduleData[room][day].morning[index]
                      ? `${scheduleData[room][day].morning[index]} - (${
                          teachers[scheduleData[room][day].morning[index]]
                            .subject
                        })`
                      : "Livre",
                  ]),
                ],
              },
              layout: "lightHorizontalLines",
            },
            { text: "Tarde", style: "subheader" },
            {
              table: {
                headerRows: 1,
                widths: ["*", "*"],
                body: [
                  ["Horário", "Professor"],
                  ...periods.afternoon.map((period, index) => [
                    period,
                    scheduleData[room][day].afternoon[index]
                      ? `${scheduleData[room][day].afternoon[index]} - (${
                          teachers[scheduleData[room][day].afternoon[index]]
                            .subject
                        })`
                      : "Livre",
                  ]),
                ],
              },
              layout: "lightHorizontalLines",
            },
            { text: "", margin: [0, 10] },
          ];
        });
      }),
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10],
        },
        subheader: {
          fontSize: 14,
          margin: [0, 5],
        },
      },
      pageMargins: [40, 60, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download("schedule.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between text-center">
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
            <input
              type="number"
              name="teacherPeriods"
              value={inputFields.teacherPeriods}
              onChange={handleInputChange}
              placeholder="Número de Períodos"
              className="px-4 py-2 border rounded mb-2"
            />
            <div>
              <button
                type="submit"
                onClick={handleAddTeacher}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
              >
                Adicionar Professor
              </button>
            </div>
          </form>

          <form onSubmit={handleAddRoom} className="mb-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">Adicionar Turmas</h2>
            <input
              type="text"
              name="room"
              value={inputFields.room}
              onChange={handleInputChange}
              placeholder="Nome da Turma"
              className="px-4 py-2 border rounded mb-2"
            />
            <button
              type="submit"
              onClick={handleAddRoom}
              className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
              Adicionar Turma
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
              type="submit"
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
              Adicionar Matéria
            </button>
          </form>
        </div>

        <div className="w-1/2">
          <div className="h-40 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Professores Adicionados:</h2>
            <ul className="list-disc list-inside mb-4">
              {Object.keys(teachers).map((teacher) => (
                <li key={teacher}>
                  {teacher} - {teachers[teacher].subject} (
                  {teachers[teacher].periods} períodos)
                </li>
              ))}
            </ul>
          </div>
          <div className="h-40 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Turmas Adicionadas:</h2>
            <ul className="list-disc list-inside mb-4">
              {rooms.map((room) => (
                <li key={room}>{room}</li>
              ))}
            </ul>
          </div>
          <div className="h-40 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Matérias Adicionadas:</h2>
            <ul className="list-disc list-inside mb-4">
              {subjects.map((subject) => (
                <li key={subject}>{subject}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-center items-center">
        <button
          onClick={handleGenerateSchedule}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Gerar Cronograma
        </button>
        {scheduleData && (
          <button
            onClick={handleDownloadPDF}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Baixar PDF
          </button>
        )}
      </div>

      {scheduleData !== null && (
        <div id="scheduleTable" className="p-20 bg-white text-black">
          {rooms.map((room) => (
            <div key={room}>
              <div className="mb-4">
                <span className="text-xl font-bold">Turma - {room}</span>
              </div>
              <div className="mb-8">
                {daysOfWeek.map((day) => (
                  <div key={day} className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{day}</h3>
                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full md:w-1/2 px-2">
                        <h4 className="text-lg font-semibold mb-2">Manhã</h4>
                        <table className="min-w-full border border-gray-200">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b">Horário</th>
                              <th className="py-2 px-4 border-b">Professor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {periods.morning.length > 0 &&
                              periods.morning.map((period, index) => (
                                <tr key={index}>
                                  <td className="py-2 px-4 border-b">
                                    {period}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {scheduleData[room][day].morning[index]
                                      ? `${
                                          scheduleData[room][day].morning[index]
                                        } - (${
                                          teachers[
                                            scheduleData[room][day].morning[
                                              index
                                            ]
                                          ].subject
                                        })`
                                      : "Livre"}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full md:w-1/2 px-2">
                        <h4 className="text-lg font-semibold mb-2">Tarde</h4>
                        <table className="min-w-full border border-gray-200">
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
                                  {scheduleData[room][day].afternoon[index]
                                    ? `${
                                        scheduleData[room][day].afternoon[index]
                                      } - (${
                                        teachers[
                                          scheduleData[room][day].afternoon[
                                            index
                                          ]
                                        ].subject
                                      })`
                                    : "Livre"}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
