import JobCard from '@/components/job-card'
import JobEmpty from '@/components/job-empty'
import PromoCard from '@/components/promo-card'
import { Search } from 'lucide-react'
import React from 'react'

const JobList = () => {
    const jobs = [
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
        <div className="min-h-screen bg-[#f8fbf9]">
            <header className="bg-white border-b border-[#e0e0e0] px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-[#1d1f20]">Job List</h1>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#01959f] to-[#43936c] flex items-center justify-center text-white font-semibold">
                    A
                </div>
            </header>
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
                        {jobs ? (
                            jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <JobEmpty />
                        )}
                    </div>
                </div>
                <div className="w-80">
                    <PromoCard />
                </div>
            </div>
            <div className="fixed right-0 top-0 bottom-0 w-1 bg-[#01959f]" />
        </div>
    )
}

export default JobList