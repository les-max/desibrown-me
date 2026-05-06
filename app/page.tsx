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
      <main className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h1 className="font-serif text-5xl text-foreground mb-3 leading-tight">
            Desi Brown
          </h1>
          <p className="text-muted">Notes and photos from my corner of the world.</p>
        </header>

        {posts && posts.length > 0 ? (
          <div className="space-y-14">
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
          <p className="text-muted">Nothing here yet — check back soon.</p>
        )}
      </main>
    </>
  )
}
