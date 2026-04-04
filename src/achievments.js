export const LAUNCH_DATE = '2026-03-28';

export const RARITY_COLORS = {
  common: '#78736d',
  rare:   '#378ADD',
  epic:   '#7F77DD',
  legend: '#EF9F27',
  dev:    '#5DCAA5',
};

export const ACHIEVEMENTS = [
  {
    id: 'dev',
    name: 'dev',
    desc: 'built this thing',
    rarity: 'dev',
    spriteId: 'ach-dev',
    check: ({ isDev }) => isDev === true,
  },
  { id: 'first_post',     name: 'first post',     desc: 'published your first config',  rarity: 'common', spriteId: 'ach-first_post',     check: ({ postCount })      => postCount >= 1 },
  { id: 'posts_5',        name: 'getting started', desc: '5 posts published',            rarity: 'common', spriteId: 'ach-posts_5',        check: ({ postCount })      => postCount >= 5 },
  { id: 'posts_25',       name: 'prolific',        desc: '25 posts published',           rarity: 'rare',   spriteId: 'ach-posts_25',       check: ({ postCount })      => postCount >= 25 },
  { id: 'posts_100',      name: 'centurion',       desc: '100 posts published',          rarity: 'epic',   spriteId: 'ach-posts_100',      check: ({ postCount })      => postCount >= 100 },
  { id: 'first_follower', name: 'first follower',  desc: 'someone followed you',         rarity: 'common', spriteId: 'ach-first_follower', check: ({ followerCount })  => followerCount >= 1 },
  { id: 'followers_10',   name: 'rising star',     desc: '10 followers',                 rarity: 'common', spriteId: 'ach-followers_10',   check: ({ followerCount })  => followerCount >= 10 },
  { id: 'followers_50',   name: 'popular',         desc: '50 followers',                 rarity: 'rare',   spriteId: 'ach-followers_50',   check: ({ followerCount })  => followerCount >= 50 },
  { id: 'followers_100',  name: 'influencer',      desc: '100 followers',                rarity: 'epic',   spriteId: 'ach-followers_100',  check: ({ followerCount })  => followerCount >= 100 },
  { id: 'followers_500',  name: 'legend',          desc: '500 followers',                rarity: 'legend', spriteId: 'ach-followers_500',  check: ({ followerCount })  => followerCount >= 500 },
  { id: 'liked_10',       name: 'liked',           desc: '10 likes received',            rarity: 'common', spriteId: 'ach-liked_10',       check: ({ likesReceived })  => likesReceived >= 10 },
  { id: 'liked_100',      name: 'crowd pleaser',   desc: '100 likes received',           rarity: 'rare',   spriteId: 'ach-liked_100',      check: ({ likesReceived })  => likesReceived >= 100 },
  { id: 'liked_500',      name: 'on fire',         desc: '500 likes received',           rarity: 'epic',   spriteId: 'ach-liked_500',      check: ({ likesReceived })  => likesReceived >= 500 },
  { id: 'curator',        name: 'curator',         desc: 'liked 10 posts',               rarity: 'common', spriteId: 'ach-curator',        check: ({ likedCount })     => likedCount >= 10 },
  { id: 'community',      name: 'community',       desc: 'following 10+ people',         rarity: 'common', spriteId: 'ach-community',      check: ({ followingCount }) => followingCount >= 10 },
  { id: 'early_adopter',  name: 'early adopter',   desc: 'joined in the first 60 days',  rarity: 'rare',   spriteId: 'ach-early_adopter',  check: ({ joinedAt }) => (Date.now() - new Date(joinedAt)) / 86400000 <= 60 },
  { id: 'veteran',        name: 'veteran',         desc: 'been here over a year',        rarity: 'rare',   spriteId: 'ach-veteran',        check: ({ joinedAt }) => (Date.now() - new Date(joinedAt)) / 86400000 >= 365 },
  { id: 'power_user',     name: 'power user',      desc: 'posted, liked, and followed',  rarity: 'rare',   spriteId: 'ach-power_user',     check: ({ postCount, likedCount, followingCount }) => postCount >= 1 && likedCount >= 5 && followingCount >= 3 },
  { id: 'og',             name: 'OG',              desc: 'joined on launch day',         rarity: 'legend', spriteId: 'ach-og',             check: ({ joinedAt }) => (Date.now() - new Date(LAUNCH_DATE)) / 86400000 <= 1 && new Date(joinedAt) >= new Date(LAUNCH_DATE) },
];