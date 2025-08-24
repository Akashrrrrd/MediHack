#!/usr/bin/env node

/**
 * MediHack Demo Setup Script
 * Prepares the application for hackathon demonstration
 */

const fs = require('fs');
const path = require('path');

console.log('🏥 Setting up MediHack for hackathon demo...\n');

// Create demo environment file
const demoEnv = `# MediHack Demo Configuration
OPENAI_API_KEY=demo_key_for_hackathon
DATABASE_URL=file:./demo.db
DEMO_MODE=true
ENABLE_MOCK_DATA=true
NEXT_PUBLIC_DEMO_MODE=true
`;

fs.writeFileSync('.env.local', demoEnv);
console.log('✅ Created demo environment configuration');

// Create demo data file
const demoData = {
  hospitals: [
    {
      id: 1,
      name: "City General Hospital",
      address: "123 Healthcare Ave, Medical District",
      phone: "+1-555-0123",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: "Metro Emergency Center", 
      address: "456 Urgent Care Blvd, Downtown",
      phone: "+1-555-0456",
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 3,
      name: "Riverside Medical Center",
      address: "789 River Road, Riverside",
      phone: "+1-555-0789",
      coordinates: { lat: 40.7282, lng: -74.0776 }
    }
  ],
  demoScenarios: [
    {
      name: "Emergency Rush Hour",
      description: "Simulate peak emergency cases",
      emergencyCount: 5,
      totalPatients: 25
    },
    {
      name: "Normal Operations",
      description: "Standard hospital operations",
      emergencyCount: 1,
      totalPatients: 12
    },
    {
      name: "AI Optimization Demo",
      description: "Show AI-powered queue optimization",
      emergencyCount: 2,
      totalPatients: 18
    }
  ]
};

fs.writeFileSync('public/demo-data.json', JSON.stringify(demoData, null, 2));
console.log('✅ Created demo data configuration');

// Create deployment script
const deployScript = `#!/bin/bash
echo "🚀 Deploying MediHack to Vercel..."
npm run build
vercel --prod
echo "✅ Deployment complete!"
echo "🏥 Your hackathon project is live!"
`;

fs.writeFileSync('scripts/deploy.sh', deployScript);
fs.chmodSync('scripts/deploy.sh', '755');
console.log('✅ Created deployment script');

console.log('\n🎉 Demo setup complete!');
console.log('\n📋 Next steps:');
console.log('1. npm install');
console.log('2. npm run dev');
console.log('3. Open http://localhost:3000');
console.log('4. Present your AI-powered healthcare solution!');
console.log('\n🏆 Ready to win the hackathon!');