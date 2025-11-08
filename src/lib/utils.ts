import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "EGP"): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} - ${formatTime(date)}`
}

export function getTimeSlots(startTime: string, endTime: string, duration: number): string[] {
  const slots: string[] = []
  const start = new Date(`2024-01-01T${startTime}`)
  const end = new Date(`2024-01-01T${endTime}`)
  
  while (start < end) {
    slots.push(start.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: false 
    }))
    start.setMinutes(start.getMinutes() + duration)
  }
  
  return slots
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(`2024-01-01T${startTime}`)
  const end = new Date(`2024-01-01T${endTime}`)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60) // Return hours
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const re = /^01[0125]\d{8}$/
  return re.test(phone)
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}