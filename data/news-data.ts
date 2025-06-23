import { Article, Category, Author } from '@/types/news';

export const categories: Category[] = [
  { id: 'latest', name: 'Latest News', slug: 'latest' },
  { id: 'politics', name: 'Politics', slug: 'politics' },
  { id: 'society', name: 'Society', slug: 'society' },
  { id: 'business', name: 'Business', slug: 'business' },
  { id: 'world', name: 'World', slug: 'world' },
  { id: 'sports', name: 'Sports', slug: 'sports' },
  { id: 'technology', name: 'Science & Nature', slug: 'technology' },
  { id: 'culture', name: 'Culture', slug: 'culture' },
  { id: 'specialties', name: 'JN Specialties', slug: 'specialties' },
  { id: 'features', name: 'Features', slug: 'features' },
];

export const authors: Author[] = [
  {
    id: 'john-doe',
    name: 'John Doe',
    bio: 'Senior Political Reporter with 15+ years of experience covering Japanese politics.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    social: {
      twitter: '@johndoe',
      linkedin: 'johndoe',
    },
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    bio: 'International correspondent covering Asia-Pacific region.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    social: {
      twitter: '@janesmith',
      linkedin: 'janesmith',
    },
  },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    bio: 'Business and economics journalist specializing in Japanese markets.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    social: {
      twitter: '@mikejohnson',
      linkedin: 'mikejohnson',
    },
  },
];

export const hotWords = [
  '#Tokyo Election',
  '#2025 Expo Osaka',
  '#Rice Crisis',
  '#Shigeo Nagashima',
  '#Trump Tariffs',
];

