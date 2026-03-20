type EmbeddedPageFrameProps = {
  src: string
  title: string
}

export function EmbeddedPageFrame({ src, title }: EmbeddedPageFrameProps) {
  return (
    <main className="clone-shell">
      <iframe className="clone-frame" loading="lazy" src={src} title={title} />
    </main>
  )
}
