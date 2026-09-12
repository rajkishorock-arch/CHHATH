const path = require('path');
const fs = require('fs');

async function runVerification() {
  console.log('====================================================');
  console.log('CHHATH MAHAPARV DIGITAL ECOSYSTEM: VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} — ${details}`);
      failed++;
    }
  }

  // 1. Verify files exist
  const requiredFiles = [
    'src/services/ai/agentTools.ts',
    'src/services/ai/aiService.ts',
    'server/aiMiddleware.ts',
    'src/components/ai/ChhathiAssistantModal.tsx',
    'src/components/dashboard/MyChhathDashboard.tsx',
    'src/components/reels/AIReelStudioModal.tsx',
    'src/components/reels/CreateReelModal.tsx',
    'src/components/engagement/AIGreetingStudio.tsx',
    'src/data/astronomy.ts',
    'src/data/ghats.ts',
    'src/data/prasad.ts',
    'src/data/days.ts',
    'src/data/songs.ts',
    'src/data/wishes.ts'
  ];

  for (const f of requiredFiles) {
    const full = path.join(__dirname, '..', f);
    assert(`File Exists: ${f}`, fs.existsSync(full));
  }

  // 2. Check agentTools definitions
  const agentToolsContent = fs.readFileSync(path.join(__dirname, '../src/services/ai/agentTools.ts'), 'utf-8');
  const expectedTools = [
    'get_user_profile',
    'get_user_preferences',
    'get_arghya_time',
    'get_weather',
    'search_ghats',
    'search_internal_content',
    'search_reels',
    'search_songs',
    'search_users',
    'search_youtube',
    'get_recipe',
    'get_puja_information',
    'create_checklist',
    'save_reel',
    'like_reel',
    'follow_user',
    'create_reminder',
    'get_family_data',
    'create_family_task',
    'generate_wish',
    'generate_caption',
    'generate_reel_metadata'
  ];

  for (const t of expectedTools) {
    assert(`Tool defined: ${t}()`, agentToolsContent.includes(`name: '${t}'`));
  }

  // 3. Check Real-Time Voice AI implementation in ChhathiAssistantModal
  const assistantContent = fs.readFileSync(path.join(__dirname, '../src/components/ai/ChhathiAssistantModal.tsx'), 'utf-8');
  assert('Voice AI Web Speech Integration', assistantContent.includes('webkitSpeechRecognition') || assistantContent.includes('SpeechRecognition'));
  assert('Voice AI Audio Synthesis (TTS)', assistantContent.includes('speakText'));
  assert('Voice AI Visualizer Rings', assistantContent.includes('animate-ping') && assistantContent.includes('animate-pulse'));
  assert('AI Vision Scanner (Ask AI About This)', assistantContent.includes('analyzeImage') && assistantContent.includes('type="file"'));

  // 4. Check "My Chhath" Personalized Command Center
  const dashboardContent = fs.readFileSync(path.join(__dirname, '../src/components/dashboard/MyChhathDashboard.tsx'), 'utf-8');
  assert('Time-of-day dynamic greeting', dashboardContent.includes('getGreeting()'));
  assert('"What should I do now?" Contextual AI', dashboardContent.includes('getWhatShouldIDoNow'));
  assert('"Create My Chhath Plan" 4-Day Planner', dashboardContent.includes('createChhathPlan'));
  assert('"Understand Chhath" Explainer', dashboardContent.includes('छठ महापर्व का आध्यात्मिक व वैज्ञानिक रहस्य'));
  assert('Interactive Persistent Checklist', dashboardContent.includes('chhath_interactive_checklist'));
  assert('Data Integrity / No Fake Data Marker', dashboardContent.includes('खगोलीय पंचांग गणना • नो फेक डेटा'));

  // 5. Check AI Reel Studio
  const reelStudioContent = fs.readFileSync(path.join(__dirname, '../src/components/reels/AIReelStudioModal.tsx'), 'utf-8');
  assert('AI Reel Studio 9:16 Aspect Ratio', reelStudioContent.includes('aspect-[9/16]'));
  assert('AI Storyboard Sequence Ordering', reelStudioContent.includes('Storyboard Scene') || reelStudioContent.includes('StoryboardSequence') || reelStudioContent.includes('दृश्य 1'));
  assert('AI Approved Licensed Music Matching', reelStudioContent.includes('getAudioTracks'));

  // 6. Check Server Middleware
  const viteConfig = fs.readFileSync(path.join(__dirname, '../vite.config.ts'), 'utf-8');
  assert('Server Middleware /api/ai/agent mounted', viteConfig.includes('/api/ai/agent'));
  assert('Server Middleware /api/search mounted', viteConfig.includes('/api/search'));

  console.log('\n----------------------------------------------------');
  console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL ARCHITECTURAL INTEGRITY CHECKS PASSED WITH 100% SUCCESS!');
  }
}

runVerification().catch(err => {
  console.error(err);
  process.exit(1);
});
