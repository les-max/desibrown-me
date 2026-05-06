import AdminNav from '@/components/AdminNav'
import PostEditor from '@/components/PostEditor'

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <PostEditor />
    </div>
  )
}
