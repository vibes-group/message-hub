import {
  type ConnectedInstance,
  instanceManifestSchema,
} from '@/shared/types/instance'

export async function loadInstanceManifest(
  manifestUrl: string,
): Promise<ConnectedInstance> {
  const response = await fetch(manifestUrl, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Manifest request failed with ${response.status}`)
  }

  const manifest = instanceManifestSchema.parse(await response.json())

  return {
    ...manifest,
    manifestUrl,
    connectedAt: new Date().toISOString(),
  }
}
