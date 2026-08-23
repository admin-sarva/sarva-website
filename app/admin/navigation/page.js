"use client"

import { useAuth } from "../../../lib/useAuth"
import { Button } from "../../../@/components/ui/button"
import Link from "next/link"
import Loading from "../../../components/shared/loading"

const adminPages = [
  {
    title: "Dashboard",
    path: "/admin",
    category: "Main",
    purpose: "Start here for the daily workflow and quick links.",
    steps: ["Open dashboard", "Choose the task", "Follow the page steps", "Verify the public page"],
  },
  {
    title: "Contact Submissions",
    path: "/admin/contacts",
    category: "Leads",
    purpose: "Search, read, and update enquiry statuses.",
    steps: ["Filter contacts", "View message", "Reply manually", "Mark read, replied, or archived"],
  },
  {
    title: "Wander Notes",
    path: "/admin/notes",
    category: "Content",
    purpose: "Approve visitor-submitted stories.",
    steps: ["Open pending note", "Preview content", "Check image and summary", "Approve if ready"],
  },
  {
    title: "Add Place",
    path: "/admin/places",
    category: "Destinations",
    purpose: "Create a destination detail page.",
    steps: ["Add identity", "Upload images", "Add descriptions and spots", "Submit"],
  },
  {
    title: "All Places",
    path: "/admin/places/list",
    category: "Destinations",
    purpose: "Review, edit, and delete destination pages.",
    steps: ["Find place", "Check image and spot counts", "Edit or delete", "Review public page"],
  },
  {
    title: "Add Stay",
    path: "/admin/stays",
    category: "Stays",
    purpose: "Create an accommodation listing and detail page.",
    steps: ["Add identity", "Add price and filters", "Upload images", "Submit"],
  },
  {
    title: "All Stays",
    path: "/admin/stays/list",
    category: "Stays",
    purpose: "Review, edit, and delete stay listings.",
    steps: ["Find stay", "Check price and tags", "Edit or delete", "Review public page"],
  },
]

export default function AdminNavigationPage() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  const groupedPages = adminPages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = []
    acc[page.category].push(page)
    return acc
  }, {})

  if (authLoading) return <div className="p-8"><Loading /></div>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#f8faf8] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-950">All Admin Actions</h1>
            <p className="mt-2 text-sm text-gray-600">Every admin task, where it lives, and the steps to complete it.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin"><Button variant="outline">Dashboard</Button></Link>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>

        <div className="grid gap-8">
          {Object.entries(groupedPages).map(([category, pages]) => (
            <section key={category} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-emerald-900">{category}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <Link key={page.path} href={page.path} className="rounded-lg border border-gray-200 p-4 transition hover:border-emerald-300 hover:shadow-sm">
                    <h3 className="font-semibold text-gray-950">{page.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{page.purpose}</p>
                    <p className="mt-2 text-xs font-mono text-emerald-700">{page.path}</p>
                    <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-gray-700">
                      {page.steps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
