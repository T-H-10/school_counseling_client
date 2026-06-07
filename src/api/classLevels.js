import axiosInstance from './axiosInstance'

export const getClassLevels = () =>
  axiosInstance.get('/classLevels/').then(r => r.data)
