import { useEffect, useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import z from 'zod'

import { RhfCheckbox, RhfTextField } from '@/components/rhf-input'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(32, 'Name must be less than 100 characters'),
    email: z.string(), //.min(1, 'Email is required').email('Email is invalid'),
    password: z.string(),
    //.min(1, 'Password is required')
    //.min(8, 'Password must be more than 8 characters')
    //.max(32, 'Password must be less than 32 characters'),
    passwordConfirm: z.string(), //.min(1, 'Please confirm your password'),
    terms: z.boolean(), // z.literal(true, { errorMap: () => ({ message: 'Accept Terms is required' }) }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  })

type RegisterInput = z.TypeOf<typeof registerSchema>

export default function Forms() {
  const [loading, setLoading] = useState(false)

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isSubmitting, errors },
  } = methods

  const errorsValues = useMemo(() => Object.entries(errors), [errors])

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  useEffect(() => {
    if (Object.keys(errors).length) {
      console.log('errors', errors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])

  const onSubmitHandler: SubmitHandler<RegisterInput> = async (
    values,
    event
  ) => {
    await new Promise((accept, reject) => setTimeout(() => accept(1), 1000))
    console.log('values', values)
  }

  return (
    <Box sx={{ maxWidth: '30rem' }}>
      <Typography variant="h4" component="h1" sx={{ mb: '2rem' }}>
        Register
      </Typography>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          {!!errorsValues.length && (
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

          <RhfTextField
            name="name"
            required
            fullWidth
            label="Name"
            sx={{ mb: 2 }}
          />
          <RhfTextField
            name="email"
            required
            fullWidth
            label="Email Address"
            type="email"
            sx={{ mb: 2 }}
          />
          <RhfTextField
            name="password"
            required
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 2 }}
          />
          <RhfTextField
            name="passwordConfirm"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            sx={{ mb: 2 }}
          />
          <RhfCheckbox
            name="terms"
            label={
              <Typography color={errors['terms'] ? 'error' : 'inherit'}>
                Accept Terms and Conditions
              </Typography>
            }
          />

          <LoadingButton
            variant="contained"
            fullWidth
            type="submit"
            loading={isSubmitting}
            sx={{ py: '0.8rem', mt: '1rem' }}
          >
            Register
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  )
}
