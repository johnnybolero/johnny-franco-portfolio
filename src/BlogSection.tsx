import { useEffect, useState } from 'react'

interface Post {
  title: string
  pubDate: string
  description: string
  link: string
  thumbnail: string
}

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://johnnyoappleseed.substack.com/feed&count=3'
    )
      .then(r => r.json())
      .then(data => {
        if (data.items) setPosts(data.items)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const stripHtml = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    const text = div.textContent || ''
    return text.length > 160 ? text.slice(0, 160) + '…' : text
  }

  return (
    <section className="blog" id="blog">
      <div className="blog__header">
        <span className="wordmark">WRITING</span>
        <a
          href="https://johnnyoappleseed.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="blog__view-all"
        >
          VIEW ALL →
        </a>
      </div>

      {loading ? (
        <div className="blog__loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="blog__loading">No posts yet — check back soon.</div>
      ) : (
        <div className="blog__grid">
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card"
            >
              {post.thumbnail && (
                <div className="blog-card__image-wrap">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="blog-card__image"
                  />
                </div>
              )}
              <div className="blog-card__body">
                <span className="blog-card__date">{formatDate(post.pubDate)}</span>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{stripHtml(post.description)}</p>
                <span className="blog-card__read">Read on Substack →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
