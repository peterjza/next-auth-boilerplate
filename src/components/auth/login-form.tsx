'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import { useSearchParams } from 'next/navigation'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { login } from '@/app/actions/login'
import Link from 'next/link'

export const LoginForm = () => {
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()

	const searchParam = useSearchParams()
	const callbackUrl = searchParam.get('callbackUrl')
	const urlError =
		searchParam.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with a different provider'
			: ''

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			login(values, callbackUrl).then(data => {
				setError(data?.error)
				setSuccess(data?.success)
			})
		})
	}

	return (
		<CardWrapper
			headerLabel='Welcome Back'
			backButtonLabel='Dont have an account'
			backButtonHref='/auth/register'
			showSocial
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder='peter@example.com'
											type='email'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder='*******'
											type='password'
										/>
									</FormControl>
									<Button
										size='sm'
										variant='link'
										className='px-0 font-normal'
										asChild
									>
										<Link href='/auth/reset'>
											Forgot Password
										</Link>
									</Button>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button
						disabled={isPending}
						type='submit'
						className='w-full'
					>
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
