import { HDate, HebrewCalendar, gematriya, flags } from '@hebcal/core'

const HEBREW_MONTHS = [
  '', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול',
  'תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר', "אדר ב׳",
]

export function getHebrewDateString(date = new Date(), includeYear = true) {
  const hdate = new HDate(date)
  const day   = gematriya(hdate.getDate())
  const month = HEBREW_MONTHS[hdate.getMonth()]
  if (!includeYear) return `${day} ב${month}`
  const year  = gematriya(hdate.getFullYear())
  return `${day} ב${month} ${year}`
}

export function getTodayHoliday(date = new Date()) {
  const hdate = new HDate(date)
  const events = HebrewCalendar.getHolidaysOnDate(hdate, false) ?? []
  const holiday = events.find(e => !(e.getFlags() & flags.SHABBAT))
  return holiday ? holiday.render('he') : null
}
