package com.chhath.app;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Build;
import android.os.IBinder;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class MediaPlaybackService extends Service {
    public static final String ACTION_START = "com.chhath.app.START_MEDIA_SERVICE";
    public static final String ACTION_PAUSE = "com.chhath.app.PAUSE_MEDIA_SERVICE";
    public static final String ACTION_STOP = "com.chhath.app.STOP_MEDIA_SERVICE";

    private static boolean sIsPlaying = false;
    private AudioTrack silentAudioTrack = null;
    private Thread audioThread = null;
    private volatile boolean isAudioRunning = false;
    private ScheduledExecutorService watchdogExecutor = null;
    private AudioManager audioManager = null;
    private AudioManager.OnAudioFocusChangeListener audioFocusChangeListener = null;

    public static boolean isPlaying() {
        return sIsPlaying;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        audioFocusChangeListener = focusChange -> {
            if (focusChange == AudioManager.AUDIOFOCUS_LOSS || focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().handleMediaAction(MainActivity.ACTION_PLAY_PAUSE);
                }
            }
        };
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_START.equals(action)) {
                sIsPlaying = true;
                Notification notification = extractNotification(intent);
                if (notification != null) {
                    try {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            startForeground(MainActivity.NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
                        } else {
                            startForeground(MainActivity.NOTIFICATION_ID, notification);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                requestAudioFocus();
                startNativeAudioKeepAlive();
                startWatchdog();
            } else if (ACTION_PAUSE.equals(action)) {
                sIsPlaying = false;
                stopWatchdog();
                stopNativeAudioKeepAlive();
                abandonAudioFocus();

                Notification notification = extractNotification(intent);
                try {
                    // Detach from foreground so the notification can be manually swiped/slid away by user
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        stopForeground(STOP_FOREGROUND_DETACH);
                    } else {
                        stopForeground(false);
                    }
                    if (notification != null) {
                        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                        if (nm != null) {
                            nm.notify(MainActivity.NOTIFICATION_ID, notification);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (ACTION_STOP.equals(action)) {
                sIsPlaying = false;
                stopWatchdog();
                stopNativeAudioKeepAlive();
                abandonAudioFocus();
                try {
                    stopForeground(true);
                    NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                    if (nm != null) {
                        nm.cancel(MainActivity.NOTIFICATION_ID);
                    }
                    stopSelf();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return START_NOT_STICKY;
    }

    private void requestAudioFocus() {
        if (audioManager != null) {
            try {
                audioManager.requestAudioFocus(
                    audioFocusChangeListener,
                    AudioManager.STREAM_MUSIC,
                    AudioManager.AUDIOFOCUS_GAIN
                );
            } catch (Exception ignored) {}
        }
    }

    private void abandonAudioFocus() {
        if (audioManager != null) {
            try {
                audioManager.abandonAudioFocus(audioFocusChangeListener);
            } catch (Exception ignored) {}
        }
    }

    private void startNativeAudioKeepAlive() {
        if (isAudioRunning) return;
        isAudioRunning = true;
        audioThread = new Thread(() -> {
            try {
                int sampleRate = 44100;
                int bufferSize = AudioTrack.getMinBufferSize(
                    sampleRate,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT
                );
                if (bufferSize <= 0) bufferSize = 4096;

                AudioAttributes attrs = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build();

                AudioFormat format = new AudioFormat.Builder()
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .build();

                silentAudioTrack = new AudioTrack(
                    attrs,
                    format,
                    bufferSize,
                    AudioTrack.MODE_STREAM,
                    AudioManager.AUDIO_SESSION_ID_GENERATE
                );

                byte[] silentBuffer = new byte[bufferSize]; // PCM silence (all zeros)
                silentAudioTrack.play();

                while (isAudioRunning && silentAudioTrack != null) {
                    silentAudioTrack.write(silentBuffer, 0, silentBuffer.length);
                    try {
                        Thread.sleep(60);
                    } catch (InterruptedException ignored) {
                        break;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "ChhathAudioTrackKeepAlive");
        audioThread.setPriority(Thread.MAX_PRIORITY);
        audioThread.start();
    }

    private void stopNativeAudioKeepAlive() {
        isAudioRunning = false;
        if (audioThread != null) {
            audioThread.interrupt();
            audioThread = null;
        }
        if (silentAudioTrack != null) {
            try {
                silentAudioTrack.stop();
                silentAudioTrack.release();
            } catch (Exception ignored) {}
            silentAudioTrack = null;
        }
    }

    private void startWatchdog() {
        stopWatchdog();
        watchdogExecutor = Executors.newSingleThreadScheduledExecutor();
        watchdogExecutor.scheduleWithFixedDelay(() -> {
            try {
                if (sIsPlaying && MainActivity.getInstance() != null) {
                    MainActivity.getInstance().triggerKeepAlive();
                }
            } catch (Exception ignored) {}
        }, 1, 1, TimeUnit.SECONDS);
    }

    private void stopWatchdog() {
        if (watchdogExecutor != null) {
            try {
                watchdogExecutor.shutdownNow();
            } catch (Exception ignored) {}
            watchdogExecutor = null;
        }
    }

    private Notification extractNotification(Intent intent) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                return intent.getParcelableExtra("notification", Notification.class);
            } else {
                return intent.getParcelableExtra("notification");
            }
        } catch (Exception e) {
            try {
                return intent.getParcelableExtra("notification");
            } catch (Exception ignored) {
                return null;
            }
        }
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        // If app is closed from recent apps and song is not playing, dismiss notification immediately
        if (!sIsPlaying) {
            stopWatchdog();
            stopNativeAudioKeepAlive();
            abandonAudioFocus();
            try {
                stopForeground(true);
                NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                if (nm != null) {
                    nm.cancel(MainActivity.NOTIFICATION_ID);
                }
                stopSelf();
            } catch (Exception ignored) {}
        }
    }

    @Override
    public void onDestroy() {
        sIsPlaying = false;
        stopWatchdog();
        stopNativeAudioKeepAlive();
        abandonAudioFocus();
        try {
            stopForeground(true);
        } catch (Exception ignored) {}
        super.onDestroy();
    }
}
