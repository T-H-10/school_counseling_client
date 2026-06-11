// Shared react-select styles for searchable dropdowns.
export const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#a5b4fc' : '#e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: state.isFocused ? '0 0 0 2px #c7d2fe' : 'none',
    fontSize: '0.875rem',
    minHeight: '38px',
    '&:hover': { borderColor: '#a5b4fc' },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#eef2ff' : 'white',
    color: '#374151',
    fontSize: '0.875rem',
  }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
  singleValue: (base) => ({ ...base, fontSize: '0.875rem' }),
}
