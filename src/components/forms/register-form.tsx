import React, { BaseSyntheticEvent, useMemo } from 'react'
import { useEffect } from 'react'
import { FieldErrorsImpl, useForm, UseFormReturn } from 'react-hook-form'
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
  setValues: React.Dispatch<React.SetStateAction<RegisterInput>>
  formContextRef: React.MutableRefObject<
    UseFormReturn<RegisterInput> | undefined
  >
  formSubmitHandlerRef: React.MutableRefObject<
    | ((
        event?: BaseSyntheticEvent<RegisterInput, any, any> | undefined
      ) => Promise<void>)
    | undefined
  >
  onSubmit?: (values: RegisterInput) => Promise<void>
  onSuccess?: (values: RegisterInput) => Promise<void>
  onInvalid?: (errors: Partial<FieldErrorsImpl<RegisterInput>>) => Promise<void>
  className?: string
  hideSubmit?: boolean
}) {
  const formContext = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: props.defaultValues,
  })

  /**
   * Update parent references
   * NOTE: must destructure formContext since formState is not overridden but updated directly
   */
  const {
    formState: {
      errors,
      isDirty,
      isSubmitting,
      isSubmitSuccessful,
      isSubmitted,
      isValid,
    },
  } = (props.formContextRef.current = formContext)

  /**
   * Update parent references
   * NOTE: references used to prevent recursive renderings
   */
  props.formSubmitHandlerRef.current = useMemo(
    () =>
      formContext.handleSubmit(
        /**
         * Call onSubmit when form altered
         */
        async (values) => {
          isDirty && (await props.onSubmit?.(values))
        },
        /**
         * Call onInvalid when form failed validation
         */
        async (errors) => {
          await props.onInvalid?.(errors)
        }
      ),
    [formContext, isDirty, props.onSubmit, props.onInvalid]
  )

  /**
   * Force parent refresh on successful submit
   * NOTE: do not put objects in dependencies or infinite recursion
   */
  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log('RegisterForm-submit', formContext.formState)
      props.onSuccess?.(formContext.getValues())
      // formContext.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  /**
   * Update parent when submitting or editing
   * NOTE: do not put objects in dependencies or infinite recursion
   */
  useEffect(() => {
    props.setValues(formContext.getValues())
  }, [isSubmitting, isDirty])

  console.log(
    'RegisterForm-child',
    errors,
    props.formContextRef.current?.formState,
    formContext.formState
  )

  return (
    <FormContainer
      // defaultValues={{ name: 'a' }}
      FormProps={{ className: clsx('flex flex-col', props.className) }}
      formContext={formContext}
      handleSubmit={props.formSubmitHandlerRef.current}
    >
      {isSubmitted && !isValid && (
        <ul className="mb-10">
          {Object.entries(errors).map(
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
        disabled={isSubmitting}
      />
      <DateFnsProvider>
        <DateTimePickerElement
          inputProps={{
            sx: styles.spacer,
            disabled: isSubmitting,
          }}
          name="datetime"
        />
      </DateFnsProvider>

      <SelectElement
        sx={{ ...styles.spacer, minWidth: '10em' }}
        label="Required"
        name="drop"
        disabled={isSubmitting}
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
          hidden={props.hideSubmit}
          type="submit"
          loading={isSubmitting}
          sx={{
            py: '0.5rem',
            mt: '1rem',
            width: 'fit-content',
            alignSelf: 'end',
          }}
        >
          Register
        </LoadingButton>
      )}
    </FormContainer>
  )
}
