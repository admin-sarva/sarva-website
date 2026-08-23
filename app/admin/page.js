"use client"

import { useAuth } from "../../lib/useAuth"
import { Button } from "../../@/components/ui/button"
import Link from "next/link"
import Loading from "../../components/shared/loading"

const actionCards = [
  {
    title: "Publish a Place",
    href: "/admin/places",
    description: "Create destination pages with hero images, galleries, and scenic spots.",
    steps: ["Add place identity", "Upload hero and gallery", "Add scenic spots", "Submit and review"],
  },
  {
    title: "Publish a Stay",
    href: "/admin/stays",
    description: "Create accommodation listings with pricing, amenities, images, and detail copy.",
    steps: ["Add stay identity", "Add filters and pricing", "Upload images", "Submit and review"],
  },
  {
    title: "Review Wander Notes",
    href: "/admin/notes",
    description: "Preview user stories and approve the ones ready for the public site.",
    steps: ["Open pending notes", "Preview the story", "Check image and copy", "Approve"],
  },
  {
    title: "Manage Contacts",
    href: "/admin/contacts",
    description: "Track enquiries, search messages, and move each contact through a response status.",
    steps: ["Search or filter", "Open message", "Reply outside the panel", "Mark status"],
  },
]

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  if (authLoading) return <div className="p-8"><Loading /></div>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#f8faf8] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-950">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Use this panel to publish places, stays, wander notes, and manage travel enquiries.
              Each action below shows the exact steps to follow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/navigation"><Button variant="outline">All Admin Actions</Button></Link>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
          <h2 className="text-lg font-semibold text-emerald-950">Recommended daily workflow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-emerald-950">
            <li>Check new contact submissions and update their status.</li>
            <li>Review pending wander notes and approve only complete submissions.</li>
            <li>Add or update places before adding stays linked to those places.</li>
            <li>Open the public pages after every publish to verify images, text, and links.</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {actionCards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-emerald-900">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-gray-700">
                {card.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/admin/places/list"><Button className="w-full" variant="outline">View All Places</Button></Link>
          <Link href="/admin/stays/list"><Button className="w-full" variant="outline">View All Stays</Button></Link>
          <Link href="/admin/navigation"><Button className="w-full">Open Action Directory</Button></Link>
        </div>
      </div>
    </div>
  )
}
