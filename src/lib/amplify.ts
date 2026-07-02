import { Amplify } from 'aws-amplify';

let configured = false;

export async function configureAmplify(): Promise<void> {
  if (configured) return;

  try {
    const outputs = await import('@/amplify_outputs.json');
    Amplify.configure(outputs.default, { ssr: true });
    configured = true;
  } catch {
    console.warn('amplify_outputs.json not found yet — run npx ampx sandbox first');
  }
}