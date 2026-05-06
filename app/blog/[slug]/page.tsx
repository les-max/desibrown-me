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

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-muted hover:text-accent transition-colors duration-200 inline-block mb-12"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          ← Back
        </Link>

        <article>
          <header className="mb-10 pb-8 border-b border-border">
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
            <h1
              className="font-serif font-bold opsz-display mt-3 leading-tight text-foreground"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {post.title}
            </h1>
          </header>

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
        </article>
      </main>
    </>
  )
}
