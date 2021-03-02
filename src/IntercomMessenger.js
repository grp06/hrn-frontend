import React, { useEffect } from 'react'
import { useIntercom } from 'react-use-intercom'
import { constants } from './utils'
import './intercom.css'

const IntercomMessenger = () => {
  const { intercomAppId } = constants
  const { boot } = useIntercom()

  useEffect(() => {
    boot({ customAttributes: { custom_launcher_selector: '.intercom-launcher' } })
    const launcher = document.querySelector('.intercom-launcher')

    if (launcher) {
      const timeout = setTimeout(() => clearInterval(interval), 30000)
      const interval = setInterval(() => {
        if (window.Intercom.booted) {
          const unreadCount = launcher.querySelector('.intercom-unread-count')

          window.Intercom('onShow', () => {
            launcher.classList.add('intercom-open')
          })

          window.Intercom('onHide', () => {
            launcher.classList.remove('intercom-open')
          })

          window.Intercom('onUnreadCountChange', (count) => {
            unreadCount.textContent = count

            if (count) {
              unreadCount.classList.add('active')
            } else {
              unreadCount.classList.remove('active')
            }
          })

          launcher.classList.add('intercom-booted')
          clearInterval(interval)
          clearTimeout(timeout)
        }
      })
    }
  }, [boot])

  return (
    <a className="intercom-launcher" href={`mailto:${intercomAppId}@incoming.intercom.io`}>
      <div className="intercom-icon-close" />
      <div className="intercom-icon-open" />
      <div className="intercom-unread-count" />
    </a>
  )
}

export default IntercomMessenger
