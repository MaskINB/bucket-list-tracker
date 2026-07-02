import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'bucketListStorage',
  isDefault: true,
  access: (allow) => ({
    'bucket-items/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'public/*': [
      allow.authenticated.to(['read', 'write']),
    ],
  }),
});