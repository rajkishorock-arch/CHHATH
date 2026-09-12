const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data || '{}'), raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== CHHATH CONNECT: VERIFICATION SUITE ===\n');

  let passed = 0;
  let total = 0;

  // 1. Health check
  total++;
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/api/chat/health',
      method: 'GET'
    });
    if (res.status === 200 && res.body.status === 'ok') {
      console.log('✔ Test 1: GET /api/chat/health returned 200 OK');
      passed++;
    } else {
      console.error('✖ Test 1 Failed:', res);
    }
  } catch (err) {
    console.error('✖ Test 1 Error:', err.message);
  }

  // 2. Message relay POST /api/chat/messages
  total++;
  try {
    const testMsg = {
      id: 'msg_test_' + Date.now(),
      conversationId: 'conv_test_123',
      senderId: 'user_test_1',
      senderName: 'परीक्षण भक्त',
      senderUsername: '@test_bhakt',
      senderAvatar: '',
      type: 'text',
      text: 'जय छठी मइया! परीक्षण संदेश सफल।',
      status: 'delivered',
      readBy: {},
      deliveredTo: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const postRes = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/api/chat/messages',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testMsg);

    if (postRes.status === 200 && postRes.body.success) {
      console.log('✔ Test 2: POST /api/chat/messages message relay succeeded');
      passed++;
    } else {
      console.error('✖ Test 2 Failed:', postRes);
    }
  } catch (err) {
    console.error('✖ Test 2 Error:', err.message);
  }

  // 3. Message retrieval GET /api/chat/messages
  total++;
  try {
    const getRes = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/api/chat/messages?conversationId=conv_test_123',
      method: 'GET'
    });

    if (getRes.status === 200 && Array.isArray(getRes.body.messages) && getRes.body.messages.length > 0) {
      console.log(`✔ Test 3: GET /api/chat/messages retrieved ${getRes.body.messages.length} message(s)`);
      passed++;
    } else {
      console.error('✖ Test 3 Failed:', getRes);
    }
  } catch (err) {
    console.error('✖ Test 3 Error:', err.message);
  }

  // 4. WebRTC Signaling Relay POST /api/chat/signal
  total++;
  try {
    const signalPayload = {
      targetUserId: 'user_target_456',
      fromUserId: 'user_caller_123',
      type: 'offer',
      data: { sdp: 'v=0\r\no=...' }
    };

    const sigRes = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/api/chat/signal',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, signalPayload);

    if (sigRes.status === 200 && sigRes.body.success) {
      console.log('✔ Test 4: POST /api/chat/signal queued WebRTC offer successfully');
      passed++;
    } else {
      console.error('✖ Test 4 Failed:', sigRes);
    }
  } catch (err) {
    console.error('✖ Test 4 Error:', err.message);
  }

  // 5. WebRTC Signaling Retrieval GET /api/chat/signal?userId=...
  total++;
  try {
    const getSigRes = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/api/chat/signal?userId=user_target_456',
      method: 'GET'
    });

    if (getSigRes.status === 200 && Array.isArray(getSigRes.body.signals) && getSigRes.body.signals.length > 0) {
      console.log(`✔ Test 5: GET /api/chat/signal retrieved queued offer for user_target_456`);
      passed++;
    } else {
      console.error('✖ Test 5 Failed:', getSigRes);
    }
  } catch (err) {
    console.error('✖ Test 5 Error:', err.message);
  }

  console.log(`\n==========================================`);
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log(`==========================================`);

  if (passed === total) {
    console.log('🎉 ALL BACKEND CHAT & WEBRTC SIGNALING TESTS PASSED!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
