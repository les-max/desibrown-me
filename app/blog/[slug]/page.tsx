import { createClient } from '@/lib/supabase/server'
import { getPhotoUrl } from '@/lib/supabase/storage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('title, body')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return {}

  return {
    title: `${data.title} — Desi Brown`,
    description: data.body?.slice(0, 160) ?? undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      id, title, body, created_at,
      photos(id, storage_path, order_index)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const photos = (post.photos ?? [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index)

  const date = new Date(post.created_at)
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const year = date.getFullYear()

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="reveal" style={{ animationDelay: '0ms' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              display: 'inline-block',
              marginBottom: '3rem',
              transition: 'color 200ms ease-out',
              textDecoration: 'none',
            }}
            onMouseEnter={undefined}
            className="hover:text-accent"
          >
            ← Back
          </Link>
        </div>

        <article>
          {/* Header: margin-date + big title */}
          <header
            className="reveal mb-10 pb-10 border-b border-border flex gap-6 items-start"
            style={{ animationDelay: '60ms' }}
          >
            <div className="w-10 shrink-0 pt-1 select-none">
              <span
                className="font-serif font-light block leading-none opsz-text"
                style={{
                  fontSize: '2.5rem',
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
                {month}<br />{year}
              </span>
            </div>

            <h1
              className="font-serif font-bold opsz-display flex-1 text-foreground"
              style={{
                fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}
            >
              {post.title}
            </h1>
          </header>

          <div
            className="reveal"
            style={{ animationDelay: '120ms' }}
          >
            {post.body && (
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.body}
                </ReactMarkdown>
              </div>
            )}

            {photos.length > 0 && (
              <div
                className={`mt-12 grid gap-1.5 ${
                  photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}
              >
                {photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className={`relative overflow-hidden ${
                      photos.length === 1 ? 'aspect-[4/3]' : 'aspect-square'
                    }`}
                  >
                    <Image
                      src={getPhotoUrl(photo.storage_path)}
                      alt=""
                      fill
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </>
  )
}
