self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installed');
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activated');
    event.waitUntil(self.clients.claim());
  });
  
  self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received:', event);
    let data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        console.error('[Service Worker] Error parsing push data:', e);
      }
    }
  
    const title = data.title || 'CleverTap Notification';
    const options = {
      body: data.body || 'You have a new notification!',
      icon: '/icon.png', // Optional: Add an icon to your repository
      badge: '/badge.png' // Optional: Add a badge to your repository
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received:', event);
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('https://your-github-repo.github.io') // Replace with your GitHub Pages URL
    );
  });