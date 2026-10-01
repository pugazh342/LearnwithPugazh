import './PageLoader.css'

interface PageLoaderProps {
  text?: string
}

export default function PageLoader({ text = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="page-loader-wrapper" role="status" aria-label="Loading">
      <div className="page-loader-inner">
        <div className="loader-spinner-ring">
          <div className="loader-pulse-circle" />
          <span className="loader-monogram">PK</span>
        </div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  )
}
