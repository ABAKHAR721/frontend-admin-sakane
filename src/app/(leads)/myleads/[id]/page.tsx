import LeadDetail from './LeadDetail'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: Props) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams])
  return <LeadDetail id={params.id} />
}
