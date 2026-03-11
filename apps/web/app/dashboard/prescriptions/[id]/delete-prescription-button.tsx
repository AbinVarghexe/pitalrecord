'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePrescription } from '@/app/actions/prescriptions.action'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { IconTrash, IconLoader2 } from '@tabler/icons-react'

interface DeletePrescriptionButtonProps {
  prescriptionId: string
}

export function DeletePrescriptionButton({ prescriptionId }: DeletePrescriptionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    const result = await deletePrescription(prescriptionId)
    
    if (result.error) {
      setIsLoading(false)
      alert(result.error)
    } else {
      router.push('/dashboard/prescriptions')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Prescription</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this prescription? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
          <p className="font-medium text-destructive">Warning</p>
          <p className="text-muted-foreground mt-1">
            This will permanently delete the prescription and all associated medicine records.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
