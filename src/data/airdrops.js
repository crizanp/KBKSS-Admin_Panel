// src/data/airdrops.js

export const airdrops = [
    {
      id: 1,
      name: 'Airdrop 1',
      tasks: [
        {
          id: 1,
          name: 'Follow Twitter',
          description: 'Follow our official Twitter account.',
          link: 'https://twitter.com',
          points: 10,
          proofPlaceholder: 'Enter your Twitter username...',
          category: 'Daily', // New category field
        },
        {
          id: 2,
          name: 'Retweet Post',
          description: 'Retweet our latest post on Twitter.',
          link: 'https://twitter.com',
          points: 20,
          proofPlaceholder: 'Enter the link to your retweet...',
          category: 'Special', // New category field
        },
      ],
    },
    {
      id: 2,
      name: 'Airdrop 2',
      tasks: [
        {
          id: 1,
          name: 'Join Telegram',
          description: 'Join our official Telegram group.',
          link: 'https://telegram.org',
          points: 15,
          proofPlaceholder: 'Enter your Telegram username...',
          category: 'Lists', // New category field
        },
      ],
    },
  ];
  