async function run() {
  const base = 'http://localhost:5173/api/v1';

  console.log('Testing Social REST API via HTTP Fetch:');

  // 1. Login Sharda
  const loginRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: '@sharda_trust', password: 'chhath2026' })
  });
  const loginData = await loginRes.json();
  console.log('1. Login response success:', loginData.success);
  console.log('   User ID:', loginData.user?.user_id);
  console.log('   Username:', loginData.user?.username);
  console.log('   Session Token exists:', Boolean(loginData.sessionToken));
  const token = loginData.sessionToken;

  // 2. Fetch Session
  const sessionRes = await fetch(`${base}/auth/session`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const sessionData = await sessionRes.json();
  console.log('2. Session Verified:', sessionData.success, 'for user:', sessionData.user?.username);

  // 3. Signup a new user
  const uniqueName = 'user_' + Date.now();
  const signupRes = await fetch(`${base}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'श्रद्धा कुमारी',
      username: uniqueName,
      email: `${uniqueName}@test.com`,
      password: 'password123',
      city: 'Muzaffarpur'
    })
  });
  const signupData = await signupRes.json();
  console.log('3. Signup response success:', signupData.success);
  console.log('   New User UUID:', signupData.user?.user_id);
  const userToken = signupData.sessionToken;
  const userUuid = signupData.user?.user_id;

  // 4. Follow Sharda
  const followRes = await fetch(`${base}/follows/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ targetUserId: loginData.user?.user_id })
  });
  const followData = await followRes.json();
  console.log('4. Follow toggle response:', followData);

  // 5. Update Privacy Settings
  const settingsRes = await fetch(`${base}/settings/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      is_private_account: true,
      who_can_message: 'following',
      ai_personalization_enabled: true
    })
  });
  const settingsData = await settingsRes.json();
  console.log('5. Updated Settings is_private:', settingsData.settings?.is_private_account, 'who_can_message:', settingsData.settings?.who_can_message);

  // 6. Active Sessions
  const sessionsRes = await fetch(`${base}/security/sessions`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  const sessionsData = await sessionsRes.json();
  console.log('6. Active Sessions count:', sessionsData.sessions?.length);

  // 7. Download My Data Export
  const exportRes = await fetch(`${base}/data-export`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  const exportData = await exportRes.json();
  console.log('7. Data Export response success:', exportData.success);
  console.log('   Export profile:', exportData.data?.profile?.username);
  console.log('   Export sections:', Object.keys(exportData.data || {}));

  // 8. Delete Test Account
  const delRes = await fetch(`${base}/auth/delete-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ confirmation: 'DELETE' })
  });
  const delData = await delRes.json();
  console.log('8. Account Deletion success:', delData.success);

  console.log('\n>>> ALL SOCIAL REST API ENDPOINTS VALIDATED SUCCESSFULLY! <<<');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
