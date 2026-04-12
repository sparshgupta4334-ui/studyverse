import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogPosts } from '@/lib/sample-data';

export function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug) || blogPosts[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        <div className="mb-4">
          <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
        </div>
        <div className="h-60 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center text-8xl mb-8">
          📰
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">{post.excerpt}</p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            Managing a small business in India comes with unique challenges. From tracking customer credit to managing seasonal cash flows,
            every business owner faces these day-to-day struggles. Gupta Paper Stores has been at the forefront of helping businesses go digital.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Whether you are running a kirana store, wholesale business, or service provider, the principles of good financial management
            remain the same. Keep accurate records, follow up on payments, and generate regular reports for decision making.
          </p>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <Link href="/blog" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">← All Posts</Link>
          <Link href="/dashboard" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all">Try Dashboard →</Link>
        </div>
      </div>
    </div>
  );
}
