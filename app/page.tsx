import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [{ data: posts }, { data: settings }] = await Promise.all([
    supabase
      .from('posts')
      .select(`
        id, title, slug, body, created_at,
        photos(storage_path, order_index)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false }),
    supabase.from('site_settings').select('subtitle').single(),
  ])

  const subtitleLines = (settings?.subtitle ?? '').split('\n')

  return (
    <main className="max-w-2xl mx-auto px-6">

        {/* Header: title left, tagline right — tension on purpose */}
        <header
          className="reveal pt-16 pb-14 border-b border-border flex items-end justify-between gap-8"
          style={{ animationDelay: '0ms' }}
        >
          <h1
            className="font-serif font-black opsz-display text-foreground leading-none shrink-0"
            style={{
              fontSize: 'clamp(4rem, 12vw, 7.5rem)',
              letterSpacing: '-0.03em',
              lineHeight: 0.88,
            }}
          >
            Desi<br />Brown.
          </h1>

          <p
            className="text-right text-muted shrink-0 pb-1"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              maxWidth: '16ch',
            }}
          >
            {subtitleLines.map((line: string, i: number) => (
              <span key={i}>{line}{i < subtitleLines.length - 1 && <br />}</span>
            ))}
          </p>
        </header>

        {posts && posts.length > 0 ? (
          <div className="py-14 space-y-14">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="reveal"
                style={{ animationDelay: `${80 + i * 70}ms` }}
              >
                <PostCard post={post} />
                {i < posts.length - 1 && (
                  <div className="mt-14 border-t border-border" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p
            className="reveal py-14"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--muted)',
              animationDelay: '80ms',
            }}
          >
            Nothing here yet — check back soon.
          </p>
        )}
    </main>
  )
}
