'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '../../@/components/ui/dialog'
// import { Button } from './../@/components/ui/button'
import { Input } from '../../@/components/ui/input'
import { Textarea } from '../../@/components/ui/textarea'
import { Button } from '../../@/components/ui/button'

export default function ContactNow() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '', 
    members: 1, 
    destination: '' 
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email'
    if (!formData.message.trim()) errs.message = 'Message is required'
    if (!formData.destination.trim()) errs.destination = 'Destination is required'
    if (!formData.members || formData.members < 1) errs.members = 'Number of members is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSent(true)
        setFormData({ name: '', email: '', message: '', members: 1, destination: '' })
      } else {
        setErrors({ submit: data.error || 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please check your connection and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Contact Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Send us a message</DialogTitle>

        {sent ? (
          <div className="text-emerald-600 mt-4">
            ✅ Your message has been sent!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Input
                placeholder="Your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Destination (e.g., Goa, Kerala, Himachal)"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
              )}
            </div>

            <div>
              <Input
                type="number"
                placeholder="Number of members"
                min="1"
                max="50"
                value={formData.members}
                onChange={(e) =>
                  setFormData({ ...formData, members: parseInt(e.target.value) || 1 })
                }
              />
              {errors.members && (
                <p className="text-red-500 text-sm mt-1">{errors.members}</p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Your message"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm mt-1">{errors.submit}</p>
            )}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
