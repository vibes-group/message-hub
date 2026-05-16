import { z } from 'zod'

export const instanceManifestSchema = z.object({
  schemaVersion: z.literal(1),
  provider: z.literal('supabase'),
  name: z.string().min(1).max(80),
  supabaseUrl: z.url(),
  supabaseAnonKey: z.string().min(20),
  functionsUrl: z.url().optional(),
  vapidPublicKey: z.string().min(20).optional(),
  supportUrl: z.url().optional(),
})

export type InstanceManifest = z.infer<typeof instanceManifestSchema>

export type ConnectedInstance = InstanceManifest & {
  manifestUrl: string
  connectedAt: string
}
