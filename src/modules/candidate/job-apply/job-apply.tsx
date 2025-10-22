"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { ChevronLeft, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import HandposeCapture from "@/components/handpose-capture"

interface FormData {
    fullName: string
    dateOfBirth: string
    pronoun: string
    domicile: string
    phoneNumber: string
    email: string
    linkedIn: string
}

const JobApply = () => {
    const [profileImage, setProfileImage] = useState("/Avatar.png")
    const [isOpen, setOpen] = useState(false)
    const { register, handleSubmit, watch, setValue } = useForm<FormData>({
        defaultValues: {
            fullName: "",
            dateOfBirth: "",
            pronoun: "",
            domicile: "",
            phoneNumber: "",
            email: "",
            linkedIn: "",
        },
    })

    const pronoun = watch("pronoun")
    const domicile = watch("domicile")

    const onSubmit = (data: FormData) => {
        console.log("Form submitted:", data)
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Required Label */}
                        <div className="text-[#e11428] font-semibold text-sm">* Required</div>

                        {/* Photo Profile Section */}
                        <Field>
                            <Label className="text-[#1d1f20] font-medium">Photo Profile</Label>
                            <div className="flex flex-col gap-4 mt-3">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden">
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
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
                        <Field>
                            <Label htmlFor="fullName" className="text-[#1d1f20] font-medium">
                                Full name<span className="text-[#e11428]">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                placeholder="Enter your full name"
                                {...register("fullName")}
                                className="mt-2 border-[#e0e0e0] text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f]"
                            />
                        </Field>

                        {/* Date of Birth */}
                        <Field>
                            <Label htmlFor="dateOfBirth" className="text-[#1d1f20] font-medium">
                                Date of birth<span className="text-[#e11428]">*</span>
                            </Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                {...register("dateOfBirth")}
                                className="mt-2 border-[#e0e0e0] text-[#1d1f20] focus:ring-[#01959f]"
                            />
                        </Field>

                        {/* Pronoun */}
                        <Field>
                            <Label className="text-[#1d1f20] font-medium">
                                Pronoun (gender)<span className="text-[#e11428]">*</span>
                            </Label>
                            <RadioGroup
                                value={pronoun}
                                onValueChange={(value) => setValue("pronoun", value)}
                                className="mt-3 flex gap-8"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female" className="text-[#1d1f20] font-normal cursor-pointer">
                                        She/her (Female)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male" className="text-[#1d1f20] font-normal cursor-pointer">
                                        He/him (Male)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </Field>

                        {/* Domicile */}
                        <Field>
                            <Label htmlFor="domicile" className="text-[#1d1f20] font-medium">
                                Domicile<span className="text-[#e11428]">*</span>
                            </Label>
                            <Select value={domicile} onValueChange={(value) => setValue("domicile", value)}>
                                <SelectTrigger id="domicile" className="mt-2 border-[#e0e0e0] text-[#1d1f20] focus:ring-[#01959f]">
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

                        {/* Phone Number */}
                        <Field>
                            <Label htmlFor="phoneNumber" className="text-[#1d1f20] font-medium">
                                Phone number<span className="text-[#e11428]">*</span>
                            </Label>
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
                                    {...register("phoneNumber")}
                                    className="flex-1 border-[#e0e0e0] text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f]"
                                />
                            </div>
                        </Field>

                        {/* Email */}
                        <Field>
                            <Label htmlFor="email" className="text-[#1d1f20] font-medium">
                                Email<span className="text-[#e11428]">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                {...register("email")}
                                className="mt-2 border-[#e0e0e0] text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f]"
                            />
                        </Field>

                        {/* LinkedIn */}
                        <Field>
                            <Label htmlFor="linkedIn" className="text-[#1d1f20] font-medium">
                                Link LinkedIn<span className="text-[#e11428]">*</span>
                            </Label>
                            <Input
                                id="linkedIn"
                                type="url"
                                placeholder="https://linkedin.com/in/username"
                                {...register("linkedIn")}
                                className="mt-2 border-[#e0e0e0] text-[#1d1f20] placeholder-[#9e9e9e] focus:ring-[#01959f]"
                            />
                        </Field>

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
            <HandposeCapture isModalOpen={isOpen} setIsModalOpen={setOpen} />
        </div>
    )
}


export default JobApply