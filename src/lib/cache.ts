import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

// When posts are created/updated/deleted
export function invalidatePostCaches(userId: number) {
  cache.del('all_posts');
  cache.del(`profile_${userId}`);
}

// When users are modified
export function invalidateUserCaches(userId: number) {
  cache.del('all_users');
  cache.del(`profile_${userId}`);
}
