'use client'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth_client'
import { ButtonHTMLAttributes } from 'react'

export function SignButton(props: ButtonHTMLAttributes<any>) {
  return (
    <button className="rouded-md flex border-2 border-slate-500 p-2" {...props}>
      {props.children}
    </button>
  )
}

export function SigninDiscord() {
  return (
    <SignButton
      onClick={() => {
        authClient.signIn.social({ provider: 'discord' })
      }}
    >
      signin with discord
    </SignButton>
  )
}

export function Signout() {
  const { replace } = useRouter()
  return (
    <SignButton
      onClick={async () => {
        await authClient.signOut()

        replace('/')
      }}
    >
      Signout
    </SignButton>
  )
}
