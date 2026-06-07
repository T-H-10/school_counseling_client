import axiosInstance from './axiosInstance'

export const getCalendarEvents = (start, end) =>
  axiosInstance.get('/classSessions/calendar/', {
    params: { start: start.toISOString(), end: end.toISOString() },
  }).then(r => r.data)
