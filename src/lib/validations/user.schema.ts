import { z } from 'zod'

export const RegisterUserSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'Full name is required'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Email is invalid'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
})

export const LoginUserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Email is invalid'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

export const RecoveryPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Email is invalid'),
})
