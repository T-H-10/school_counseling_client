import { getStudents } from '../api/students'

// Async loader for react-select AsyncSelect: searches students by name / id number.
export async function loadStudentOptions(inputValue) {
  if (!inputValue || inputValue.length < 2) return []
  try {
    const data = await getStudents({ search: inputValue, page: 1 })
    return (data.results ?? []).map(s => ({
      value: s.id,
      label: `${s.full_name} | ${s.id_number}`,
    }))
  } catch {
    return []
  }
}
