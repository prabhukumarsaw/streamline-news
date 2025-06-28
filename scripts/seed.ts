import { seedDatabase } from "../db/seed"

async function main() {
  try {
    await seedDatabase()
    console.log("🎉 Database seeded successfully!")
  } catch (error) {
    console.error("💥 Seeding failed:", error)
    process.exit(1)
  }
}

main()
