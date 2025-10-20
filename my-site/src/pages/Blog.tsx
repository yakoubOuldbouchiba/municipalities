// src/pages/Blog.tsx
import React from 'react'
import { Card } from 'primereact/card'

const Blog: React.FC = () => {
  // مؤقتاً نعرض محتوى ثابت (Static)
  const posts = [
    { id: 1, title: 'مقال 1', excerpt: 'مقتطف من المقال...' },
    { id: 2, title: 'مقال 2', excerpt: 'مقتطف من المقال...' },
    { id: 3, title: 'مقال 3', excerpt: 'مقتطف من المقال...' },
  ]

  return (
    <div>
      <h2>المدونة</h2>
      <div className="p-grid">
        {posts.map(p => (
          <div key={p.id} className="p-col-12 p-md-4">
            <Card title={p.title}>
              <p>{p.excerpt}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blog
