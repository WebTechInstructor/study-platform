import { useState, useEffect } from 'react'
export function useLogo(logoUrl) {
  const [svgContent, setSvgContent] = useState(null)
  useEffect(() => {
    if (!logoUrl || !logoUrl.endsWith('.svg')) return
    fetch(logoUrl).then(r => r.text()).then(setSvgContent).catch(() => setSvgContent(null))
  }, [logoUrl])
  return svgContent
}
