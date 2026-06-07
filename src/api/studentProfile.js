import axiosInstance from './axiosInstance'

export const getStudent = (id) =>
  axiosInstance.get(`/students/${id}/`).then(r => r.data)

export const getStudentTimeline = (id) =>
  axiosInstance.get(`/students/${id}/timeline/`).then(r => r.data)
