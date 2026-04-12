import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/sample-data';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog &amp; News</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Business tips, feature updates, and success stories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-700 card-hover block">
              <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-5xl">
                📰
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">{post.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
