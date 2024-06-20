import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: String,
});

const TeacherSchema = new mongoose.Schema({
  name: String,
});

const TimeslotSchema = new mongoose.Schema({
  day: String,
  period: String,
  time: String,
});

const ClassSchema = new mongoose.Schema({
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  timeslot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Timeslot' },
  subject: String,
});

export const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);
export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
export const Timeslot = mongoose.models.Timeslot || mongoose.model('Timeslot', TimeslotSchema);
export const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);
