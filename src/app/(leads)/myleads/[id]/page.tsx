import { Suspense } from 'react'
import LeadDetail from './LeadDetail'
import Loading from './loading'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <LeadDetail id={params.id} />
    </Suspense>
  )
}