"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "destructive" | "warning"
  loading?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/[0.08] text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className={
                variant === "destructive"
                  ? "flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10"
                  : "flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10"
              }
            >
              <AlertTriangle
                className={
                  variant === "destructive"
                    ? "h-4 w-4 text-red-400"
                    : "h-4 w-4 text-orange-400"
                }
              />
            </div>
            <DialogTitle className="text-white">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-white/50 pl-12">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "outline"}
            className={
              variant === "destructive"
                ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                : "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20"
            }
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
