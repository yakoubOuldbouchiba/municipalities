// src/pages/Blog.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'primereact/card'

const Blog: React.FC = () => {
  const { t } = useTranslation()
  // Sample blog posts - in real app, fetch from API
  const posts = [
    { id: 1, title: t('navigation.news') + ' 1', excerpt: t('common.loading') },
    { id: 2, title: t('navigation.news') + ' 2', excerpt: t('common.loading') },
    { id: 3, title: t('navigation.news') + ' 3', excerpt: t('common.loading') },
  ]

  return (
    <div>
      <h2>{t('navigation.news')}</h2>
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
