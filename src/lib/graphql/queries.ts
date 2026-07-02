export const listBucketItems = /* GraphQL */ `
  query ListBucketItems {
    listBucketItems {
      items {
        id
        title
        description
        category
        isCompleted
        imageKey
        targetDate
        priority
        createdAt
        updatedAt
        owner
      }
    }
  }
`;

export const getBucketItem = /* GraphQL */ `
  query GetBucketItem($id: ID!) {
    getBucketItem(id: $id) {
      id
      title
      description
      category
      isCompleted
      imageKey
      targetDate
      priority
      createdAt
      updatedAt
      owner
    }
  }
`;