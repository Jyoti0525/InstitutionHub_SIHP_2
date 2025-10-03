import { LucideIcon } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-bg-secondary dark:bg-neutral-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-text-muted dark:text-neutral-500" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-text-primary dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
