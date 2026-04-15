import { useState, useEffect } from 'react'

/**
 * Fetches and returns SVG content for inline rendering.
 * Returns null for non-SVG URLs or if fetch fails.
 * NavBar falls back to <img> or text if null.
 */
export function useLogo(logoUrl) {
  const [svgContent, setSvgContent] = useState(null)

  useEffect(() => {
    if (!logoUrl || !logoUrl.endsWith('.svg')) return

    fetch(logoUrl)
      .then(r => r.text())
      .then(setSvgContent)
      .catch(() => setSvgContent(null))
  }, [logoUrl])

  return svgContent
}
