// This script helps set up the frontend environment variables
const fs = require('fs');
const path = require('path');

const envContent = `# Frontend Environment Variables
VITE_API_URL=https://task-manager-r6gx.onrender.com/api/v1
VITE_APP_TITLE=TaskFlow
VITE_NODE_ENV=production
`;

const envPath = path.join(__dirname, '.env');

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Frontend .env file created successfully!');
console.log('📁 Location:', envPath);
console.log('🔗 API URL: https://task-manager-r6gx.onrender.com/api/v1');
console.log('\n🚀 Now run: npm run build and deploy to Vercel');
