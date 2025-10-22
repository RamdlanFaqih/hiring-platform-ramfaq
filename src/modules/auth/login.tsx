'use client'

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


const LoginForm = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { role, setRole } = useAuth()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()


        if (username === 'admin' && password === 'password') {
            setRole('admin')
            router.push('/dashboard')
            toast.success('Login Successfully')
            return
        }


        if (username === 'candidate' && password === 'password') {
            setRole('candidate')
            router.push('/job-list')
            toast.success('Login Successfully')
            return
        }


        toast.error('Invalid credentials — try admin/password or candidate/password')
    }

    useEffect(() => {
        // If zustand already has role, we'll handle redirect below.
        if (!role) {
            const cookieRole = typeof document !== 'undefined'
                ? document.cookie.match(/(^|;)\s*role=([^;]+)/)?.[2] ?? null
                : null

            if (cookieRole) {
                setRole(cookieRole)
            }
        }
    }, [role, setRole])

    // If role exists (either from store or cookie), immediately navigate to the correct page
    useEffect(() => {
        if (!role) return

        if (role === 'admin') {
            // replace so user can't go back to login via back button easily
            router.replace('/dashboard')
            return
        }

        if (role === 'candidate') {
            router.replace('/job-list')
            return
        }

        // unknown role -> clear it and stay on login (optional)
        setRole(null)
    }, [role, router, setRole])

    return (
        <div className="h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold mb-1">Hello There</h2>
                <p className="text-sm text-muted-foreground mb-6">Sign in to continue to your account.</p>
                <Field>
                    <FieldLabel>Username</FieldLabel>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        autoComplete="username"
                    />
                </Field>

                <Field>
                    <FieldLabel>Password</FieldLabel>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </Field>

                <Button type="submit" className="w-full mt-5">
                    Login
                </Button>
                {/* 
                <div className="text-center text-sm mt-4">
                    <span className="text-muted-foreground">Don’t have an account?</span>{' '}
                    <a className="font-medium underline underline-offset-2" href="#">Create account</a>
                </div> */}
            </form>
        </div>
    )
}

export default LoginForm;