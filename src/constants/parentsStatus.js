export const PARENTS_STATUS_OPTIONS = [
  { value: 'married',       label: 'נשואים' },
  { value: 'divorced',      label: 'גרושים' },
  { value: 'separated',     label: 'פרודים' },
  { value: 'single_parent', label: 'חד הוריות' },
  { value: 'widowed',       label: 'שכול' },
  { value: 'other',         label: 'אחר' },
]

export const PARENTS_STATUS_LABEL = Object.fromEntries(
  PARENTS_STATUS_OPTIONS.map(({ value, label }) => [value, label])
)
