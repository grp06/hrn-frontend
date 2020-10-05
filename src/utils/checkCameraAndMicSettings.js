const checkCameraAndMicSettings = async () => {
  console.log('checkCameraAndMicSettings getting called')
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevicesx
    navigator.enumerateDevices = function (callback) {
      navigator.mediaDevices.enumerateDevices().then(callback)
    }
  }

  let MediaDevices = []
  const isHTTPs = window.location.protocol === 'https:'
  let canEnumerate = false

  if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
    canEnumerate = true
  } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
    canEnumerate = true
  }

  let hasMicrophone = false
  let hasSpeakers = false
  let hasWebcam = false

  let isMicrophoneAlreadyCaptured = false
  let isWebcamAlreadyCaptured = false

  function checkDeviceSupport(callback) {
    if (!canEnumerate) {
      return
    }

    if (
      !navigator.enumerateDevices &&
      window.MediaStreamTrack &&
      window.MediaStreamTrack.getSources
    ) {
      navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack)
    }

    if (!navigator.enumerateDevices && navigator.enumerateDevices) {
      navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator)
    }

    if (!navigator.enumerateDevices) {
      if (callback) {
        callback()
      }
      return
    }

    MediaDevices = []
    navigator.enumerateDevices(function (devices) {
      devices.forEach(function (_device) {
        const device = {}
        for (const d in _device) {
          device[d] = _device[d]
        }

        if (device.kind === 'audio') {
          device.kind = 'audioinput'
        }

        if (device.kind === 'video') {
          device.kind = 'videoinput'
        }

        let skip
        MediaDevices.forEach(function (d) {
          if (d.id === device.id && d.kind === device.kind) {
            skip = true
          }
        })

        if (skip) {
          return
        }

        if (!device.deviceId) {
          device.deviceId = device.id
        }

        if (!device.id) {
          device.id = device.deviceId
        }

        if (!device.label) {
          device.label = 'Please invoke getUserMedia once.'
          if (!isHTTPs) {
            device.label = `HTTPs is required to get label of this ${device.kind} device.`
          }
        } else {
          if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
            isWebcamAlreadyCaptured = true
          }

          if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
            isMicrophoneAlreadyCaptured = true
          }
        }

        if (device.kind === 'audioinput') {
          hasMicrophone = true
        }

        if (device.kind === 'audiooutput') {
          hasSpeakers = true
        }

        if (device.kind === 'videoinput') {
          console.log('are we checking for webcam or notyoooo')
          hasWebcam = true
        }

        // there is no 'videoouput' in the spec.

        MediaDevices.push(device)
      })

      if (callback) {
        callback()
      }
    })
  }

  await checkDeviceSupport()

  const permissionsObj = {
    hasWebcam,
    hasMicrophone,
    isMicrophoneAlreadyCaptured,
    isWebcamAlreadyCaptured,
  }
  console.log('permissionsObj from check camera= ', permissionsObj)
  return permissionsObj
}

export default checkCameraAndMicSettings
