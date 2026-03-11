'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { IconTrash, IconLoader2 } from '@tabler/icons-react'
import { deleteProfile } from '@/app/actions/profiles.action'

interface DeleteProfileButtonProps {
  profileId: string
  profileName: string
}

export function DeleteProfileButton({ profileId, profileName }: DeleteProfileButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  async function handleDelete() {
    if (confirmName !== profileName) return
    
    setIsLoading(true)
    const result = await deleteProfile(profileId)
    
    if (result.error) {
      setIsLoading(false)
      alert(result.error)
    } else {
      router.push('/dashboard/profiles')
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
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All prescriptions and medical records associated with this profile will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
            <p className="font-medium text-destructive">Warning</p>
            <p className="text-muted-foreground mt-1">
              You are about to delete the profile for <strong>{profileName}</strong> and all associated medical records.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmName">
              Type <strong>{profileName}</strong> to confirm
            </Label>
            <Input
              id="confirmName"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={profileName}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={confirmName !== profileName || isLoading}
          >
            {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
