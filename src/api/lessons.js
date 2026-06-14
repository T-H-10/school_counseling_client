import axiosInstance from './axiosInstance'

export const getLessons = () =>
  axiosInstance.get('/lessons/').then(r => r.data)

export const getLesson = (id) =>
  axiosInstance.get(`/lessons/${id}/`).then(r => r.data)

export const createLesson = (data) =>
  axiosInstance.post('/lessons/', data).then(r => r.data)

export const updateLesson = (id, data) =>
  axiosInstance.patch(`/lessons/${id}/`, data).then(r => r.data)

export const deleteLesson = (id) =>
  axiosInstance.delete(`/lessons/${id}/`).then(r => r.data)
