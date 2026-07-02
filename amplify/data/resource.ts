import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  BucketItem: a
    .model({
      title: a.string().required(),
      description: a.string(),
      category: a.enum([
        'TRAVEL',
        'ADVENTURE',
        'LEARNING',
        'FOOD',
        'FITNESS',
        'CREATIVE',
        'OTHER',
      ]),
      isCompleted: a.boolean().default(false),
      imageKey: a.string(),      // S3 image key (Phase 5)
      targetDate: a.string(),    // optional target date
      priority: a.enum(['LOW', 'MEDIUM', 'HIGH']),
    })
    .authorization((allow) => [
      allow.owner(),             // only the owner can CRUD their own items
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // uses Cognito auth
  },
});