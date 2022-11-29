import React, { BaseSyntheticEvent } from 'react'
import { useEffect, useMemo } from 'react'
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import {
  DateFnsProvider,
  DateTimePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingButton from '@mui/lab/LoadingButton'
import type { SxProps, Theme } from '@mui/material'
import clsx from 'clsx'
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
export type RegisterInput = z.TypeOf<typeof registerSchema>
export const registerDefaultValues: RegisterInput = {
  name: '',
  datetime: undefined,
  drop: '',
}

const styles: Record<string, SxProps<Theme>> = {
  spacer: {
    marginTop: '.5rem',
    marginBottom: '.5rem',
    '&:hover': {
      backgroundColor: 'aliceblue',
    },
  },
}

export function RegisterForm(props: {
  defaultValues: RegisterInput
  formContextRef: React.MutableRefObject<
    UseFormReturn<RegisterInput> | undefined
  >
  formSubmitHandlerRef: React.MutableRefObject<
    | ((
        event?: BaseSyntheticEvent<object, any, any> | undefined
      ) => Promise<void>)
    | undefined
  >
  onSuccess: (values: RegisterInput) => void
  className?: string
  hideSubmit?: boolean
}) {
  const formContext = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: props.defaultValues,
  })
  const { formState } = formContext

  const errorsValues = useMemo(
    () => Object.entries(formState.errors),
    [formState.errors, formState.isValidating]
  )

  const submitHandler: SubmitHandler<RegisterInput> = async (
    values,
    _event
  ) => {
    console.log('submitHandler-values', values, formState, formState.isDirty)

    /**
     * wait for form to be successful then refresh parent
     * @todo refactor to not use timeouts
     */
    // let tries = 0
    // const interval = setInterval(() => {
    //   if (formContext.formState.isSubmitSuccessful) {
    //     props.onSuccess()
    //     clearInterval(interval)
    //   } else if (++tries >= 2) {
    //     // clear after i try(s)
    //     clearInterval(interval)
    //   }
    // }, 100)
  }

  // pass to parent
  useEffect(() => {
    props.formContextRef.current = formContext
    props.formSubmitHandlerRef.current = formContext.handleSubmit(submitHandler)
  }, [formContext])

  console.log(
    'RegisterForm-child',
    props.formContextRef.current?.formState,
    formContext.formState
  )

  /**
   * Force parent refresh on successful submit
   * NOTE: do not put objects in dependencies or infinite recursion
   */
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      const submit = async () => {
        console.log('RegisterForm-submit', formState)
        if (formState.isDirty) {
          await new Promise((accept, _reject) =>
            setTimeout(() => accept(1), 1000)
          )
        }
        props.onSuccess(formContext.getValues())
        // formContext.reset()
      }
      submit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isSubmitSuccessful, formState.isDirty])

  useEffect(() => {
    if (Object.keys(formState.errors).length) {
      console.log('errors', formState.errors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.errors])

  return (
    <FormContainer
      // defaultValues={{ name: 'a' }}
      FormProps={{ className: clsx('flex flex-col', props.className) }}
      formContext={formContext}
      handleSubmit={formContext.handleSubmit(submitHandler)}
    >
      {formState.isSubmitted && !formState.isValid && (
        <ul className="mb-10">
          {errorsValues.map(
            ([name, error]) =>
              error && (
                <li
                  className="my-1 cursor-pointer text-red-600 hover:underline"
                  key={name}
                  onClick={() => error.ref?.focus?.()}
                >
                  {name}: {error.message}
                </li>
              )
          )}
        </ul>
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
      {!props.hideSubmit && (
        <LoadingButton
          variant="contained"
          fullWidth
          hidden={props.hideSubmit}
          type="submit"
          loading={formState.isSubmitting}
          sx={{ py: '0.8rem', mt: '1rem' }}
        >
          Register
        </LoadingButton>
      )}
    </FormContainer>
  )
}
