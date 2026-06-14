// RTL grid-cols-2: DOM[0]→right, DOM[1]→left. Pairs reversed so פגישה lands left and תלמידה right — matching the design.
export const CARDS = [
  {
    id: 'student',
    label: 'תלמידה',
    icon: '🧒',
    iconBg: 'bg-blue-100',
    cardBg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
  },
  {
    id: 'meeting',
    label: 'פגישה',
    icon: '📅',
    iconBg: 'bg-green-100',
    cardBg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-2 border-green-400 dark:border-green-600',
  },
  {
    id: 'lesson',
    label: 'שיעור',
    icon: '📚',
    iconBg: 'bg-purple-100',
    cardBg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
  },
  {
    id: 'document',
    label: 'מסמך',
    icon: '📄',
    iconBg: 'bg-orange-100',
    cardBg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    disabled: true,
  },
]
