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

  const excerpt = post.body ? stripMarkdown(post.body).slice(0, 180) : null

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        {firstPhoto && (
          <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden">
            <Image
              src={getPhotoUrl(firstPhoto.storage_path)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <time
          className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-muted"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        <h2
          className="font-serif font-medium opsz-text text-xl mt-1.5 mb-2.5 leading-snug group-hover:text-accent transition-colors duration-200"
        >
          {post.title}
        </h2>

        {excerpt && (
          <p className="text-muted text-sm leading-relaxed">
            {excerpt}
            {post.body && post.body.length > 180 ? '…' : ''}
          </p>
        )}
      </Link>
    </article>
  )
}
