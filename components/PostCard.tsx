import Link from 'next/link'
import Image from 'next/image'
import { getPhotoUrl } from '@/lib/supabase/storage'

type Post = {
  id: string
  title: string
  slug: string
  body: string | null
  created_at: string
  photos: { storage_path: string; order_index: number }[]
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .trim()
}

export default function PostCard({ post }: { post: Post }) {
  const firstPhoto = post.photos
    ?.slice()
    .sort((a, b) => a.order_index - b.order_index)[0]

  const excerpt = post.body ? stripMarkdown(post.body).slice(0, 160) : null

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        {firstPhoto && (
          <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-sm">
            <Image
              src={getPhotoUrl(firstPhoto.storage_path)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <time className="text-xs text-muted tracking-wide uppercase">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        <h2 className="font-serif text-2xl mt-1.5 mb-2 group-hover:text-accent transition-colors leading-snug">
          {post.title}
        </h2>

        {excerpt && (
          <p className="text-muted text-sm leading-relaxed">
            {excerpt}
            {post.body && post.body.length > 160 ? '…' : ''}
          </p>
        )}
      </Link>
    </article>
  )
}
