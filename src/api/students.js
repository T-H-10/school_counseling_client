import axiosInstance from './axiosInstance'

export const getStudents = (params = {}) =>
  axiosInstance.get('/students/', { params }).then(r => r.data)

export const createStudent = (data) =>
  axiosInstance.post('/students/', data).then(r => r.data)

export const updateStudent = (id, data) =>
  axiosInstance.put(`/students/${id}/`, data).then(r => r.data)

export const archiveStudent = (id) =>
  axiosInstance.delete(`/students/${id}/`).then(r => r.data)
