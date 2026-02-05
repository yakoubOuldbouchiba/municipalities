// src/pages/Blog.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import PageLayout from '../components/layout/PageLayout'

const Blog: React.FC = () => {
  const { t } = useTranslation()
  // Sample blog posts - in real app, fetch from API
  const posts = [
    {
      id: 1,
      title: t('navigation.news') + ' 1',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: new Date().toLocaleDateString(),
      image: 'https://via.placeholder.com/400x200?text=News+1',
    },
    {
      id: 2,
      title: t('navigation.news') + ' 2',
      excerpt: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: new Date().toLocaleDateString(),
      image: 'https://via.placeholder.com/400x200?text=News+2',
    },
    {
      id: 3,
      title: t('navigation.news') + ' 3',
      excerpt: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      date: new Date().toLocaleDateString(),
      image: 'https://via.placeholder.com/400x200?text=News+3',
    },
  ]

  const cardTemplate = (post: any) => (
    <Card
      title={post.title}
      className="blog-card"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <img
        src={post.image}
        alt={post.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '8px' }}
      />
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
        📅 {post.date}
      </p>
      <p style={{ flex: 1, marginBottom: '1.5rem', color: '#64748b', lineHeight: '1.6' }}>{post.excerpt}</p>
      <Button
        label={t('common.readMore') || 'Read More'}
        icon="pi pi-arrow-right"
        className="p-button-outlined"
        style={{ width: '100%' }}
      />
    </Card>
  )

  return (
    <PageLayout>
      <div>
        <div className="p-grid">
          {posts.map(post => (
            <div key={post.id} className="p-col-12 p-md-6 p-lg-4" style={{ marginBottom: '2rem' }}>
              {cardTemplate(post)}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default Blog
