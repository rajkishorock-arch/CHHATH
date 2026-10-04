package com.chhath.app;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

public class MediaPlaybackService extends Service {
    public static final String ACTION_START = "com.chhath.app.START_MEDIA_SERVICE";
    public static final String ACTION_PAUSE = "com.chhath.app.PAUSE_MEDIA_SERVICE";
    public static final String ACTION_STOP = "com.chhath.app.STOP_MEDIA_SERVICE";

    private static boolean sIsPlaying = false;

    public static boolean isPlaying() {
        return sIsPlaying;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
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
            } else if (ACTION_PAUSE.equals(action)) {
                sIsPlaying = false;
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
        try {
            stopForeground(true);
        } catch (Exception ignored) {}
        super.onDestroy();
    }
}
