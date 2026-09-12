// Smart Notifications Engine for Chhath Mahaparv
// Strictly permission-based: NEVER sends alerts without explicit user consent

export async function requestChhathNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    alert('आपके ब्राउज़र में नोटिफिकेशन सुविधा समर्थित नहीं है।');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendChhathNotification(title: string, body: string, icon: string = '/favicon.ico') {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function scheduleArghyaReminder(ritualName: string, city: string, timeStr: string) {
  const granted = await requestChhathNotificationPermission();
  if (granted) {
    sendChhathNotification(
      `छठ अलर्ट: ${ritualName} (${city})`,
      `अर्घ्य समय: ${timeStr}। कृपया समय से 30 मिनट पूर्व पवित्र घाट पर पहुंचें। जय छठी मईया 🙏`
    );
    return true;
  }
  return false;
}
