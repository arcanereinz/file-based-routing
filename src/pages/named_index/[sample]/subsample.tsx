import { Link, MakeGenerics, useMatch } from '@tanstack/react-location'

type Page = MakeGenerics<{ Params: { sample: string } }>

export default function Subsample() {
  const { params, data } = useMatch<Page>()
  return (
    <div>
      <h1>named_index:hi:{params.sample}</h1>
      <Link className="mt-4 p-2 hover:underline" to="/named_index">
        ⟵
      </Link>
    </div>
  )
}
