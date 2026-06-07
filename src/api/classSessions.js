import axiosInstance from './axiosInstance'

export const getClassSessions = () =>
  axiosInstance.get('/classSessions/').then(r => r.data)

export const createClassSession = (data) =>
  axiosInstance.post('/classSessions/', data).then(r => r.data)

export const updateClassSession = (id, data) =>
  axiosInstance.patch(`/classSessions/${id}/`, data).then(r => r.data)

export const deleteClassSession = (id) =>
  axiosInstance.delete(`/classSessions/${id}/`).then(r => r.data)
