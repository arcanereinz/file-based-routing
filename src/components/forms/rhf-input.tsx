import { FC } from 'react'
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form'
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  FormGroup,
  FormHelperText,
  TextField,
  TextFieldProps,
} from '@mui/material'

type IFormInputProps = {
  name: string
} & TextFieldProps

export const RhfTextField: FC<IFormInputProps> = ({ name, ...rest }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={() => (
        <TextField
          {...rest}
          // {...field} cannot use field since it does not have the ref associated with the name
          {...register(name)}
          error={!!errors[name]}
          helperText={(errors[name]?.message as any) ?? ''}
        />
      )}
    />
  )
}

export const RhfCheckbox = <T extends FieldValues>(
  props: {
    name: string
  } & Omit<FormControlLabelProps, 'name' | 'control'>
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormGroup>
      <FormControlLabel
        label={props.label}
        disabled={props.disabled}
        labelPlacement={props.labelPlacement}
        className={props.className}
        control={
          <Controller
            name={props.name as Path<T>}
            defaultValue={false as PathValue<T, Path<T>>}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, ...field } }) => (
              <Checkbox {...field} checked={!!value} />
            )}
          />
        }
      />
      <FormHelperText error={!!errors['terms']}>
        {(errors?.['terms']?.message as string) ?? ''}
      </FormHelperText>
    </FormGroup>
  )
}
