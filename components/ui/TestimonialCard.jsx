export default function TestimonialCard({ testimonial }) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-emerald-100 rounded-xl p-6 shadow-md flex flex-col justify-between h-full">
        <p className="text-gray-800 italic text-sm leading-relaxed">
          “{testimonial.quote}”
        </p>
        <p className="text-xs text-right text-emerald-700 mt-4 font-medium">
           - {testimonial.name}
        </p>
      </div>
    )
  }
  