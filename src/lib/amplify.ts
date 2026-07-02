import { Amplify } from 'aws-amplify';

let configured = false;

export async function configureAmplify(): Promise<void> {
  if (configured) return;

  try {
    // Try src/ folder first (production), then root (local dev)
    let outputs;
    try {
      outputs = await import('@/amplify_outputs.json');
    } catch {
      outputs = await import('../../amplify_outputs.json');
    }
    Amplify.configure(outputs.default, { ssr: true });
    configured = true;
  } catch {
    console.warn('amplify_outputs.json not found');
  }
}