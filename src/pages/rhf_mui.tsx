import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  DateFnsProvider,
  DateTimePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@mui/lab'
import { Box, SxProps, Theme, Typography } from '@mui/material'
import z from 'zod'

const registerSchema = z.object({
  name: z.union([
    z
      .string()
      .min(2, 'Name at least 2 characters')
      .max(5, 'Name no more than 5 characters'),
    z.string().length(0), // can be omitted
  ]),
  datetime: z.union([
    z.date({ required_error: 'Date required' }),
    z.undefined(),
  ]),
  drop: z.string().min(1, 'Drop required'),
})

type RegisterInput = z.TypeOf<typeof registerSchema>

const styles: Record<string, SxProps<Theme>> = {
  spacer: {
    marginTop: '.5rem',
    marginBottom: '.5rem',
    '&:hover': {
      backgroundColor: 'aliceblue',
    },
  },
}

export default function Forms() {
  const formContext = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      datetime: undefined,
      drop: '',
    },
  })
  const { formState } = formContext

  const errorsValues = useMemo(
    () => Object.entries(formState.errors),
    [formState.errors, formState.isValidating]
  )

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      formContext.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isSubmitSuccessful])

  useEffect(() => {
    if (Object.keys(formState.errors).length) {
      console.log('errors', formState.errors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.errors])

  const onSubmitHandler: SubmitHandler<RegisterInput> = async (
    values,
    _event
  ) => {
    await new Promise((accept, _reject) => setTimeout(() => accept(1), 1000))
    console.log('values', values)
  }

  return (
    <Box sx={{ maxWidth: '30rem' }}>
      <Typography variant="h4" component="h1" sx={{ mb: '2rem' }}>
        Register
      </Typography>
      <FormContainer
        // defaultValues={{ name: 'a' }}
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(onSubmitHandler)}
      >
        <article className="flex flex-col">
          {!formState.isValid && (
            <fieldset>
              <ul className="mb-10">
                {errorsValues.map(
                  ([name, error]) =>
                    error && (
                      <li
                        className="my-1 cursor-pointer text-rose-500 hover:underline"
                        key={name}
                        onClick={() => error.ref?.focus?.()}
                      >
                        {name}: {error.message}
                      </li>
                    )
                )}
              </ul>
            </fieldset>
          )}

          <TextFieldElement
            sx={styles.spacer}
            name="name"
            label="Name" /*required*/
            disabled={formState.isSubmitting}
          />
          <DateFnsProvider>
            <DateTimePickerElement
              inputProps={{
                sx: styles.spacer,
                disabled: formState.isSubmitting,
              }}
              name="datetime"
            />
          </DateFnsProvider>

          <SelectElement
            sx={{ ...styles.spacer, minWidth: '10em' }}
            label="Required"
            name="drop"
            disabled={formState.isSubmitting}
            options={[
              {
                id: '1',
                label: 'Label 1',
              },
              {
                id: '2',
                label: 'label 2',
              },
            ]}
            // required
          />
          <LoadingButton
            variant="contained"
            fullWidth
            type="submit"
            loading={formState.isSubmitting}
            sx={{ py: '0.8rem', mt: '1rem' }}
          >
            Register
          </LoadingButton>
        </article>
      </FormContainer>
    </Box>
  )
}

function RhfMui() {
  return <div></div>
}
