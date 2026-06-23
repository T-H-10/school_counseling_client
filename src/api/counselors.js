import axiosInstance from './axiosInstance'

export const getCounselors = () => axiosInstance.get('/counselors/')
export const createCounselor = (data) => axiosInstance.post('/counselors/', data)
export const updateCounselor = (id, data) => axiosInstance.patch(`/counselors/${id}/`, data)
export const resetCounselorPassword = (id, newPassword) =>
  axiosInstance.post(`/counselors/${id}/reset_password/`, { new_password: newPassword })
