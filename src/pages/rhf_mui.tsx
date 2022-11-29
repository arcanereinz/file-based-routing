import React, { BaseSyntheticEvent, useState } from 'react'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'

import {
  registerDefaultValues,
  RegisterForm,
  RegisterInput,
} from '@/components/forms/register-form'

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad']
const isStepOptional = (step: number) => {
  return step === 1
}

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set<number>())
  const [registerValues, setRegisterValues] = useState<RegisterInput>(
    registerDefaultValues
  )

  const successHandler = (values: RegisterInput) => {
    if (formContextRef.current?.formState.isSubmitSuccessful) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
    setRegisterValues(values)
    // setRefreshParent({})
  }

  const formContextRef = React.useRef<UseFormReturn<RegisterInput>>()
  const formSubmitHandlerRef =
    React.useRef<
      (
        event?: BaseSyntheticEvent<object, any, any> | undefined
      ) => Promise<void>
    >()

  const forms = useMemo(
    () => [
      {
        stepName: 'Register',
        component: (
          <RegisterForm
            className="w-[30rem]"
            defaultValues={registerValues}
            formContextRef={formContextRef}
            formSubmitHandlerRef={formSubmitHandlerRef}
            onSuccess={successHandler}
            hideSubmit={true}
          />
        ),
      },
    ],
    [registerValues]
  )

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleNext = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // submit form
    await formSubmitHandlerRef.current?.(event)
    // return if errors
    if (
      formContextRef.current &&
      !Object.keys(formContextRef.current.formState.errors).length
    ) {
      let newSkipped = skipped
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values())
        newSkipped.delete(activeStep)
      }

      setSkipped(newSkipped)
    }
  }

  console.log('nang-parent', formContextRef.current?.formState)

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className="w-[100%]">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {}
          const labelProps: {
            optional?: React.ReactNode
          } = {}
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            )
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <nav className="flex flex-row pt-2">
            <p className="flex-auto" />
            <Button onClick={handleReset}>Reset</Button>
          </nav>
        </Paper>
      ) : (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" component="h6" sx={{ mt: 2, mb: 1 }}>
            <span>{forms[activeStep]?.stepName}&nbsp;</span>
            <span className="text-sm">(Step {activeStep + 1})</span>
          </Typography>
          {forms[activeStep]?.component}
          <nav className="flex flex-row pt-2">
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <p className="flex-auto" />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!!formContextRef.current?.formState.isSubmitting}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </nav>
        </Paper>
      )}
    </div>
  )
}
