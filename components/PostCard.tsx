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

  const date = new Date(post.created_at)
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const year = date.getFullYear()

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        {firstPhoto && (
          <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden">
            <Image
              src={getPhotoUrl(firstPhoto.storage_path)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="flex gap-5 items-start">
          {/* Margin annotation: day number + month/year */}
          <div className="w-9 shrink-0 select-none pt-0.5">
            <span
              className="font-serif font-light block leading-none opsz-text"
              style={{
                fontSize: '2.25rem',
                color: 'var(--border)',
                fontVariationSettings: "'opsz' 9, 'wght' 200",
              }}
            >
              {day}
            </span>
            <span
              className="block leading-tight mt-1"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: 'var(--muted)',
              }}
            >
              {month}
              <br />
              {year}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2
              className="font-serif font-semibold opsz-text leading-snug group-hover:text-accent transition-colors duration-200"
              style={{ fontSize: '1.3rem' }}
            >
              {post.title}
            </h2>
            {excerpt && (
              <p
                className="mt-2 leading-relaxed"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  color: 'var(--muted)',
                }}
              >
                {excerpt}
                {post.body && post.body.length > 180 ? '…' : ''}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
