// Test script for DatabaseEngine & Social Architecture
const http = require('http');

async function testBackend() {
  console.log('--- Testing Chhath Mahaparv Social Backend API & Database Engine ---');

  // Test Direct Database Engine
  const { databaseEngine } = require('../server/db/databaseEngine.ts');
  
  // 1. Verify Seed Users & UUIDs
  console.log('\n[Test 1] Verifying Canonical Seed Users:');
  const sharda = databaseEngine.getProfileByUsername('@sharda_trust');
  console.log('Sharda Sinha Profile UUID:', sharda?.user_id, 'Name:', sharda?.display_name);
  if (!sharda || !sharda.user_id.includes('-')) {
    throw new Error('Sharda Sinha seed user UUID failed!');
  }

  // 2. Test New User Registration with UUID v4
  console.log('\n[Test 2] Testing User Signup:');
  const testUser = databaseEngine.createUser({
    name: 'अमित कुमार सिंह',
    username: 'amit_chhath_2026',
    email: 'amit@patna.org',
    password: 'password123',
    city: 'Patna',
    clientInfo: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('New User Created:');
  console.log(' - User ID (UUID v4):', testUser.user.user_id);
  console.log(' - Username:', testUser.user.username);
  console.log(' - Session Token:', testUser.sessionToken.substring(0, 15) + '...');
  console.log(' - Default Settings:', testUser.settings.who_can_message, 'is_private:', testUser.settings.is_private_account);

  // 3. Test Session Verification
  console.log('\n[Test 3] Testing Session Verification:');
  const sess = databaseEngine.verifySession(testUser.sessionToken);
  console.log('Session verified for:', sess?.user.username, 'Session ID:', sess?.session.id);
  if (!sess || sess.user.user_id !== testUser.user.user_id) {
    throw new Error('Session verification failed!');
  }

  // 4. Test Social Graph: Follow & Block
  console.log('\n[Test 4] Testing Follow & Follow Request:');
  const followRes1 = databaseEngine.toggleFollow(testUser.user.user_id, sharda.user_id);
  console.log('Follow Sharda status:', followRes1.status);
  const shardaFollowers = databaseEngine.getFollowers(sharda.user_id);
  console.log('Sharda follower list contains new user:', shardaFollowers.some(f => f.user_id === testUser.user.user_id));

  // 5. Test Private Account Follow Request
  console.log('\n[Test 5] Testing Private Account Follow Flow:');
  databaseEngine.updateSettings(sharda.user_id, { is_private_account: true });
  // Unfollow first
  databaseEngine.toggleFollow(testUser.user.user_id, sharda.user_id);
  // Re-follow private account
  const followRes2 = databaseEngine.toggleFollow(testUser.user.user_id, sharda.user_id);
  console.log('Follow private account result:', followRes2.status);
  if (followRes2.status !== 'pending') {
    throw new Error('Private account should have resulted in pending follow request!');
  }
  const pendingRequests = databaseEngine.getPendingFollowRequests(sharda.user_id);
  console.log('Pending requests for Sharda count:', pendingRequests.length);
  const acceptRes = databaseEngine.acceptFollowRequest(sharda.user_id, testUser.user.user_id);
  console.log('Accepted follow request:', acceptRes);

  // 6. Test Block & Follow Severance
  console.log('\n[Test 6] Testing Block & Social Severance:');
  databaseEngine.blockUser(sharda.user_id, testUser.user.user_id);
  const isBlocked = databaseEngine.isBlocked(sharda.user_id, testUser.user.user_id);
  console.log('Is test user blocked by Sharda:', isBlocked);
  const followAfterBlock = databaseEngine.getFollowStatus(testUser.user.user_id, sharda.user_id);
  console.log('Follow status after block:', followAfterBlock);
  if (followAfterBlock !== 'none') {
    throw new Error('Follow should be severed upon blocking!');
  }

  // 7. Test Data Export (GDPR / Privacy)
  console.log('\n[Test 7] Testing "Download My Data" Export:');
  const exportData = databaseEngine.exportUserData(testUser.user.user_id);
  console.log('Export Metadata:', exportData.exportMetadata);
  console.log('Export Sections:', Object.keys(exportData));
  if (!exportData.account || !exportData.profile || !exportData.privacyAndSettings) {
    throw new Error('Export package missing critical sections!');
  }

  // 8. Test Active Sessions & Revocation
  console.log('\n[Test 8] Testing Active Sessions Revocation:');
  const sessionsBefore = databaseEngine.getUserSessions(testUser.user.user_id);
  console.log('Active sessions before revoke:', sessionsBefore.length);
  databaseEngine.revokeSession(testUser.sessionToken);
  const verifyAfterRevoke = databaseEngine.verifySession(testUser.sessionToken);
  console.log('Session after revocation:', verifyAfterRevoke);
  if (verifyAfterRevoke !== null) {
    throw new Error('Session should be null after revocation!');
  }

  // Clean up test user
  databaseEngine.deleteAccount(testUser.user.user_id);
  console.log('\n[Cleanup] Test user deleted successfully.');
  console.log('\n>>> ALL 8 DATABASE ENGINE TESTS PASSED PERFECTLY! <<<');
}

testBackend().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
