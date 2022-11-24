import { MakeGenerics, useMatch } from '@tanstack/react-location'

type Page = MakeGenerics<{ Params: { timestamp: string } }>

export default function Subtimestamp() {
  const { params } = useMatch<Page>()

  return (
    <div>
      <h1>subtimestamp</h1>
      <p>{params.timestamp}</p>
    </div>
  )
}
