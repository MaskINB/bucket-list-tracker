export const createBucketItem = /* GraphQL */ `
  mutation CreateBucketItem($input: CreateBucketItemInput!) {
    createBucketItem(input: $input) {
      id
      title
      description
      category
      isCompleted
      imageKey
      targetDate
      priority
      createdAt
    }
  }
`;

export const updateBucketItem = /* GraphQL */ `
  mutation UpdateBucketItem($input: UpdateBucketItemInput!) {
    updateBucketItem(input: $input) {
      id
      title
      description
      category
      isCompleted
      imageKey
      targetDate
      priority
      updatedAt
    }
  }
`;

export const deleteBucketItem = /* GraphQL */ `
  mutation DeleteBucketItem($input: DeleteBucketItemInput!) {
    deleteBucketItem(input: $input) {
      id
    }
  }
`;