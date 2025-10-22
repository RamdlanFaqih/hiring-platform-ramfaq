import { showSuccessNotification } from '@/components/success-notification'
import { profileFormSchema, ProfileFormValues } from '@/schema/apply-job/apply-job-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const useJobApply = () => {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            profileImage: undefined,
            fullName: "",
            dateOfBirth: "",
            pronoun: "female",
            domicile: "jakarta",
            phoneNumber: "",
            email: "",
            linkedIn: "",
        },
        mode: 'onChange',
        reValidateMode: 'onSubmit'
    })

    console.log(form.watch('profileImage'))

    const onSubmit = form.handleSubmit((data) => {
        console.log(data)
        console.log("button clicked")
        showSuccessNotification("Job Applied")
        form.reset()
    })

    return {
        form,
        onSubmit
    }
}

export default useJobApply