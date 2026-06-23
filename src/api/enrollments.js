import api from './axiosInstance'

export const getClasses = () => api.get('/enrollments/classes/').then(r => r.data)
export const setClassTeacher = (data) => api.post('/enrollments/set-class-teacher/', data).then(r => r.data)
export const promoteStudents = (data) => api.post('/enrollments/promote/', data).then(r => r.data)
export const getStudentEnrollments = (studentId) =>
  api.get('/enrollments/', { params: { student: studentId } }).then(r => r.data)
