import { Link, MakeGenerics, useMatch } from '@tanstack/react-location'

export default function NamedPage() {
  return (
    <div>
      <h1>named_index:(named_page)</h1>
      <Link className="mt-4 p-2 hover:underline" to="/routing">
        ⟵
      </Link>
      <Link
        className="mt-4 p-2 hover:underline"
        to={`/named_index/${Math.floor(Math.random() * 10_000)}/subsample`}
      >
        ⟶
      </Link>
    </div>
  )
}
