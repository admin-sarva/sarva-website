'use client'

import { Button } from '../../@/components/ui/button'

export default function PropagationGuide({
  enabled,
  onToggle,
  title,
  steps,
  suggestions = [],
  onJump,
}) {
  const currentIndex = steps.findIndex(step => !step.done)
  const activeIndex = currentIndex === -1 ? steps.length - 1 : currentIndex
  const activeStep = steps[activeIndex]
  const completed = steps.filter(step => step.done).length

  if (!enabled) {
    return (
      <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">Guided propagation is paused.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => onToggle(true)}>
          Turn on
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800">
              {completed}/{steps.length} done
            </span>
          </div>
          <p className="mt-1 text-sm">
            Next: {activeStep?.next || 'Review the page and publish when everything looks right.'}
          </p>
        </div>
        <div className="flex gap-2">
          {activeStep?.targetId && (
            <Button type="button" variant="secondary" onClick={() => onJump(activeStep.targetId)}>
              Go to next step
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onToggle(false)}>
            Turn off
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {steps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            onClick={() => step.targetId && onJump(step.targetId)}
            className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${
              index === activeIndex
                ? 'border-emerald-500 bg-white text-emerald-950'
                : step.done
                  ? 'border-emerald-100 bg-emerald-100/70 text-emerald-900'
                  : 'border-emerald-100 bg-white/70 text-gray-700'
            }`}
          >
            <span>{index + 1}. {step.label}</span>
            <span className="text-xs font-medium">{step.done ? 'Done' : index === activeIndex ? 'Now' : 'Pending'}</span>
          </button>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Quick selections</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.group}-${suggestion.value}`}
                type="button"
                onClick={suggestion.onSelect}
                className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 hover:border-emerald-500"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
