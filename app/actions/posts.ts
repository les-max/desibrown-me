'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = base
  let n = 0
  while (true) {
    let query = supabase.from('posts').select('id').eq('slug', slug)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query.maybeSingle()
    if (!data) return slug
    slug = `${base}-${++n}`
  }
}

type PhotoInput = {
  id?: string
  storage_path: string
  order_index: number
}

type PostInput = {
  title: string
  body: string
  published: boolean
  photos: PhotoInput[]
}

export async function createPost({ title, body, published, photos }: PostInput) {
  const supabase = await createClient()
  const slug = await uniqueSlug(supabase, toSlug(title))

  const { data: post, error } = await supabase
    .from('posts')
    .insert({ title, body, slug, published })
    .select('id')
    .single()

  if (error) throw error

  if (photos.length > 0) {
    await supabase.from('photos').insert(
      photos.map((p) => ({
        post_id: post.id,
        storage_path: p.storage_path,
        order_index: p.order_index,
      }))
    )
  }

  revalidatePath('/')
}

export async function updatePost(
  id: string,
  { title, body, published, photos }: PostInput
) {
  const supabase = await createClient()

  await supabase
    .from('posts')
    .update({ title, body, published, updated_at: new Date().toISOString() })
    .eq('id', id)

  // Delete photos that were removed
  const keptIds = photos.filter((p) => p.id).map((p) => p.id!)
  const { data: current } = await supabase
    .from('photos')
    .select('id')
    .eq('post_id', id)

  const toDelete = (current ?? [])
    .filter((p) => !keptIds.includes(p.id))
    .map((p) => p.id)

  if (toDelete.length > 0) {
    await supabase.from('photos').delete().in('id', toDelete)
  }

  // Update order of kept photos
  for (const photo of photos.filter((p) => p.id)) {
    await supabase
      .from('photos')
      .update({ order_index: photo.order_index })
      .eq('id', photo.id!)
  }

  // Insert new photos
  const newPhotos = photos.filter((p) => !p.id)
  if (newPhotos.length > 0) {
    await supabase.from('photos').insert(
      newPhotos.map((p) => ({
        post_id: id,
        storage_path: p.storage_path,
        order_index: p.order_index,
      }))
    )
  }

  revalidatePath('/')
  revalidatePath('/blog')
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  await supabase.from('posts').delete().eq('id', id)
  revalidatePath('/')
}
