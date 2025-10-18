import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "./ui/textarea"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group"
import { useState } from "react"
import FieldRadioChips from "./field-radio-chip"

type JobCreateFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type FieldRequirement = "mandatory" | "optional" | "off"

interface ProfileField {
  id: string
  label: string
  requirement: FieldRequirement
  disabledOptions?: FieldRequirement[]
}

const initialFields: ProfileField[] = [
  { id: "fullname", label: "Full name", requirement: "mandatory", disabledOptions: ["optional", "off"] },
  { id: "photo", label: "Photo Profile", requirement: "mandatory" },
  { id: "gender", label: "Gender", requirement: "mandatory" },
  { id: "domicile", label: "Domicile", requirement: "mandatory" },
  { id: "email", label: "Email", requirement: "mandatory", disabledOptions: ["optional", "off"] },
  { id: "phone", label: "Phone number", requirement: "mandatory" },
  { id: "linkedin", label: "Linkedin link", requirement: "mandatory" },
  { id: "dob", label: "Date of birth", requirement: "mandatory" },
]


const JobCreateForm = ({ isOpen, onOpenChange }: JobCreateFormProps) => {
  const [fields, setFields] = useState<ProfileField[]>(initialFields)


  const handleRequirementChange = (id: string, requirement: FieldRequirement) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, requirement } : field)))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="lg:min-w-[900px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <DialogHeader>
          <DialogTitle>Create a job</DialogTitle>
          <DialogDescription>
            Fill the form to create a new job.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 w-full h-[70vh] overflow-auto">
          <Field>
            <FieldLabel>Job Name</FieldLabel>
            <Input type="text" placeholder="Ex. Front End Engineer" />
          </Field>

          <Field>
            <FieldLabel>Job Type</FieldLabel>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Job Description</FieldLabel>
            <Textarea placeholder="Ex" />
          </Field>

          <Field>
            <FieldLabel>Number of Candidate Needed</FieldLabel>
            <Input type="text" placeholder="Ex.2" />
          </Field>

          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Job Salary</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Minimum Estimated Salary</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>Rp</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="7.000.000" />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Maximum Estimated Salary</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>Rp</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="8.000.000" />
                </InputGroup>
              </Field>
            </div>
          </div>
          <div className="p-4 border border-[#EDEDED] shadow-xl rounded-2xl">
            <h1 className="text-sm font-semibold text-foreground mb-4">Minimum Profile Information Required</h1>
            <div className="space-y-3 rounded-lg">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <FieldRadioChips
                    label={field.label}
                    requirement={field.requirement}
                    onRequirementChange={(req) => handleRequirementChange(field.id, req)}
                    disabledOptions={field.disabledOptions}
                  />
                  {index < fields.length - 1 && <div className="h-px bg-[#e0e0e0]" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Publish Job
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default JobCreateForm
