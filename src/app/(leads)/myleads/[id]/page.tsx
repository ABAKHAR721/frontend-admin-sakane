import { Suspense } from 'react'
import LeadDetail from './LeadDetail'
import Loading from './loading'
import { PageProps } from 'next/navigation'

export default function Page({ params }: PageProps): JSX.Element {
  const id = params?.id as string;

  return (
    <Suspense fallback={<Loading />}>
      <LeadDetail id={id} />
    </Suspense>
  )
}
