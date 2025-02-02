'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
