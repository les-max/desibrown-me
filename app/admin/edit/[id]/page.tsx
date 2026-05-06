import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import PostEditor from '@/components/PostEditor'
import DeleteButton from '@/components/DeleteButton'

type Props = { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      id, title, body, published,
      photos(id, storage_path, order_index)
    `)
    .eq('id', id)
    .single()

  if (!post) notFound()

  const serialized = {
    id: post.id,
    title: post.title,
    body: post.body ?? '',
    published: post.published,
    photos: (post.photos ?? [])
      .slice()
      .sort((a, b) => a.order_index - b.order_index),
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <PostEditor post={serialized} />
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <DeleteButton postId={post.id} />
      </div>
    </div>
  )
}
