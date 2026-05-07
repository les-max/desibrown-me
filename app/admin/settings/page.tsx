import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/AdminNav'
import { updateSubtitle } from '@/app/actions/settings'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('subtitle').single()
  const subtitle = data?.subtitle ?? ''

  async function handleSave(formData: FormData) {
    'use server'
    await updateSubtitle(formData.get('subtitle') as string)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-serif text-2xl text-foreground mb-8">Settings</h1>

        <form action={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="subtitle"
              className="block text-sm text-muted mb-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Home page subtitle
            </label>
            <textarea
              id="subtitle"
              name="subtitle"
              defaultValue={subtitle}
              rows={3}
              className="w-full border border-border rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:border-foreground transition-colors resize-none"
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder={'Notes and photos\nfrom my corner\nof the world.'}
            />
            <p className="text-xs text-muted mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
              Each line break becomes a new line on the home page.
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-foreground text-background text-sm rounded-sm hover:bg-accent transition-colors"
          >
            Save
          </button>
        </form>
      </main>
    </div>
  )
}
