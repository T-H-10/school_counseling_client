import axiosInstance from './axiosInstance'

export const getStudent = (id) =>
  axiosInstance.get(`/students/${id}/`).then(r => r.data)

export const getStudentTimeline = (id) =>
  axiosInstance.get(`/students/${id}/timeline/`).then(r => r.data)

export const createStudentEvent = (data) =>
  axiosInstance.post('/studentEvents/', data).then(r => r.data)

export const updateStudentEvent = (id, data) =>
  axiosInstance.patch(`/studentEvents/${id}/`, data).then(r => r.data)

export const deleteStudentEvent = (id) =>
  axiosInstance.delete(`/studentEvents/${id}/`).then(r => r.data)
