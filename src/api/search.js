import axiosInstance from './axiosInstance'

export const globalSearch = (q, { signal } = {}) =>
  axiosInstance.get('/search/', { params: { q }, signal }).then(r => r.data)
