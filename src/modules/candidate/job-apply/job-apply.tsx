"use client"

import { useState } from "react"
import { Controller } from "react-hook-form"
import { ChevronLeft, Camera } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import HandposeCapture from "@/components/handpose-capture"
import useJobApply from "./job-apply.hook"
import { useParams } from "next/navigation"

const JobApply = () => {
    const params = useParams()
    const id = params?.id as string | undefined

    const { form, onSubmit } = useJobApply(id)
    const { control, watch, setValue } = form
    const [isOpen, setOpen] = useState(false)

    const profileImage = watch("profileImage")

    const handleCapture = (img: string) => {
        setValue("profileImage", img, { shouldDirty: true, shouldValidate: true })
        setOpen(false)
    }


    return (
        <div>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="text-[#1d1f20]">
                                <ChevronLeft size={24} />
                            </Button>
                            <h1 className="text-2xl font-semibold text-[#1d1f20]">Apply Front End at Rakamin</h1>
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium flex items-center gap-2">
                            <span className="text-lg">ℹ️</span>
                            This field required to fill
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Required FieldLabel */}
                        <div className="text-[#e11428] font-semibold text-sm">* Required</div>

                        {/* Photo Profile Section */}
                        <Field>
                            <FieldLabel className="text-[#1d1f20] font-medium">Photo Profile</FieldLabel>
                            <div className="flex flex-col gap-4 mt-3">
                                <div className="relative w-28 h-28 rounded-2xl overflow-hidden">
                                    <Image src={profileImage && profileImage.trim() !== "" ? profileImage : "/Avatar.png"} alt="Profile" fill className="object-cover" />
                                </div>
                                <div>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        type="button"
                                        variant="ghost"
                                        className="flex gap-2 text-[#1d1f20] font-medium hover:text-[#333333]"
                                    >
                                        <Camera size={18} />
                                        Take a Picture
                                    </Button>
                                </div>
                            </div>
                        </Field>

                        {/* Full Name */}
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="fullName" className="text-[#1d1f20] font-medium">
                                        Full name<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="fullName"
                                        placeholder="Enter your full name"
                                        {...field}
                                        className={`mt-2 text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f] ${
                                            fieldState.invalid ? "border-[#e11428] border-2" : "border-[#e0e0e0]"
                                        }`}
                                    />
                                </Field>
                            )}
                        />

                        {/* Date of Birth */}
                        <Controller
                            control={control}
                            name="dateOfBirth"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="dateOfBirth" className="text-[#1d1f20] font-medium">
                                        Date of birth<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        {...field}
                                        className={`mt-2 text-[#1d1f20] focus:ring-[#01959f] ${
                                            fieldState.invalid ? "border-[#e11428] border-2" : "border-[#e0e0e0]"
                                        }`}
                                    />
                                </Field>
                            )}
                        />

                        {/* Pronoun */}
                        <Controller
                            control={control}
                            name="pronoun"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-[#1d1f20] font-medium">
                                        Pronoun (gender)<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                        className="mt-3 flex gap-8"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <FieldLabel htmlFor="female" className="text-[#1d1f20] font-normal cursor-pointer">
                                                She/her (Female)
                                            </FieldLabel>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <FieldLabel htmlFor="male" className="text-[#1d1f20] font-normal cursor-pointer">
                                                He/him (Male)
                                            </FieldLabel>
                                        </div>
                                    </RadioGroup>
                                </Field>
                            )}
                        />

                        {/* Domicile */}
                        <Controller
                            control={control}
                            name="domicile"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="domicile" className="text-[#1d1f20] font-medium">
                                        Domicile<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                        <SelectTrigger 
                                            id="domicile" 
                                            className={`mt-2 text-[#1d1f20] focus:ring-[#01959f] ${
                                                fieldState.invalid ? "border-[#e11428] border-2" : "border-[#e0e0e0]"
                                            }`}
                                        >
                                            <SelectValue placeholder="Choose your domicile" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jakarta">Jakarta</SelectItem>
                                            <SelectItem value="surabaya">Surabaya</SelectItem>
                                            <SelectItem value="bandung">Bandung</SelectItem>
                                            <SelectItem value="medan">Medan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />

                        {/* Phone Number */}
                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="phoneNumber" className="text-[#1d1f20] font-medium">
                                        Phone number<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <div className="flex gap-2 mt-2">
                                        <Select defaultValue="62">
                                            <SelectTrigger className="w-24 border-[#e0e0e0] text-[#1d1f20] focus:ring-[#01959f]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="62">🇮🇩 +62</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="phoneNumber"
                                            placeholder="81XXXXXXXXX"
                                            {...field}
                                            className={`flex-1 text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f] ${
                                                fieldState.invalid ? "border-[#e11428] border-2" : "border-[#e0e0e0]"
                                            }`}
                                        />
                                    </div>
                                </Field>
                            )}
                        />

                        {/* Email */}
                        <Controller
                            control={control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email" className="text-[#1d1f20] font-medium">
                                        Email<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        {...field}
                                        className={`mt-2 text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f] ${
                                            fieldState.invalid ? "border-[#e11428] border-2" : "border-[#e0e0e0]"
                                        }`}
                                    />
                                </Field>
                            )}
                        />

                        {/* LinkedIn */}
                        <Controller
                            control={control}
                            name="linkedIn"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="linkedIn" className="text-[#1d1f20] font-medium">
                                        Link LinkedIn<span className="text-[#e11428]">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="linkedIn"
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        {...field}
                                        className={`mt-2 text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f] ${
                                            fieldState.invalid ? "border-[#e11428] border-2" : "border-[#e0e0e0]"
                                        }`}
                                    />
                                </Field>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#01959f] hover:bg-[#017a85] text-white font-semibold py-3 rounded-lg mt-8"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
            <HandposeCapture onCapture={handleCapture} isModalOpen={isOpen} setIsModalOpen={setOpen} />
        </div>
    )
}


export default JobApply