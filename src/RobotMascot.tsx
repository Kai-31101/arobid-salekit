import { useEffect, useState } from 'react'
import { useLanguage } from './i18n'

// The built ARO AI Assistant page (same route the Partner sidebar uses).
const ARO_PATH = '/partner/aro'

/**
 * Floating Arobid mascot pinned to the bottom-right corner, and a shortcut into
 * the ARO AI Assistant page.
 *
 * The character comes from the supplied 3D render rather than CSS geometry. It
 * always faces front; the raised hand waves by drawing the same image twice and
 * splitting it with clip-path — body on one layer, raised arm on another that
 * rotates about the shoulder. The source PNG was 2500px and ~9MB; this one is
 * auto-cropped to the character and re-encoded to WebP at ~15KB.
 *
 * The art is decorative (aria-hidden); the hit pad on top of it is the real
 * control, so keyboard users get a focusable button with a label naming what
 * the click does. Hidden inside the demo iframe, matching LanguageFab: the
 * parent page already renders its own mascot, and a second one inside every
 * cloned screen would follow the user around the guided journey.
 */
export default function RobotMascot() {
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top
  const { lang } = useLanguage()
  const [awake, setAwake] = useState(false)

  // Hold the mascot back until the page has settled so it fades in after the
  // content instead of competing with it on first paint.
  useEffect(() => {
    const t = window.setTimeout(() => setAwake(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  if (isEmbedded) return null

  // The bubble greets; the button's accessible name states what clicking does.
  const greeting = lang === 'vi' ? 'Xin chào, tôi là Trợ lý AI của bạn' : "Hello, I'm your AI Assistant"
  const action = lang === 'vi' ? 'Mở Trợ lý ARO AI' : 'Open ARO AI Assistant'

  // Same navigation the Partner sidebar uses: pushState plus a synthetic
  // popstate so the App root, which owns the pathname state, re-renders.
  const openAroAi = () => {
    window.history.pushState({}, '', ARO_PATH)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className={`mascot${awake ? ' awake' : ''}`} data-no-i18n>
      <div className="mascot-bot" aria-hidden="true">
        <img className="mascot-view mascot-body-img" src="/mascot-front.webp" alt="" width={118} height={96} />
        <img className="mascot-view mascot-arm-img" src="/mascot-front.webp" alt="" width={118} height={96} />
      </div>
      <button type="button" className="mascot-hit" onClick={openAroAi} aria-label={action} />
      <p className="mascot-bubble" aria-hidden="true">{greeting}</p>
      <div className="mascot-shadow" aria-hidden="true" />
    </div>
  )
}
