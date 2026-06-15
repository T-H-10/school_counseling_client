export default function ContactCard({ student }) {
  const hasContact = student && (
    student.mother_name || student.mother_phone ||
    student.father_name || student.father_phone ||
    student.address
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6" data-testid="student-profile-contact">
      <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
        פרטי קשר
      </h2>
      {hasContact ? (
        <dl className="space-y-2">
          {(student.mother_name || student.mother_phone) && (
            <div className="flex items-center gap-3 text-sm">
              <dt className="text-gray-400 w-8 flex-shrink-0">אמא</dt>
              <dd className="text-gray-700">
                {[student.mother_name, student.mother_phone].filter(Boolean).join('  ·  ')}
              </dd>
            </div>
          )}
          {(student.father_name || student.father_phone) && (
            <div className="flex items-center gap-3 text-sm">
              <dt className="text-gray-400 w-8 flex-shrink-0">אבא</dt>
              <dd className="text-gray-700">
                {[student.father_name, student.father_phone].filter(Boolean).join('  ·  ')}
              </dd>
            </div>
          )}
          {student.address && (
            <div className="flex items-center gap-3 text-sm">
              <dt className="text-gray-400 w-8 flex-shrink-0">כתובת</dt>
              <dd className="text-gray-700">{student.address}</dd>
            </div>
          )}
        </dl>
      ) : (
        <p className="text-sm text-gray-400">אין פרטי קשר</p>
      )}
    </div>
  )
}
