import { WebRtcTransport, Router, WebRtcTransportOptions, AppData } from 'mediasoup/node/lib/types'

const transportOptions: WebRtcTransportOptions<AppData> = {
  listenIps: [
    { ip: '0.0.0.0', announcedIp: process.env.ANNOUNCED_IP || '202.10.34.67' } // Replace with public IP
    // {
    //   ip: '0.0.0.0',
    //   protocol: 'udp',
    //   announcedAddress: process.env.ANNOUNCED_IP || '202.10.34.67',
    // },
    // {
    //   ip: '0.0.0.0',
    //   protocol: 'tcp',
    //   announcedAddress: process.env.ANNOUNCED_IP || '202.10.34.67',
    // }
  ],
  enableUdp: true,
  enableTcp: true,
  preferUdp: true,
  
}

export async function createWebRtcTransport(router: Router): Promise<WebRtcTransport> {
  const transport = await router.createWebRtcTransport(transportOptions)

  transport.on('dtlsstatechange', dtlsState => {
    if (dtlsState === 'closed') {
      console.log('Transport closed due to DTLS state "closed"')
      transport.close()
    }
  })

  transport.on('routerclose', () => {
    console.log('Transport closed')
  })

  console.log(`WebRTC Transport created: ${transport.id}`)

  return transport
}
