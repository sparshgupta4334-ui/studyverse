'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

const PAGES = ['Home Hero', 'Features Section', 'Pricing Section', 'FAQ Section', 'About Page'];

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-white">Content Management</h1>

      <div className="flex gap-2 border-b border-gray-800">
        {['announcements', 'pages', 'faq'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="font-semibold text-white mb-4">Create Announcement</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Title</label>
                <input placeholder="Announcement title..." className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none text-sm focus:border-orange-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Message</label>
                <textarea rows={3} placeholder="Announcement message..." className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none text-sm resize-none focus:border-orange-500" />
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => toast.success('Announcement published!')}>
                Publish Announcement
              </Button>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="font-semibold text-white mb-3">Recent Announcements</h3>
            <div className="space-y-3">
              {['New PDF export feature launched', 'Scheduled maintenance on Feb 10', 'UPI payment tracking improved'].map((a) => (
                <div key={a} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-sm text-gray-300">{a}</span>
                  <button className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
          {PAGES.map((page) => (
            <div key={page} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-gray-300">{page}</span>
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800" onClick={() => toast.success(`Editing ${page}...`)}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <p className="text-gray-400 text-sm">FAQ management coming soon...</p>
        </div>
      )}
    </div>
  );
}
