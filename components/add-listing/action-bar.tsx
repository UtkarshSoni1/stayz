"use client"

import { Loader2, Save, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionBarProps {
  isLoading: boolean
  onSaveDraft: () => void
  onPublish: () => void
}

export function ActionBar({ isLoading, onSaveDraft, onPublish }: ActionBarProps) {
  return (
    <div className="sticky bottom-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Left - Draft */}
          <Button
            id="save-draft-btn"
            type="button"
            variant="outline"
            size="lg"
            disabled={isLoading}
            onClick={onSaveDraft}
            className="w-full sm:w-auto gap-2 border-border/60 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 h-11 px-5 rounded-xl transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save as Draft
          </Button>

          {/* Right - Publish */}
          <Button
            id="publish-listing-btn"
            type="button"
            size="lg"
            disabled={isLoading}
            onClick={onPublish}
            className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-px active:translate-y-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            Publish Listing
          </Button>
        </div>
      </div>
    </div>
  )
}
