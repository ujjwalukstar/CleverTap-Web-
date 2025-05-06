self.addEventListener('install', function(event) {
  console.log('[CleverTap Service Worker] Installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  console.log('[CleverTap Service Worker] Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('[CleverTap Service Worker] Push Received:', event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('[CleverTap Service Worker] Error parsing push data:', e);
      data = { title: 'CleverTap Notification', body: 'You have a new notification!' };
    }
  }

  const title = data.title || 'CleverTap Notification';
  const options = {
    body: data.body || 'You have a new notification!',
    icon: '/icon.png', // Optional: Add an icon to your repository
    badge: '/badge.png', // Optional: Add a badge to your repository
    data: data // Include data for notification click handling
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[CleverTap Service Worker] Notification click Received:', event);
  event.notification.close();

  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : 'https://clevertap-five.vercel.app';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === url && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});