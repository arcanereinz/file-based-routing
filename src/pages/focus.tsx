import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import styles from './focus.module.css'

const schema = z.object({
  name: z.string().length(3),
  email: z.string().email(),
  age: z.number().int().positive(),
})

type FormData = z.infer<typeof schema>

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'all',
    resolver: zodResolver(schema),
  })

  const errorsValues = Object.entries(errors)

  return (
    <div>
      <h1 className={styles.h1}>React Hook Form resolver focus management</h1>
      <form className={styles.form} onSubmit={handleSubmit((data) => console.log(data))}>
        {!!errorsValues.length && (
          <fieldset>
            <legend className={styles.legend}>Uh oh! there are errors!</legend>
            <span className={styles.span}>(Click on error to focus input)</span>
            <ul>
              {errorsValues.map(
                ([name, error]) =>
                  error && (
                    <li className={styles.li} key={name} onClick={() => error.ref?.focus?.()}>
                      {name}: {error.message}
                    </li>
                  )
              )}
            </ul>
          </fieldset>
        )}

        <label className={styles.label}>Name</label>
        <input className={styles.input} {...register('name')} placeholder="(ex: John)" />

        <label>Email</label>
        <input className={styles.input} {...register('email')} placeholder="(ex: hello@mail.com)" />

        <label>Age</label>
        <input className={styles.input} {...register('age')} />

        <input className={styles.input} type="submit" />
      </form>
    </div>
  )
}
