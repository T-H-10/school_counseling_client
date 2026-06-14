import axiosInstance from './axiosInstance'

export const getAssignments = (lessonId) =>
  axiosInstance.get('/lessonAssignments/', { params: { lesson: lessonId } }).then(r => r.data)

export const createAssignment = (data) =>
  axiosInstance.post('/lessonAssignments/', data).then(r => r.data)

export const updateAssignment = (id, data) =>
  axiosInstance.patch(`/lessonAssignments/${id}/`, data).then(r => r.data)

export const deleteAssignment = (id) =>
  axiosInstance.delete(`/lessonAssignments/${id}/`).then(r => r.data)

export const completeAssignment = (id, data) =>
  axiosInstance.post(`/lessonAssignments/${id}/complete/`, data).then(r => r.data)
