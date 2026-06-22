import axiosInstance from './axiosInstance'

export const getDocuments = (params = {}) =>
  axiosInstance.get('/documents/', { params }).then(r => r.data)

export const getDocument = (id) =>
  axiosInstance.get(`/documents/${id}/`).then(r => r.data)

export const createDocument = (formData) =>
  axiosInstance.post('/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)

export const updateDocument = (id, formData) =>
  axiosInstance.patch(`/documents/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)

export const deleteDocument = (id) =>
  axiosInstance.delete(`/documents/${id}/`).then(r => r.data)

// Returns a Blob; Bearer header is attached by axiosInstance — never use a plain URL.
export const getDocumentContent = (id) =>
  axiosInstance.get(`/documents/${id}/content/`, { responseType: 'blob' }).then(r => r)

export const downloadDocument = (id) =>
  axiosInstance.get(`/documents/${id}/download/`, { responseType: 'blob' }).then(r => r)
