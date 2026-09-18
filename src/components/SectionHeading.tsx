import './SectionHeading.css'

interface SectionHeadingProps {
  index?: string
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${align === 'center' ? 'is-center' : ''}`}>
      <div className="heading-tag">
        {index && <span className="heading-index">{index}</span>}
        <span className="heading-eyebrow">{eyebrow}</span>
      </div>
      <h2 className="section-title serif">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}
