import { WebrtcAuthenticateInterface } from '@application/interfaces/use-cases/authentication/WebrtcAuthenticateInterface'
import { WebrtcAuthenticate } from '@application/use-cases/authentication/WebrtcAuthenticate'
import { WebrtcSecretAdapter } from '@infra/cryptography/WebrtcSecretAdapter'
import env from '@main/config/env'

export const makeWebrtcAuthenticate = (): WebrtcAuthenticateInterface => {
  const webrtcAdapter = new WebrtcSecretAdapter(env.webrtcSecret)
  return new WebrtcAuthenticate(webrtcAdapter)
}