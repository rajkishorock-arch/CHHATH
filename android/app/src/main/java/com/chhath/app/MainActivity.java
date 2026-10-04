package com.chhath.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
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
    public static final String CHANNEL_ID = "chhath_media_channel";
    public static final int NOTIFICATION_ID = 1008;

    public static final String ACTION_PREV = "com.chhath.app.ACTION_PREV";
    public static final String ACTION_PLAY_PAUSE = "com.chhath.app.ACTION_PLAY_PAUSE";
    public static final String ACTION_NEXT = "com.chhath.app.ACTION_NEXT";

    private static MainActivity sInstance;

    private long lastBackPressTime = 0;
    private PowerManager.WakeLock wakeLock = null;
    private String lastThumbnailUrl = "";
    private Bitmap cachedThumbnail = null;
    private MediaSessionCompat mediaSession = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        sInstance = this;
        super.onCreate(savedInstanceState);

        createNotificationChannel();
        initMediaSession();

        // 1. Request notification permission on Android 13+ (API 33+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }

        // 2. Configure WebView for background media and interface bridge
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);

                // Add Javascript interface for direct communication
                webView.addJavascriptInterface(new MediaBridge(), "AndroidMedia");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 3. Hardware and Gesture Back Button Interception
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
                                if (value != null && (value.contains("handled") || "\"handled\"".equals(value))) {
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

        // 4. Handle intent if launched or tapped from notification
        handleMediaIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleMediaIntent(intent);
    }

    private void initMediaSession() {
        try {
            if (mediaSession == null) {
                mediaSession = new MediaSessionCompat(this, "ChhathMediaSession");
                mediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS | MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS);
                mediaSession.setCallback(new MediaSessionCompat.Callback() {
                    @Override
                    public void onPlay() {
                        handleMediaAction(ACTION_PLAY_PAUSE);
                    }
                    @Override
                    public void onPause() {
                        handleMediaAction(ACTION_PLAY_PAUSE);
                    }
                    @Override
                    public void onSkipToNext() {
                        handleMediaAction(ACTION_NEXT);
                    }
                    @Override
                    public void onSkipToPrevious() {
                        handleMediaAction(ACTION_PREV);
                    }
                    @Override
                    public void onStop() {
                        handleMediaAction(ACTION_PLAY_PAUSE);
                    }
                });
                mediaSession.setActive(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleMediaAction(String action) {
        runOnUiThread(() -> {
            WebView webView = getBridge().getWebView();
            if (webView == null) return;

            if (ACTION_PREV.equals(action)) {
                webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('notification-action', { detail: 'prev' }))", null);
            } else if (ACTION_PLAY_PAUSE.equals(action)) {
                webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('notification-action', { detail: 'toggle' }))", null);
            } else if (ACTION_NEXT.equals(action)) {
                webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('notification-action', { detail: 'next' }))", null);
            }
        });
    }

    private void handleMediaIntent(Intent intent) {
        if (intent == null || intent.getAction() == null) return;
        handleMediaAction(intent.getAction());
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
                    connection.setConnectTimeout(4000);
                    connection.setReadTimeout(4000);
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
            initMediaSession();

            String displayTitle = (title != null && !title.isEmpty()) ? title : "छठ महापर्व भक्ति संगीत";
            String displaySinger = (singer != null && !singer.isEmpty()) ? singer : "शारदा सिन्हा व पारंपरिक भजन";

            // Update MediaSession state & metadata for native system media controller (Spotify/YT Music style)
            if (mediaSession != null) {
                PlaybackStateCompat.Builder stateBuilder = new PlaybackStateCompat.Builder()
                    .setActions(
                        PlaybackStateCompat.ACTION_PLAY |
                        PlaybackStateCompat.ACTION_PAUSE |
                        PlaybackStateCompat.ACTION_PLAY_PAUSE |
                        PlaybackStateCompat.ACTION_SKIP_TO_NEXT |
                        PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS |
                        PlaybackStateCompat.ACTION_STOP
                    )
                    .setState(
                        isPlaying ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED,
                        PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN,
                        1.0f
                    );
                mediaSession.setPlaybackState(stateBuilder.build());

                MediaMetadataCompat.Builder metaBuilder = new MediaMetadataCompat.Builder()
                    .putString(MediaMetadataCompat.METADATA_KEY_TITLE, displayTitle)
                    .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, displaySinger)
                    .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, "छठ महापर्व 2026");

                if (cachedThumbnail != null) {
                    metaBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, cachedThumbnail);
                    metaBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_DISPLAY_ICON, cachedThumbnail);
                }
                mediaSession.setMetadata(metaBuilder.build());
            }

            // Intent to open app when tapping notification body
            Intent openIntent = new Intent(this, MainActivity.class);
            openIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            int flags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                : PendingIntent.FLAG_UPDATE_CURRENT;
            PendingIntent openPendingIntent = PendingIntent.getActivity(this, 0, openIntent, flags);

            // Previous Action Intent (Broadcast)
            Intent prevIntent = new Intent(this, MediaActionReceiver.class);
            prevIntent.setAction(ACTION_PREV);
            PendingIntent prevPendingIntent = PendingIntent.getBroadcast(this, 1, prevIntent, flags);

            // Play/Pause Action Intent (Broadcast)
            Intent playPauseIntent = new Intent(this, MediaActionReceiver.class);
            playPauseIntent.setAction(ACTION_PLAY_PAUSE);
            PendingIntent playPausePendingIntent = PendingIntent.getBroadcast(this, 2, playPauseIntent, flags);

            // Next Action Intent (Broadcast)
            Intent nextIntent = new Intent(this, MediaActionReceiver.class);
            nextIntent.setAction(ACTION_NEXT);
            PendingIntent nextPendingIntent = PendingIntent.getBroadcast(this, 3, nextIntent, flags);

            int playPauseIcon = isPlaying ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(displayTitle)
                .setContentText(displaySinger)
                .setSubText("छठ महापर्व")
                .setContentIntent(openPendingIntent)
                .setOngoing(isPlaying)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .addAction(android.R.drawable.ic_media_previous, "Previous", prevPendingIntent)
                .addAction(playPauseIcon, isPlaying ? "Pause" : "Play", playPausePendingIntent)
                .addAction(android.R.drawable.ic_media_next, "Next", nextPendingIntent);

            if (cachedThumbnail != null) {
                builder.setLargeIcon(cachedThumbnail);
            }

            if (mediaSession != null) {
                builder.setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                    .setMediaSession(mediaSession.getSessionToken())
                    .setShowActionsInCompactView(0, 1, 2));
            }

            Notification notification = builder.build();

            // Run Foreground Service when playing to guarantee process is never throttled or suspended
            if (isPlaying) {
                Intent serviceIntent = new Intent(this, MediaPlaybackService.class);
                serviceIntent.setAction(MediaPlaybackService.ACTION_START);
                serviceIntent.putExtra("notification", notification);
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        startForegroundService(serviceIntent);
                    } else {
                        startService(serviceIntent);
                    }
                } catch (Exception e) {
                    NotificationManagerCompat.from(this).notify(NOTIFICATION_ID, notification);
                }
            } else {
                NotificationManagerCompat.from(this).notify(NOTIFICATION_ID, notification);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void hideMediaNotification() {
        try {
            NotificationManagerCompat.from(this).cancel(NOTIFICATION_ID);
        } catch (Exception ignored) {}

        try {
            Intent serviceIntent = new Intent(this, MediaPlaybackService.class);
            serviceIntent.setAction(MediaPlaybackService.ACTION_STOP);
            startService(serviceIntent);
        } catch (Exception ignored) {}

        if (mediaSession != null) {
            try {
                mediaSession.setActive(false);
            } catch (Exception ignored) {}
        }

        releaseWakeLock();
    }

    private void acquireWakeLock() {
        if (wakeLock == null) {
            try {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                if (pm != null) {
                    wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ChhathApp:BackgroundAudioLock");
                    wakeLock.acquire(30 * 60 * 1000L); // 30 minutes buffer
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
            } catch (Exception ignored) {}
            wakeLock = null;
        }
    }

    // ==========================================
    // BROADCAST RECEIVER FOR MEDIA CONTROLS
    // ==========================================
    public static class MediaActionReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent == null) return;
            String action = intent.getAction();
            if (sInstance != null && action != null) {
                sInstance.handleMediaAction(action);
            }
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
        } catch (Exception ignored) {}
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
        } catch (Exception ignored) {}
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.resumeTimers();
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void onDestroy() {
        hideMediaNotification();
        if (mediaSession != null) {
            try {
                mediaSession.release();
            } catch (Exception ignored) {}
            mediaSession = null;
        }
        sInstance = null;
        super.onDestroy();
    }
}
