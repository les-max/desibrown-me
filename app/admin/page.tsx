import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, published, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl text-foreground">Posts</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/settings"
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Settings
            </Link>
            <Link
              href="/admin/new"
              className="px-4 py-2 bg-foreground text-background text-sm rounded-sm hover:bg-accent transition-colors"
            >
              New post
            </Link>
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/edit/${post.id}`}
                className="flex items-center justify-between py-3.5 border-b border-border hover:text-accent transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm truncate">{post.title}</span>
                  <span className="text-xs text-muted shrink-0">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-4 ${
                    post.published
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {post.published ? 'live' : 'draft'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm py-8 text-center">
            No posts yet.{' '}
            <Link href="/admin/new" className="text-accent hover:underline">
              Write your first one.
            </Link>
          </p>
        )}
      </main>
    </div>
  )
}
