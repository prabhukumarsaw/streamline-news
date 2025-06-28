import { db } from "./index"
import {
  roles,
  users,
  userRoles,
  categories,
  tags,
  content,
  contentTags,
  comments,
  siteSettings,
  notifications,
} from "./schema"
import bcrypt from "bcryptjs"

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...")

  

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await db.delete(contentTags)
    await db.delete(comments)
    await db.delete(content)
    await db.delete(userRoles)
    await db.delete(users)
    await db.delete(roles)
    await db.delete(tags)
    await db.delete(categories)
    await db.delete(siteSettings)
    await db.delete(notifications)

    // Seed roles
    console.log("👥 Seeding roles...")
    const rolesData = await db
      .insert(roles)
      .values([
        {
          name: "super_admin",
          displayName: "Super Administrator",
          description: "Full system access and configuration",
          isSystemRole: true,
          permissions: {
            content: ["create", "read", "update", "delete", "publish"],
            users: ["create", "read", "update", "delete"],
            settings: ["read", "update"],
            analytics: ["read"],
          },
        },
        {
          name: "editor",
          displayName: "Editor",
          description: "Content management and author supervision",
          isSystemRole: true,
          permissions: {
            content: ["create", "read", "update", "delete", "publish"],
            users: ["read"],
            analytics: ["read"],
          },
        },
        {
          name: "author",
          displayName: "Author",
          description: "Content creation and submission",
          isSystemRole: true,
          permissions: {
            content: ["create", "read", "update"],
          },
        },
        {
          name: "contributor",
          displayName: "Contributor",
          description: "Limited content submission capabilities",
          isSystemRole: true,
          permissions: {
            content: ["create", "read"],
          },
        },
      ])
      .returning()

    // Seed categories
    console.log("📁 Seeding categories...")
    const categoriesData = await db
      .insert(categories)
      .values([
        {
          name: "Technology",
          slug: "technology",
          description: "Latest technology news and innovations",
          color: "#007bff",
          icon: "laptop",
          metaTitle: "Technology News - Latest Tech Updates",
          metaDescription: "Stay updated with the latest technology news, innovations, and trends.",
          sortOrder: 1,
        },
        {
          name: "Business",
          slug: "business",
          description: "Business news and market analysis",
          color: "#28a745",
          icon: "briefcase",
          metaTitle: "Business News - Market Analysis & Updates",
          metaDescription: "Get the latest business news, market analysis, and financial updates.",
          sortOrder: 2,
        },
        {
          name: "Politics",
          slug: "politics",
          description: "Political news and government updates",
          color: "#dc3545",
          icon: "flag",
          metaTitle: "Political News - Government & Policy Updates",
          metaDescription: "Latest political news, government policies, and election updates.",
          sortOrder: 3,
        },
        {
          name: "Sports",
          slug: "sports",
          description: "Sports news and live coverage",
          color: "#fd7e14",
          icon: "trophy",
          metaTitle: "Sports News - Live Coverage & Updates",
          metaDescription: "Get live sports coverage, scores, and latest sports news.",
          sortOrder: 4,
        },
        {
          name: "Health",
          slug: "health",
          description: "Health and medical news",
          color: "#20c997",
          icon: "heart",
          metaTitle: "Health News - Medical Updates & Wellness",
          metaDescription: "Latest health news, medical breakthroughs, and wellness tips.",
          sortOrder: 5,
        },
        {
          name: "Entertainment",
          slug: "entertainment",
          description: "Entertainment and celebrity news",
          color: "#6f42c1",
          icon: "star",
          metaTitle: "Entertainment News - Celebrity & Pop Culture",
          metaDescription: "Latest entertainment news, celebrity updates, and pop culture trends.",
          sortOrder: 6,
        },
      ])
      .returning()

    // Add subcategories
    await db.insert(categories).values([
      {
        name: "Artificial Intelligence",
        slug: "artificial-intelligence",
        description: "AI and machine learning developments",
        parentId: categoriesData.find((c) => c.name === "Technology")?.id,
        color: "#0056b3",
        sortOrder: 1,
      },
      {
        name: "Startups",
        slug: "startups",
        description: "Startup news and entrepreneurship",
        parentId: categoriesData.find((c) => c.name === "Business")?.id,
        color: "#155724",
        sortOrder: 1,
      },
      {
        name: "Football",
        slug: "football",
        description: "Football news and updates",
        parentId: categoriesData.find((c) => c.name === "Sports")?.id,
        color: "#e83e8c",
        sortOrder: 1,
      },
    ])

    // Seed tags
    console.log("🏷️ Seeding tags...")
    const tagsData = await db
      .insert(tags)
      .values([
        {
          name: "breaking-news",
          slug: "breaking-news",
          description: "Breaking news stories",
          color: "#dc3545",
          usageCount: 45,
        },
        {
          name: "artificial-intelligence",
          slug: "artificial-intelligence",
          description: "AI and machine learning topics",
          color: "#007bff",
          usageCount: 89,
        },
        {
          name: "climate-change",
          slug: "climate-change",
          description: "Environmental and climate topics",
          color: "#28a745",
          usageCount: 67,
        },
        {
          name: "cryptocurrency",
          slug: "cryptocurrency",
          description: "Digital currency and blockchain",
          color: "#ffc107",
          usageCount: 123,
        },
        {
          name: "innovation",
          slug: "innovation",
          description: "Innovation and new technologies",
          color: "#6f42c1",
          usageCount: 78,
        },
        {
          name: "startup",
          slug: "startup",
          description: "Startup and entrepreneurship",
          color: "#fd7e14",
          usageCount: 56,
        },
        {
          name: "cybersecurity",
          slug: "cybersecurity",
          description: "Security and privacy topics",
          color: "#20c997",
          usageCount: 34,
        },
        {
          name: "mobile-technology",
          slug: "mobile-technology",
          description: "Mobile devices and apps",
          color: "#17a2b8",
          usageCount: 92,
        },
      ])
      .returning()

    // Seed users
    console.log("👤 Seeding users...")
    const passwordHash = await bcrypt.hash("password123", 12)

    const usersData = await db
      .insert(users)
      .values([
        {
          username: "admin",
          email: "admin@newscms.com",
          passwordHash,
          firstName: "System",
          lastName: "Administrator",
          displayName: "System Admin",
          bio: "System administrator with full access to all CMS features.",
          status: "active",
          emailVerified: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          username: "john.doe",
          email: "john.doe@newscms.com",
          passwordHash,
          firstName: "John",
          lastName: "Doe",
          displayName: "John Doe",
          bio: "Senior technology journalist with 10+ years of experience covering tech industry trends.",
          status: "active",
          emailVerified: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          username: "jane.smith",
          email: "jane.smith@newscms.com",
          passwordHash,
          firstName: "Jane",
          lastName: "Smith",
          displayName: "Jane Smith",
          bio: "Business editor specializing in market analysis and financial reporting.",
          status: "active",
          emailVerified: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        },
        {
          username: "mike.johnson",
          email: "mike.johnson@newscms.com",
          passwordHash,
          firstName: "Mike",
          lastName: "Johnson",
          displayName: "Mike Johnson",
          bio: "Political correspondent covering government policies and election campaigns.",
          status: "active",
          emailVerified: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        },
        {
          username: "sarah.wilson",
          email: "sarah.wilson@newscms.com",
          passwordHash,
          firstName: "Sarah",
          lastName: "Wilson",
          displayName: "Sarah Wilson",
          bio: "Sports journalist covering major leagues and sporting events.",
          status: "active",
          emailVerified: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        },
        {
          username: "david.brown",
          email: "david.brown@newscms.com",
          passwordHash,
          firstName: "David",
          lastName: "Brown",
          displayName: "David Brown",
          bio: "Health and science writer focusing on medical breakthroughs and research.",
          status: "active",
          emailVerified: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        },
      ])
      .returning()

    // Assign roles to users
    console.log("🔐 Assigning user roles...")
    await db.insert(userRoles).values([
      {
        userId: usersData.find((u) => u.username === "admin")?.id!,
        roleId: rolesData.find((r) => r.name === "super_admin")?.id!,
      },
      {
        userId: usersData.find((u) => u.username === "john.doe")?.id!,
        roleId: rolesData.find((r) => r.name === "editor")?.id!,
      },
      {
        userId: usersData.find((u) => u.username === "jane.smith")?.id!,
        roleId: rolesData.find((r) => r.name === "editor")?.id!,
      },
      {
        userId: usersData.find((u) => u.username === "mike.johnson")?.id!,
        roleId: rolesData.find((r) => r.name === "author")?.id!,
      },
      {
        userId: usersData.find((u) => u.username === "sarah.wilson")?.id!,
        roleId: rolesData.find((r) => r.name === "author")?.id!,
      },
      {
        userId: usersData.find((u) => u.username === "david.brown")?.id!,
        roleId: rolesData.find((r) => r.name === "contributor")?.id!,
      },
    ])

    // Seed content
    console.log("📝 Seeding content...")
    const contentData = await db
      .insert(content)
      .values([
        {
          title: "Revolutionary AI Breakthrough Changes Everything We Know About Machine Learning",
          slug: "revolutionary-ai-breakthrough-machine-learning",
          excerpt:
            "Scientists at leading tech companies have announced a groundbreaking discovery in artificial intelligence that could revolutionize how machines learn and adapt.",
          contentBody: `
            <p>In a stunning development that has sent shockwaves through the technology industry, researchers have unveiled a revolutionary breakthrough in artificial intelligence that promises to fundamentally change our understanding of machine learning.</p>
            
            <p>The breakthrough, announced simultaneously by teams at three major technology companies, introduces a new paradigm in AI development that could lead to more efficient, adaptable, and intelligent systems than ever before.</p>
            
            <h2>What Makes This Discovery Special</h2>
            <p>Unlike traditional machine learning models that require extensive training on massive datasets, this new approach allows AI systems to learn and adapt in real-time with minimal data input. The implications for industries ranging from healthcare to autonomous vehicles are enormous.</p>
            
            <p>"This represents the most significant advancement in AI since the development of neural networks," said Dr. Emily Chen, lead researcher on the project. "We're looking at a future where AI can truly understand and adapt to new situations without requiring months of training."</p>
            
            <h2>Industry Impact</h2>
            <p>The technology is expected to have immediate applications in:</p>
            <ul>
              <li>Autonomous vehicle navigation systems</li>
              <li>Medical diagnosis and treatment planning</li>
              <li>Financial market analysis and prediction</li>
              <li>Natural language processing and translation</li>
            </ul>
            
            <p>Major tech companies are already investing billions in implementing this technology, with the first commercial applications expected to launch within the next 18 months.</p>
          `,
          status: "published",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "john.doe")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Technology")?.id!,
          viewCount: 15420,
          likeCount: 342,
          commentCount: 89,
          shareCount: 156,
          isFeatured: true,
          isBreaking: true,
          readingTime: 5,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          metaTitle: "Revolutionary AI Breakthrough in Machine Learning - Latest Tech News",
          metaDescription:
            "Scientists announce groundbreaking AI discovery that could revolutionize machine learning. Learn about the implications for technology and industry.",
          metaKeywords: "artificial intelligence, machine learning, AI breakthrough, technology news",
        },
        {
          title: "Global Markets Rally as Economic Indicators Show Strong Recovery",
          slug: "global-markets-rally-economic-recovery",
          excerpt:
            "Stock markets worldwide surge as new economic data reveals stronger-than-expected growth across major economies, signaling a robust recovery.",
          contentBody: `
            <p>Global financial markets experienced a significant rally today as newly released economic indicators painted a picture of robust recovery across major world economies.</p>
            
            <p>The Dow Jones Industrial Average closed up 2.3%, while the S&P 500 gained 2.1% and the NASDAQ rose 2.8%. International markets showed similar strength, with London's FTSE 100 up 1.9% and Tokyo's Nikkei gaining 2.4%.</p>
            
            <h2>Key Economic Indicators</h2>
            <p>The rally was driven by several positive economic reports:</p>
            <ul>
              <li>GDP growth exceeded expectations by 0.8%</li>
              <li>Unemployment rates dropped to their lowest levels in five years</li>
              <li>Consumer confidence reached a 10-year high</li>
              <li>Manufacturing output increased by 3.2% month-over-month</li>
            </ul>
            
            <p>"These numbers represent a fundamental shift in the economic landscape," said Maria Rodriguez, Chief Economist at Global Financial Analytics. "We're seeing sustained growth across multiple sectors, which bodes well for continued market performance."</p>
            
            <h2>Sector Performance</h2>
            <p>Technology stocks led the charge, with major companies posting gains of 3-5%. The financial sector also performed strongly, benefiting from rising interest rate expectations. Energy and healthcare stocks rounded out the top-performing sectors.</p>
            
            <p>Analysts are optimistic about the sustainability of this growth, citing strong fundamentals and improving global trade conditions as key factors supporting continued market expansion.</p>
          `,
          status: "published",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "jane.smith")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Business")?.id!,
          viewCount: 8930,
          likeCount: 234,
          commentCount: 67,
          shareCount: 89,
          isFeatured: true,
          readingTime: 4,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          metaTitle: "Global Markets Rally - Economic Recovery Shows Strong Growth",
          metaDescription:
            "Stock markets surge worldwide as economic indicators reveal stronger-than-expected growth. Analysis of market performance and recovery trends.",
          metaKeywords: "stock market, economic recovery, GDP growth, financial news",
        },
        {
          title: "Climate Summit Reaches Historic Agreement on Carbon Emissions",
          slug: "climate-summit-historic-carbon-emissions-agreement",
          excerpt:
            "World leaders at the International Climate Summit have reached a groundbreaking agreement on carbon emission reductions, setting ambitious targets for the next decade.",
          contentBody: `
            <p>In a historic moment for global environmental policy, world leaders at the International Climate Summit have unanimously agreed to an ambitious new framework for carbon emission reductions over the next decade.</p>
            
            <p>The agreement, signed by representatives from 195 countries, commits nations to reducing carbon emissions by 50% by 2030 and achieving net-zero emissions by 2040 - targets that are significantly more aggressive than previous international accords.</p>
            
            <h2>Key Provisions of the Agreement</h2>
            <p>The landmark deal includes several groundbreaking provisions:</p>
            <ul>
              <li>Mandatory annual emission reduction targets for all signatory nations</li>
              <li>A $500 billion global fund for clean energy transition</li>
              <li>Technology sharing agreements for renewable energy</li>
              <li>Penalties for countries that fail to meet their commitments</li>
            </ul>
            
            <p>"This agreement represents a turning point in our fight against climate change," said UN Secretary-General António Guterres. "For the first time, we have binding commitments with real consequences, backed by the resources needed to achieve our goals."</p>
            
            <h2>Implementation Timeline</h2>
            <p>The agreement will be implemented in phases, with the first major milestone set for 2025 when countries must demonstrate a 20% reduction in emissions from 2020 levels. Regular monitoring and reporting mechanisms will ensure transparency and accountability.</p>
            
            <p>Environmental groups have hailed the agreement as a crucial step forward, while acknowledging that success will depend on rigorous implementation and enforcement of the new standards.</p>
          `,
          status: "published",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "mike.johnson")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Politics")?.id!,
          viewCount: 12450,
          likeCount: 567,
          commentCount: 123,
          shareCount: 234,
          isFeatured: true,
          readingTime: 6,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
          metaTitle: "Historic Climate Agreement - World Leaders Commit to Carbon Reduction",
          metaDescription:
            "195 countries sign groundbreaking climate agreement with ambitious carbon emission reduction targets. Details of the historic environmental accord.",
          metaKeywords: "climate change, carbon emissions, environmental policy, climate summit",
        },
        {
          title: "Championship Finals Set as Underdogs Advance in Stunning Upset",
          slug: "championship-finals-underdogs-stunning-upset",
          excerpt:
            "In one of the biggest upsets in sports history, the underdog team has advanced to the championship finals after defeating the heavily favored defending champions.",
          contentBody: `
            <p>In what will be remembered as one of the greatest upsets in sports history, the underdog Phoenix Thunder defeated the defending champion Metropolitan Lions 28-21 in a thrilling semifinal match that had fans on the edge of their seats until the final whistle.</p>
            
            <p>The Thunder, who entered the playoffs as the lowest seed, overcame a 14-point deficit in the fourth quarter to secure their spot in next week's championship game. The victory marks the first time in franchise history that the team has reached the finals.</p>
            
            <h2>Game-Changing Moments</h2>
            <p>The turning point came with just 8 minutes remaining when Thunder quarterback Jake Martinez threw a spectacular 45-yard touchdown pass to receiver Tommy Chen, cutting the Lions' lead to 21-14.</p>
            
            <p>The Thunder defense then forced a crucial fumble on the Lions' next possession, setting up the game-tying touchdown with 3:42 left on the clock. The winning score came with just 47 seconds remaining when Martinez found Chen again in the end zone for a 12-yard touchdown.</p>
            
            <h2>Statistical Breakdown</h2>
            <ul>
              <li>Martinez completed 24 of 35 passes for 312 yards and 3 touchdowns</li>
              <li>Chen caught 8 passes for 156 yards and 2 touchdowns</li>
              <li>Thunder defense recorded 4 sacks and 2 forced fumbles</li>
              <li>Lions were held to just 89 rushing yards, well below their season average</li>
            </ul>
            
            <p>"This team has shown incredible heart all season," said Thunder head coach Maria Santos. "Nobody believed in us except the guys in that locker room, and they proved that belief was justified."</p>
            
            <p>The Thunder will face the Northern Wolves in the championship game next Sunday, with kickoff scheduled for 6 PM EST.</p>
          `,
          status: "published",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "sarah.wilson")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Sports")?.id!,
          viewCount: 9876,
          likeCount: 445,
          commentCount: 78,
          shareCount: 167,
          readingTime: 4,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          metaTitle: "Championship Finals Set - Underdog Team Advances in Historic Upset",
          metaDescription:
            "Phoenix Thunder defeats defending champions in stunning upset to reach championship finals. Game recap and analysis of the historic victory.",
          metaKeywords: "championship, sports upset, football, playoffs, finals",
        },
        {
          title: "Medical Breakthrough: New Treatment Shows Promise for Rare Disease",
          slug: "medical-breakthrough-rare-disease-treatment",
          excerpt:
            "Researchers announce promising results from clinical trials of a new treatment for a rare genetic disorder that affects thousands worldwide.",
          contentBody: `
            <p>Medical researchers have announced breakthrough results from Phase III clinical trials of a revolutionary new treatment for Huntington's disease, offering hope to thousands of patients and families affected by this devastating genetic disorder.</p>
            
            <p>The experimental therapy, developed over eight years of intensive research, showed significant improvement in motor function and cognitive abilities in 78% of trial participants, representing the most promising treatment advance for the disease in decades.</p>
            
            <h2>Clinical Trial Results</h2>
            <p>The multi-center trial involved 450 patients across 15 countries and demonstrated remarkable outcomes:</p>
            <ul>
              <li>78% of patients showed measurable improvement in motor symptoms</li>
              <li>65% experienced stabilization or improvement in cognitive function</li>
              <li>Quality of life scores improved by an average of 40%</li>
              <li>The treatment was well-tolerated with minimal side effects</li>
            </ul>
            
            <p>"These results exceed our most optimistic projections," said Dr. Rachel Kim, lead researcher at the International Neurological Research Institute. "We're seeing not just symptom management, but actual improvement in patients' conditions."</p>
            
            <h2>How the Treatment Works</h2>
            <p>The therapy uses a novel gene-silencing approach that targets the specific genetic mutation responsible for Huntington's disease. By reducing the production of the harmful protein, the treatment can slow or even reverse the progression of symptoms.</p>
            
            <p>The FDA has granted the treatment "breakthrough therapy" designation, which could accelerate the approval process. If approved, the therapy could be available to patients within the next 18-24 months.</p>
            
            <p>Patient advocacy groups have welcomed the news, calling it a "game-changer" for the Huntington's disease community.</p>
          `,
          status: "published",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "david.brown")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Health")?.id!,
          viewCount: 7234,
          likeCount: 289,
          commentCount: 45,
          shareCount: 123,
          readingTime: 5,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
          metaTitle: "Medical Breakthrough - New Treatment for Huntington's Disease Shows Promise",
          metaDescription:
            "Clinical trials reveal promising results for new Huntington's disease treatment. 78% of patients show improvement in groundbreaking medical study.",
          metaKeywords: "medical breakthrough, Huntington's disease, clinical trials, gene therapy",
        },
        {
          title: "Draft: Upcoming Technology Conference Preview",
          slug: "upcoming-technology-conference-preview",
          excerpt: "A preview of the major announcements expected at next month's technology conference.",
          contentBody: `
            <p>This is a draft article about the upcoming technology conference. Content to be completed...</p>
          `,
          status: "draft",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "john.doe")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Technology")?.id!,
          readingTime: 3,
        },
        {
          title: "Review: Analysis of New Economic Policy Proposals",
          slug: "analysis-new-economic-policy-proposals",
          excerpt: "An in-depth analysis of the recently proposed economic policies and their potential impact.",
          contentBody: `
            <p>This article is currently under review. The analysis covers the new economic policy proposals...</p>
          `,
          status: "review",
          contentType: "article",
          authorId: usersData.find((u) => u.username === "jane.smith")?.id!,
          categoryId: categoriesData.find((c) => c.name === "Business")?.id!,
          readingTime: 7,
        },
      ])
      .returning()

    // Assign tags to content
    console.log("🔗 Linking content with tags...")
    await db.insert(contentTags).values([
      // AI Breakthrough article
      {
        contentId: contentData.find((c) => c.slug === "revolutionary-ai-breakthrough-machine-learning")?.id!,
        tagId: tagsData.find((t) => t.name === "artificial-intelligence")?.id!,
      },
      {
        contentId: contentData.find((c) => c.slug === "revolutionary-ai-breakthrough-machine-learning")?.id!,
        tagId: tagsData.find((t) => t.name === "breaking-news")?.id!,
      },
      {
        contentId: contentData.find((c) => c.slug === "revolutionary-ai-breakthrough-machine-learning")?.id!,
        tagId: tagsData.find((t) => t.name === "innovation")?.id!,
      },
      // Markets Rally article
      {
        contentId: contentData.find((c) => c.slug === "global-markets-rally-economic-recovery")?.id!,
        tagId: tagsData.find((t) => t.name === "cryptocurrency")?.id!,
      },
      // Climate Summit article
      {
        contentId: contentData.find((c) => c.slug === "climate-summit-historic-carbon-emissions-agreement")?.id!,
        tagId: tagsData.find((t) => t.name === "climate-change")?.id!,
      },
      {
        contentId: contentData.find((c) => c.slug === "climate-summit-historic-carbon-emissions-agreement")?.id!,
        tagId: tagsData.find((t) => t.name === "breaking-news")?.id!,
      },
      // Sports article
      {
        contentId: contentData.find((c) => c.slug === "championship-finals-underdogs-stunning-upset")?.id!,
        tagId: tagsData.find((t) => t.name === "breaking-news")?.id!,
      },
      // Medical article
      {
        contentId: contentData.find((c) => c.slug === "medical-breakthrough-rare-disease-treatment")?.id!,
        tagId: tagsData.find((t) => t.name === "innovation")?.id!,
      },
    ])

    // Seed comments
    console.log("💬 Seeding comments...")
    await db.insert(comments).values([
      {
        contentId: contentData.find((c) => c.slug === "revolutionary-ai-breakthrough-machine-learning")?.id!,
        userId: usersData.find((u) => u.username === "jane.smith")?.id!,
        commentText:
          "This is absolutely fascinating! The implications for the healthcare industry alone could be revolutionary. Can't wait to see how this develops.",
        status: "approved",
        likeCount: 23,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        contentId: contentData.find((c) => c.slug === "revolutionary-ai-breakthrough-machine-learning")?.id!,
        userId: usersData.find((u) => u.username === "mike.johnson")?.id!,
        commentText:
          "Great article! I'm curious about the ethical implications of this technology. Will there be regulatory oversight?",
        status: "approved",
        likeCount: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      },
      {
        contentId: contentData.find((c) => c.slug === "global-markets-rally-economic-recovery")?.id!,
        userId: usersData.find((u) => u.username === "john.doe")?.id!,
        commentText:
          "Excellent analysis of the market conditions. The GDP growth numbers are particularly encouraging for tech sector investments.",
        status: "approved",
        likeCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      },
      {
        contentId: contentData.find((c) => c.slug === "climate-summit-historic-carbon-emissions-agreement")?.id!,
        userId: usersData.find((u) => u.username === "sarah.wilson")?.id!,
        commentText:
          "Finally, some real action on climate change! The binding commitments are what we've been waiting for. Hope the implementation goes smoothly.",
        status: "approved",
        likeCount: 34,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
      {
        contentId: contentData.find((c) => c.slug === "championship-finals-underdogs-stunning-upset")?.id!,
        userId: usersData.find((u) => u.username === "david.brown")?.id!,
        commentText: "What a game! Martinez played like a champion. Can't wait for the finals next week!",
        status: "approved",
        likeCount: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
      },
      {
        contentId: contentData.find((c) => c.slug === "medical-breakthrough-rare-disease-treatment")?.id!,
        userId: usersData.find((u) => u.username === "jane.smith")?.id!,
        commentText:
          "As someone with a family member affected by Huntington's, this news brings so much hope. Thank you for covering this important story.",
        status: "approved",
        likeCount: 45,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
      },
    ])

    // Seed site settings
    console.log("⚙️ Seeding site settings...")
    await db.insert(siteSettings).values([
      {
        settingKey: "site_name",
        settingValue: "NewsHub CMS",
        settingType: "string",
        description: "The name of the website",
        isPublic: true,
      },
      {
        settingKey: "site_description",
        settingValue: "Your trusted source for breaking news and in-depth analysis",
        settingType: "string",
        description: "The description of the website",
        isPublic: true,
      },
      {
        settingKey: "site_logo",
        settingValue: "/logo.png",
        settingType: "string",
        description: "Path to the site logo",
        isPublic: true,
      },
      {
        settingKey: "posts_per_page",
        settingValue: "10",
        settingType: "integer",
        description: "Number of posts to display per page",
        isPublic: false,
      },
      {
        settingKey: "comments_enabled",
        settingValue: "true",
        settingType: "boolean",
        description: "Enable comments on articles",
        isPublic: false,
      },
      {
        settingKey: "user_registration",
        settingValue: "true",
        settingType: "boolean",
        description: "Allow new user registration",
        isPublic: false,
      },
      {
        settingKey: "maintenance_mode",
        settingValue: "false",
        settingType: "boolean",
        description: "Enable maintenance mode",
        isPublic: false,
      },
      {
        settingKey: "analytics_tracking_id",
        settingValue: "GA-XXXXXXXXX",
        settingType: "string",
        description: "Google Analytics tracking ID",
        isPublic: false,
      },
      {
        settingKey: "social_twitter",
        settingValue: "@newshubcms",
        settingType: "string",
        description: "Twitter handle",
        isPublic: true,
      },
      {
        settingKey: "social_facebook",
        settingValue: "facebook.com/newshubcms",
        settingType: "string",
        description: "Facebook page URL",
        isPublic: true,
      },
      {
        settingKey: "contact_email",
        settingValue: "contact@newshubcms.com",
        settingType: "string",
        description: "Contact email address",
        isPublic: true,
      },
      {
        settingKey: "timezone",
        settingValue: "America/New_York",
        settingType: "string",
        description: "Default timezone",
        isPublic: false,
      },
    ])

    // Seed notifications
    console.log("🔔 Seeding notifications...")
    await db.insert(notifications).values([
      {
        userId: usersData.find((u) => u.username === "admin")?.id!,
        title: "System Update Complete",
        message: "The CMS system has been successfully updated to the latest version.",
        type: "success",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        userId: usersData.find((u) => u.username === "john.doe")?.id!,
        title: "Article Approved",
        message: "Your article 'Revolutionary AI Breakthrough' has been approved and published.",
        type: "success",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      },
      {
        userId: usersData.find((u) => u.username === "jane.smith")?.id!,
        title: "Comment Moderation Required",
        message: "There are 3 new comments awaiting moderation on your articles.",
        type: "info",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        userId: usersData.find((u) => u.username === "mike.johnson")?.id!,
        title: "Deadline Reminder",
        message: "Your article 'Economic Policy Analysis' is due for review tomorrow.",
        type: "warning",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
    ])

    console.log("✅ Database seeding completed successfully!")
    console.log(`
📊 Seeded data summary:
- ${rolesData.length} roles
- ${categoriesData.length} main categories (+ 3 subcategories)
- ${tagsData.length} tags
- ${usersData.length} users
- ${contentData.length} articles
- 8 content-tag associations
- 6 comments
- 12 site settings
- 4 notifications
    `)
  } catch (error: any) {
    console.error("❌ Error seeding database:", error);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding completed!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error)
      process.exit(1)
    })
}
