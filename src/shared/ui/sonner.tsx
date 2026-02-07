"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // useTheme will work if ThemeProvider exists, otherwise we'll handle gracefully
  const themeContext = useTheme()
  const theme = (themeContext?.theme || "system") as ToasterProps["theme"]

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      dir="rtl"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600" />,
        info: <InfoIcon className="size-5 text-sky-600" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-800 dark:group-[.toaster]:text-slate-100 group-[.toaster]:border-border group-[.toaster]:shadow-xl font-sans rounded-xl border",
          description: "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400 font-medium",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",

          error: "group-[.toast]:border-r-4 group-[.toast]:border-r-red-500 group-[.toast]:bg-red-50/10",
          success: "group-[.toast]:border-r-4 group-[.toast]:border-r-emerald-500 group-[.toast]:bg-emerald-50/10",
          warning: "group-[.toast]:border-r-4 group-[.toast]:border-r-amber-500 group-[.toast]:bg-amber-50/10",
          info: "group-[.toast]:border-r-4 group-[.toast]:border-r-sky-500 group-[.toast]:bg-sky-50/10",
        },
        style: {
          fontFamily: 'var(--font-cairo)',
          fontSize: '0.95rem',
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
