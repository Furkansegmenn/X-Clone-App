export type TrendTopic = {
  id: string
  title: string
  category?: string
  tweetsCount?: number
}

export const TRENDING_TOPICS: TrendTopic[] = [
  { id: '1', title: 'React Native', category: 'Technology', tweetsCount: 12400 },
  { id: '2', title: 'Expo Router', category: 'Technology', tweetsCount: 8600 },
  { id: '3', title: 'TypeScript 5', category: 'Technology', tweetsCount: 15200 },
  { id: '4', title: 'iOS 18', category: 'Mobile', tweetsCount: 9300 },
  { id: '5', title: 'Android 15', category: 'Mobile', tweetsCount: 10100 },
  { id: '6', title: 'Next.js 15', category: 'Web', tweetsCount: 11700 },
  { id: '7', title: 'Node.js 22', category: 'Backend', tweetsCount: 7800 },
  { id: '8', title: 'AI Agents', category: 'AI', tweetsCount: 20900 },
  { id: '9', title: 'Tailwind CSS', category: 'Design', tweetsCount: 6900 },
  { id: '10', title: 'Open Source', category: 'Community', tweetsCount: 5400 },
  { id: '11', title: 'Cloud Functions', category: 'Cloud', tweetsCount: 6100 },
  { id: '12', title: 'Micro Frontends', category: 'Architecture', tweetsCount: 3300 },
  { id: '13', title: 'Docker', category: 'DevOps', tweetsCount: 8700 },
  { id: '14', title: 'GraphQL', category: 'API', tweetsCount: 7200 },
  { id: '15', title: 'Prisma ORM', category: 'Database', tweetsCount: 4100 }
]


