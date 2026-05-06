import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center">
        <Link
          href="/"
          className="font-serif text-xl font-medium opsz-text text-foreground hover:text-accent transition-colors duration-200"
        >
          Desi Brown
        </Link>
      </div>
    </nav>
  )
}
