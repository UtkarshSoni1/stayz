"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Copy,
  CheckCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MyListing } from "./types";

interface ListingActionsProps {
  listing: MyListing;
  onDuplicate: (id: string) => void;
  onMarkRented: (id: string) => void;
  onMarkAvailable: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ListingActions({
  listing,
  onDuplicate,
  onMarkRented,
  onMarkAvailable,
  onDelete,
}: ListingActionsProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleDelete() {
    setDeleting(true);
    setTimeout(() => {
      onDelete(listing.id);
      setDeleting(false);
      setDeleteOpen(false);
    }, 600);
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1">
        {/* View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
              onClick={() => router.push(`/listings/${listing.id}`)}
              aria-label="View listing"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">View</TooltipContent>
        </Tooltip>

        {/* Edit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
              onClick={() => router.push(`/add-listing?edit=${listing.id}`)}
              aria-label="Edit listing"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Edit</TooltipContent>
        </Tooltip>

        {/* Duplicate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
              onClick={() => onDuplicate(listing.id)}
              aria-label="Duplicate listing"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Duplicate</TooltipContent>
        </Tooltip>

        {/* Mark as Rented / Mark as Available — mutually exclusive */}
        {listing.status !== "RENTED" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => onMarkRented(listing.id)}
                aria-label="Mark as rented"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Mark as Rented</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10"
                onClick={() => onMarkAvailable(listing.id)}
                aria-label="Mark as available"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Mark as Available</TooltipContent>
          </Tooltip>
        )}

        {/* Delete */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                  aria-label="Delete listing"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">Delete</TooltipContent>
          </Tooltip>

          <DialogContent className="border-white/10 bg-[#111] sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground">
                Delete listing?
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  &ldquo;{listing.title}&rdquo;
                </span>{" "}
                will be permanently removed. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="border-white/10"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
