import { useEffect } from 'react'

interface SEOData {
  title: string
  description: string
  keywords?: string
  url?: string
  image?: string
  type?: string
}

const SITE_NAME = 'LearnwithPugazh'
const DEFAULT_URL = 'https://learnwithpugazh.vercel.app'
const DEFAULT_IMAGE = '/profile.jpeg'

export function useSEO({
  title,
  description,
  keywords,
  url = DEFAULT_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOData) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

    document.title = fullTitle

    const setMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attribute, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)

    // Open Graph
    setMeta('og:type', type, 'property')
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')

    // Twitter
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, keywords, url, image, type])
}
