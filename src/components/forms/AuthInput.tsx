'use client'

interface AuthInputProps {
  id?: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export default function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  error,
  required = false,
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={label.toLowerCase()} className="block text-sm font-medium leading-6 text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={id || label.toLowerCase()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
