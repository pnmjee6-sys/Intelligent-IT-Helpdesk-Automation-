import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Prisma Seed] Starting database seeding...');

  // Create Default System Admin User
  const passwordHash = await bcrypt.hash('AdminSecret123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password_hash: passwordHash,
      full_name: 'System Administrator',
      role: UserRole.SYS_ADMIN,
      department: 'IT Operations',
      okta_id: 'OKTA_ADMIN_001',
    },
  });

  console.log(`[Prisma Seed] Admin User created/verified: ${adminUser.email}`);

  // Create Default Knowledge Base Article
  const kbArticle = await prisma.knowledgeArticle.create({
    data: {
      title: 'GlobalProtect VPN & SSO Quickstart Guide',
      content_markdown: `# VPN Troubleshooting Guide\nIf you experience GlobalProtect connection timeouts, clear credentials under App Settings and reconnect to gateway vpn-us-east2.corp.internal. For Okta password unlocks, visit https://sso.company.com/unlock.`,
      category_id: 'Network & Security / VPN',
      is_published: true,
    },
  });

  console.log(`[Prisma Seed] Default KB Article created: ${kbArticle.title}`);
  console.log('[Prisma Seed] Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('[Prisma Seed] Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
