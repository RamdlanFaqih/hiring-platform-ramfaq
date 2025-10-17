import { Button } from "@/components/ui/button"

const PromoCard = () => {
  return (
    <div className="bg-[#1d1f20] rounded-2xl p-6 text-white h-fit sticky top-6">
      <h2 className="text-xl font-semibold mb-2">Recruit the best candidates</h2>
      <p className="text-[#c2c2c2] text-sm mb-6">Create jobs, invite, and hire with ease</p>
      <Button className="w-full bg-[#01959f] hover:bg-[#01959f]/90 text-white font-medium py-2 h-auto">
        Create a new job
      </Button>
    </div>
  )
}

export default PromoCard