export const newsFlashItems = [
  'Tesla Rolls out Robotaxis in Texas Test',
  'Eastern Half of US Sweltering Again, with Dangerous Heat Wave Expected to Last until Midweek',
  'Thai PM Claims She Has Coalition Support after Resignation Calls',
  'In Los Angeles\' Little Persia, US Strikes on Iran Met with Celebration – and Angst',
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Japan to Collaborate with 3 European Countries on Infrastructure Development; Will Work With Romania, Bulgaria, Czech Republic to Build Railroads, Energy Systems',
    slug: 'japan-collaborate-european-countries-infrastructure',
    excerpt: 'BRUSSELS — The Japanese government will strengthen its cooperation with the Central and Eastern European nations of Romania, Bulgaria and the Czech Republic to build railroads, energy systems and other infrastructure.',
    content: `
      <p>BRUSSELS — The Japanese government will strengthen its cooperation with the Central and Eastern European nations of Romania, Bulgaria and the Czech Republic to build railroads, energy systems and other infrastructure.</p>
      
      <p>The initiative aims to enhance connectivity and economic ties between Japan and these European nations through strategic infrastructure partnerships.</p>
      
      <p>Key areas of collaboration include:</p>
      <ul>
        <li>High-speed railway development</li>
        <li>Renewable energy infrastructure</li>
        <li>Smart city technologies</li>
        <li>Digital transformation initiatives</li>
      </ul>
      
      <p>This partnership represents a significant step in Japan's broader strategy to strengthen ties with European nations and expand its influence in global infrastructure development.</p>
    `,
    image: 'https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'politics',
    authorId: 'john-doe',
    publishedAt: '2025-06-23T10:00:00Z',
    trending: true,
    featured: true,
    tags: ['Japan', 'Europe', 'Infrastructure', 'Politics'],
    readTime: 5,
    views: 15420,
  },
  {
    id: '2',
    title: 'Tesla Rolls out Robotaxis in Texas Test',
    slug: 'tesla-robotaxis-texas-test',
    excerpt: 'AUSTIN, June 22 (Reuters) - Tesla TSLA.O deployed a small group of self-driving taxis picking up passengers in Austin, Texas.',
    content: `
      <p>AUSTIN, June 22 (Reuters) - Tesla TSLA.O deployed a small group of self-driving taxis picking up passengers in Austin, Texas, marking a significant milestone in autonomous vehicle technology.</p>
      
      <p>The pilot program represents Tesla's first commercial deployment of its Full Self-Driving (FSD) technology in a ride-hailing capacity.</p>
      
      <p>Key details of the program:</p>
      <ul>
        <li>Limited to specific routes in Austin</li>
        <li>Safety drivers present during initial phase</li>
        <li>Real-time monitoring and data collection</li>
        <li>Gradual expansion planned based on performance</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'technology',
    authorId: 'mike-johnson',
    publishedAt: '2025-06-22T14:30:00Z',
    trending: true,
    featured: false,
    tags: ['Tesla', 'Autonomous Vehicles', 'Technology', 'Texas'],
    readTime: 4,
    views: 12850,
  },
  {
    id: '3',
    title: 'Eastern Half of US Sweltering Again, with Dangerous Heat Wave Expected to Last until Midweek',
    slug: 'us-heat-wave-dangerous-temperatures',
    excerpt: 'MADISON, Wis. (AP) — Tens of millions of people across the Midwest and East endured dangerous heat and humidity.',
    content: `
      <p>MADISON, Wis. (AP) — Tens of millions of people across the Midwest and East endured dangerous heat and humidity that made it feel well over 100 degrees Fahrenheit (37.8 Celsius) in some areas.</p>
      
      <p>The National Weather Service issued heat warnings and advisories for multiple states as temperatures soared to dangerous levels.</p>
      
      <p>Safety measures recommended:</p>
      <ul>
        <li>Stay hydrated and avoid prolonged outdoor exposure</li>
        <li>Check on elderly neighbors and relatives</li>
        <li>Use air conditioning or visit cooling centers</li>
        <li>Recognize signs of heat exhaustion and heat stroke</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'society',
    authorId: 'jane-smith',
    publishedAt: '2025-06-22T20:00:00Z',
    trending: true,
    featured: false,
    tags: ['Weather', 'Heat Wave', 'Safety', 'US'],
    readTime: 3,
    views: 8960,
  },
  {
    id: '4',
    title: 'Thai PM Claims She Has Coalition Support after Resignation Calls',
    slug: 'thai-pm-coalition-support-resignation',
    excerpt: 'BANGKOK, June 22 (Reuters) - Thailand\'s prime minister, seeking to fend off calls for her resignation.',
    content: `
      <p>BANGKOK, June 22 (Reuters) - Thailand's prime minister, seeking to fend off calls for her resignation, said on Saturday she had the support of her coalition partners and would continue to lead the government.</p>
      
      <p>The political crisis has raised concerns about stability in Southeast Asia's second-largest economy.</p>
      
      <p>Key developments:</p>
      <ul>
        <li>Opposition calls for no-confidence vote</li>
        <li>Coalition partners reaffirm support</li>
        <li>Economic implications being monitored</li>
        <li>International observers watching closely</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/9875357/pexels-photo-9875357.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'politics',
    authorId: 'john-doe',
    publishedAt: '2025-06-22T09:15:00Z',
    trending: false,
    featured: true,
    tags: ['Thailand', 'Politics', 'Government', 'Asia'],
    readTime: 4,
    views: 6740,
  },
  {
    id: '5',
    title: 'JR East Holds Drone Operation Championship',
    slug: 'jr-east-drone-championship',
    excerpt: 'The Drone DX Championship, a competition for industrial drone users vying for technical mastery of drone operation in narrow spaces.',
    content: `
      <p>The Drone DX Championship, a competition for industrial drone users vying for technical mastery of drone operation in narrow spaces, was held for the first time by JR East.</p>
      
      <p>The competition showcased advanced drone technologies and their applications in railway maintenance and inspection.</p>
      
      <p>Competition highlights:</p>
      <ul>
        <li>Precision flying in confined spaces</li>
        <li>Technical skill demonstrations</li>
        <li>Innovation in industrial applications</li>
        <li>Safety protocol adherence</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'technology',
    authorId: 'mike-johnson',
    publishedAt: '2025-06-22T11:45:00Z',
    trending: false,
    featured: false,
    tags: ['Drones', 'Technology', 'JR East', 'Competition'],
    readTime: 3,
    views: 5280,
  },
  {
    id: '6',
    title: 'Lottery in Aomori Pref. Rewards Locals Who Get Treated for High Blood Pressure',
    slug: 'aomori-lottery-blood-pressure-treatment',
    excerpt: 'The Aomori prefectural government has launched a lottery in which it will reward residents who go to a hospital and are prescribed medicine to lower their blood pressure.',
    content: `
      <p>The Aomori prefectural government has launched a lottery in which it will reward residents who go to a hospital and are prescribed medicine to lower their blood pressure.</p>
      
      <p>This innovative public health initiative aims to encourage preventive healthcare and reduce the burden of hypertension-related diseases.</p>
      
      <p>Program details:</p>
      <ul>
        <li>Monthly lottery drawings for participants</li>
        <li>Prizes include local products and vouchers</li>
        <li>Partnership with local healthcare providers</li>
        <li>Focus on preventive medicine</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'society',
    authorId: 'jane-smith',
    publishedAt: '2025-06-23T08:30:00Z',
    trending: false,
    featured: false,
    tags: ['Healthcare', 'Aomori', 'Public Health', 'Innovation'],
    readTime: 3,
    views: 4200,
  },
  {
    id: '7',
    title: 'Boy Referred to Prosecutors Over Placing Condom at Tokyo Kura Sushi Branch',
    slug: 'tokyo-sushi-incident-prosecution',
    excerpt: 'A teenage boy has been referred to prosecutors over an incident at a conveyor belt sushi restaurant in Tokyo.',
    content: `
      <p>A teenage boy has been referred to prosecutors over an incident at a conveyor belt sushi restaurant in Tokyo where inappropriate behavior was recorded and shared on social media.</p>
      
      <p>The incident highlights ongoing concerns about social media pranks and their legal consequences in Japan.</p>
      
      <p>Legal implications:</p>
      <ul>
        <li>Potential charges for property damage</li>
        <li>Impact on restaurant operations</li>
        <li>Social media responsibility discussions</li>
        <li>Youth education on legal consequences</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'society',
    authorId: 'john-doe',
    publishedAt: '2025-06-23T12:00:00Z',
    trending: false,
    featured: false,
    tags: ['Legal', 'Social Media', 'Youth', 'Tokyo'],
    readTime: 2,
    views: 3800,
  },
  {
    id: '8',
    title: 'In Los Angeles\' Little Persia, US Strikes on Iran Met with Celebration – and Angst',
    slug: 'los-angeles-little-persia-iran-strikes',
    excerpt: 'LOS ANGELES, June 22 (Reuters) - In the cafes and restaurants of Little Persia, a Los Angeles neighborhood.',
    content: `
      <p>LOS ANGELES, June 22 (Reuters) - In the cafes and restaurants of Little Persia, a Los Angeles neighborhood with a large Iranian-American population, news of US military strikes on Iran was met with mixed reactions.</p>
      
      <p>The community's response reflects the complex emotions of Iranian-Americans watching developments in their homeland.</p>
      
      <p>Community reactions:</p>
      <ul>
        <li>Mixed feelings about military action</li>
        <li>Concerns for family members in Iran</li>
        <li>Hope for political change</li>
        <li>Anxiety about escalation</li>
      </ul>
    `,
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1',
    categoryId: 'world',
    authorId: 'jane-smith',
    publishedAt: '2025-06-22T16:20:00Z',
    trending: false,
    featured: false,
    tags: ['Iran', 'US', 'Community', 'International'],
    readTime: 4,
    views: 7200,
  },
];

export const newsData = {
  articles,
  categories,
  authors,
  hotWords,
  newsFlashItems,
};