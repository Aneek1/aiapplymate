import * as React from "react"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100'
  }
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-6'
  }
  
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
