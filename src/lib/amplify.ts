import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';

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

export async function safeSignOut(): Promise<void> {
  try {
    await signOut({ global: true });
  } catch {
    // clear manually if signOut fails
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
}