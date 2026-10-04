package com.chhath.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.BridgeActivity;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends BridgeActivity {
    private static final String CHANNEL_ID = "chhath_media_channel";
    private static final int NOTIFICATION_ID = 1008;

    private static final String ACTION_PREV = "com.chhath.app.ACTION_PREV";
    private static final String ACTION_PLAY_PAUSE = "com.chhath.app.ACTION_PLAY_PAUSE";
    private static final String ACTION_NEXT = "com.chhath.app.ACTION_NEXT";

    private long lastBackPressTime = 0;
    private PowerManager.WakeLock wakeLock = null;
    private String lastThumbnailUrl = "";
    private Bitmap cachedThumbnail = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        createNotificationChannel();

        // 1. Configure WebView for background media and interface bridge
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setJavaScriptEnabled(true);

                // Add Javascript interface for direct communication
                webView.addJavascriptInterface(new MediaBridge(), "AndroidMedia");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 2. Hardware and Gesture Back Button Interception
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge().getWebView();
                if (webView != null) {
                    webView.evaluateJavascript(
                        "(function() {" +
                        "  if (typeof window.handleAndroidBack === 'function') {" +
                        "    return window.handleAndroidBack();" +
                        "  }" +
                        "  if (window.history.length > 1 && window.location.pathname !== '/' && window.location.hash !== '') {" +
                        "    window.history.back();" +
                        "    return 'handled';" +
                        "  }" +
                        "  return 'unhandled';" +
                        "})()",
                        new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String value) {
                                if ("\"handled\"".equals(value)) {
                                    // Successfully handled by in-app navigation or modal closing
                                    return;
                                }

                                // User is on Home page: double-tap to exit
                                long now = System.currentTimeMillis();
                                if (now - lastBackPressTime < 2000) {
                                    finish();
                                } else {
                                    lastBackPressTime = now;
                                    Toast.makeText(MainActivity.this, "बाहर निकलने के लिए दोबारा बैक दबाएं", Toast.LENGTH_SHORT).show();
                                }
                            }
                        }
                    );
                } else {
                    finish();
                }
            }
        });

        // 3. Handle intent if launched or tapped from notification
        handleMediaIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleMediaIntent(intent);
    }

    private void handleMediaIntent(Intent intent) {
        if (intent == null || intent.getAction() == null) return;
        String action = intent.getAction();

        WebView webView = getBridge().getWebView();
        if (webView == null) return;

        if (ACTION_PREV.equals(action)) {
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('notification-action', { detail: 'prev' }))", null);
        } else if (ACTION_PLAY_PAUSE.equals(action)) {
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('notification-action', { detail: 'toggle' }))", null);
        } else if (ACTION_NEXT.equals(action)) {
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('notification-action', { detail: 'next' }))", null);
        }
    }

    // ==========================================
    // NOTIFICATION & LOCK SCREEN MEDIA PLAYER
    // ==========================================
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "छठ महापर्व भजन प्लेयर",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("छठ पूजा भक्ति संगीत व भजन नियंत्रण");
            channel.setShowBadge(false);
            channel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    public void showMediaNotification(String title, String singer, String thumbnailUrl, boolean isPlaying) {
        acquireWakeLock();

        // Download thumbnail asynchronously if needed
        if (thumbnailUrl != null && !thumbnailUrl.isEmpty() && !thumbnailUrl.equals(lastThumbnailUrl)) {
            new Thread(() -> {
                try {
                    URL url = new URL(thumbnailUrl);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setDoInput(true);
                    connection.connect();
                    InputStream input = connection.getInputStream();
                    cachedThumbnail = BitmapFactory.decodeStream(input);
                    lastThumbnailUrl = thumbnailUrl;
                } catch (Exception e) {
                    cachedThumbnail = null;
                }
                runOnUiThread(() -> buildAndPostNotification(title, singer, isPlaying));
            }).start();
        } else {
            buildAndPostNotification(title, singer, isPlaying);
        }
    }

    private void buildAndPostNotification(String title, String singer, boolean isPlaying) {
        try {
            // Intent to open app when tapping notification body
            Intent openIntent = new Intent(this, MainActivity.class);
            openIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            int flags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                : PendingIntent.FLAG_UPDATE_CURRENT;
            PendingIntent openPendingIntent = PendingIntent.getActivity(this, 0, openIntent, flags);

            // Previous Action Intent
            Intent prevIntent = new Intent(this, MainActivity.class);
            prevIntent.setAction(ACTION_PREV);
            PendingIntent prevPendingIntent = PendingIntent.getActivity(this, 1, prevIntent, flags);

            // Play/Pause Action Intent
            Intent playPauseIntent = new Intent(this, MainActivity.class);
            playPauseIntent.setAction(ACTION_PLAY_PAUSE);
            PendingIntent playPausePendingIntent = PendingIntent.getActivity(this, 2, playPauseIntent, flags);

            // Next Action Intent
            Intent nextIntent = new Intent(this, MainActivity.class);
            nextIntent.setAction(ACTION_NEXT);
            PendingIntent nextPendingIntent = PendingIntent.getActivity(this, 3, nextIntent, flags);

            int playPauseIcon = isPlaying ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title != null && !title.isEmpty() ? title : "छठ महापर्व भक्ति संगीत")
                .setContentText(singer != null && !singer.isEmpty() ? singer : "शारदा सिन्हा व पारंपरिक भजन")
                .setSubText("छठ महापर्व 2026")
                .setContentIntent(openPendingIntent)
                .setOngoing(isPlaying)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .addAction(android.R.drawable.ic_media_previous, "Previous", prevPendingIntent)
                .addAction(playPauseIcon, isPlaying ? "Pause" : "Play", playPausePendingIntent)
                .addAction(android.R.drawable.ic_media_next, "Next", nextPendingIntent)
                .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                    .setShowActionsInCompactView(0, 1, 2));

            if (cachedThumbnail != null) {
                builder.setLargeIcon(cachedThumbnail);
            }

            NotificationManagerCompat.from(this).notify(NOTIFICATION_ID, builder.build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void hideMediaNotification() {
        try {
            NotificationManagerCompat.from(this).cancel(NOTIFICATION_ID);
        } catch (Exception e) {
            e.printStackTrace();
        }
        releaseWakeLock();
    }

    private void acquireWakeLock() {
        if (wakeLock == null) {
            try {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                if (pm != null) {
                    wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ChhathApp:BackgroundAudioLock");
                    wakeLock.acquire(10 * 60 * 1000L); // 10 minutes buffer
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
            wakeLock = null;
        }
    }

    // ==========================================
    // JAVASCRIPT INTERFACE FOR WEB CLIENT
    // ==========================================
    public class MediaBridge {
        @JavascriptInterface
        public void updateMedia(String title, String singer, String thumbnail, boolean isPlaying) {
            runOnUiThread(() -> showMediaNotification(title, singer, thumbnail, isPlaying));
        }

        @JavascriptInterface
        public void stopMedia() {
            runOnUiThread(() -> hideMediaNotification());
        }
    }

    // ==========================================
    // BACKGROUND KEEP-ALIVE LIFECYCLE
    // ==========================================
    @Override
    public void onPause() {
        super.onPause();
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.resumeTimers();
                webView.onResume();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.resumeTimers();
                webView.onResume();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        hideMediaNotification();
        super.onDestroy();
    }
}
