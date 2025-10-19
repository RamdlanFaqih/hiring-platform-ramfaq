'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"


const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)


    return (
        <div className="h-screen flex items-center justify-center">
            <form  className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold mb-1">Hello There</h2>
                <p className="text-sm text-muted-foreground mb-6">Sign in to continue to your account.</p>

                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        autoComplete="email"
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

                <div className="flex items-center justify-between mt-2 mb-4">
                    <label className="flex items-center gap-2 text-sm select-none">
                        <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                        <span>Remember me</span>
                    </label>
                    <a className="text-sm underline underline-offset-2" href="#">Forgot password?</a>
                </div>

                <Button type="submit" className="w-full">
                    Login
                </Button>

                <div className="text-center text-sm mt-4">
                    <span className="text-muted-foreground">Don’t have an account?</span>{' '}
                    <a className="font-medium underline underline-offset-2" href="#">Create account</a>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;