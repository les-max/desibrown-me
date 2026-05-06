'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/app/actions/posts'

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await deletePost(postId)
    router.push('/admin')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Are you sure?</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-muted hover:text-red-600 transition-colors"
    >
      Delete post
    </button>
  )
}
