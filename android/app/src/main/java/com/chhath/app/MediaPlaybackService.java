package com.chhath.app;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

public class MediaPlaybackService extends Service {
    public static final String ACTION_START = "com.chhath.app.START_MEDIA_SERVICE";
    public static final String ACTION_STOP = "com.chhath.app.STOP_MEDIA_SERVICE";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_START.equals(action)) {
                Notification notification = null;
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        notification = intent.getParcelableExtra("notification", Notification.class);
                    } else {
                        notification = intent.getParcelableExtra("notification");
                    }
                } catch (Exception e) {
                    try {
                        notification = intent.getParcelableExtra("notification");
                    } catch (Exception ignored) {}
                }

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
            } else if (ACTION_STOP.equals(action)) {
                try {
                    stopForeground(true);
                    stopSelf();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        try {
            stopForeground(true);
        } catch (Exception ignored) {}
        super.onDestroy();
    }
}
