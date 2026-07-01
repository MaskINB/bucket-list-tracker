import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,        // users login with email
  },
  userAttributes: {
    givenName: {
      required: true,   // ask for first name on signup
      mutable: true,
    },
    familyName: {
      required: true,   // ask for last name on signup
      mutable: true,
    },
  },
});