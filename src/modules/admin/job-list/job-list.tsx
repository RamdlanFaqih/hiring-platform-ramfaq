'use client'

import JobCard from '@/components/job-card'
import JobCreateForm from '@/components/job-create-form'
import JobEmpty from '@/components/job-empty'
import PromoCard from '@/components/promo-card'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type JobCardProps = {
    id: number;
    status: string;
    statusColor: string;
    startDate: string;
    title: string;
    salary: string;
}
const JobList = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)


    const handleManageJob = (id: number) => {
        router.push(`/${id}`)
    }
    const jobs: JobCardProps[] = [
        {
            id: 1,
            status: "Active",
            statusColor: "bg-[#F8FBF9] text-[#43936c]",
            startDate: "started on 1 Oct 2025",
            title: "Front End Developer",
            salary: "Rp7.000.000 - Rp8.000.000",
        },
    ]
    return (
        <div className="">
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
                <div className="flex-1">
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            placeholder="Search by job details"
                            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg bg-white text-[#1d1f20] placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#01959f]"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#01959f] w-5 h-5" />
                    </div>
                    <div className="space-y-4">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <JobCard handleClick={handleManageJob} key={job.id} job={job} />
                            ))
                        ) : (
                            <JobEmpty onOpenChange={setOpen} />
                        )}
                    </div>
                </div>
                <div className="w-80">
                    <PromoCard onOpenChange={setOpen} />
                </div>
            </div>
            {open && <JobCreateForm isOpen={open} onOpenChange={setOpen} />}
        </div>
    )
}

export default JobList