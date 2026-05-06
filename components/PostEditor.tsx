'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getPhotoUrl } from '@/lib/supabase/storage'
import { createPost, updatePost } from '@/app/actions/posts'

type ExistingPhoto = {
  id: string
  storage_path: string
  order_index: number
}

type NewPhoto = {
  file: File
  preview: string
}

type Post = {
  id: string
  title: string
  body: string
  published: boolean
  photos: ExistingPhoto[]
}

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>(
    post?.photos ?? []
  )
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const photos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewPhotos((prev) => [...prev, ...photos])
    e.target.value = ''
  }

  function removeNewPhoto(index: number) {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingPhoto(id: string) {
    setExistingPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleSave(published: boolean) {
    if (!title.trim()) {
      setError('Give this post a title.')
      return
    }
    setSaving(true)
    setError('')

    try {
      // Upload new photos to Supabase Storage
      const uploadedPaths: string[] = []
      for (const photo of newPhotos) {
        const ext = photo.file.name.split('.').pop() ?? 'jpg'
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('post-photos')
          .upload(path, photo.file)
        if (uploadError) throw uploadError
        uploadedPaths.push(path)
      }

      const photos = [
        ...existingPhotos.map((p, i) => ({
          id: p.id,
          storage_path: p.storage_path,
          order_index: i,
        })),
        ...uploadedPaths.map((path, i) => ({
          storage_path: path,
          order_index: existingPhotos.length + i,
        })),
      ]

      if (post) {
        await updatePost(post.id, { title, body, published, photos })
      } else {
        await createPost({ title, body, published, photos })
      }

      router.push('/admin')
      router.refresh()
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const totalPhotos = existingPhotos.length + newPhotos.length

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-5">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-[1.75rem] leading-tight font-serif bg-transparent border-none outline-none placeholder:text-muted text-foreground"
        />

        <div className="w-8 border-t border-border" />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows={16}
          className="w-full bg-transparent border-none outline-none resize-none text-base leading-relaxed placeholder:text-muted text-foreground"
        />

        {/* Photo grid */}
        {totalPhotos > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group">
                <Image
                  src={getPhotoUrl(photo.storage_path)}
                  alt=""
                  fill
                  className="object-cover rounded-sm"
                />
                <button
                  onClick={() => removeExistingPhoto(photo.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            {newPhotos.map((photo, i) => (
              <div key={i} className="relative aspect-square group">
                <Image
                  src={photo.preview}
                  alt=""
                  fill
                  className="object-cover rounded-sm"
                />
                <button
                  onClick={() => removeNewPhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-5 space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              + Add photos
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 py-3 border border-border rounded-sm text-sm text-foreground hover:border-foreground transition-colors disabled:opacity-40"
            >
              Save draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex-1 py-3 bg-foreground text-background rounded-sm text-sm hover:bg-accent transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving…' : post?.published ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
