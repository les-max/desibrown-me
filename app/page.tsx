import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import PostCard from '@/components/PostCard'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id, title, slug, body, created_at,
      photos(storage_path, order_index)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6">

        <header className="pt-16 pb-14 border-b border-border">
          <h1
            className="font-serif font-black opsz-display leading-none tracking-tight text-foreground"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', letterSpacing: '-0.02em' }}
          >
            Desi<br />Brown.
          </h1>
          <p
            className="mt-5 text-muted text-sm leading-relaxed max-w-xs"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Notes and photos from my corner of the world.
          </p>
        </header>

        {posts && posts.length > 0 ? (
          <div className="py-14 space-y-14">
            {posts.map((post, i) => (
              <div key={post.id}>
                <PostCard post={post} />
                {i < posts.length - 1 && (
                  <div className="mt-14 border-t border-border" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm py-14">Nothing here yet — check back soon.</p>
        )}
      </main>
    </>
  )
}
