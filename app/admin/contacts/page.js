'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../../@/components/ui/button'
import { Input } from '../../../@/components/ui/input'
import { Badge } from '../../../@/components/ui/badge'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      if (search) {
        params.append('search', search)
      }
      
      const res = await fetch(`/api/admin/contacts?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setContacts(data.contacts)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch contacts:', data.error)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      if (res.ok) {
        // Update the contact in the list
        setContacts(prev => 
          prev.map(contact => 
            contact._id === id ? { ...contact, status } : contact
          )
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  useEffect(() => {
    fetchContacts(currentPage)
  }, [currentPage, statusFilter])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
      fetchContacts(1)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [search])

  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && contacts.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Contact Submissions</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Submissions</h1>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name, email, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-lg shadow">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No contact submissions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.destination}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.members}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <select
                          value={contact.status}
                          onChange={(e) => updateStatus(contact._id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const message = `Name: ${contact.name}\nEmail: ${contact.email}\nDestination: ${contact.destination}\nMembers: ${contact.members}\n\nMessage:\n${contact.message}`
                            alert(message)
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === pagination.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 