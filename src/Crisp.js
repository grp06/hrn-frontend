import React, { useEffect } from 'react'
import { constants } from './utils'

const Crisp = () => {
  const { crispWebsiteId } = constants

  useEffect(() => {
    window.$crisp = []
    window.CRISP_WEBSITE_ID = crispWebsiteId
    ;(function () {
      var d = document
      var s = d.createElement('script')

      s.src = 'https://client.crisp.chat/l.js'
      s.async = 1
      d.getElementsByTagName('head')[0].appendChild(s)
    })()
  }, [])

  return null
}

export default Crisp
