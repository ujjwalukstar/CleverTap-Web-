self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[CleverTap Service Worker] Push Subscription Change", event)

  // Handle subscription renewal
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true }).then((subscription) => {
      console.log("[CleverTap Service Worker] New subscription:", subscription)
      // Here you would typically send the new subscription to your server
      // but CleverTap handles this automatically
    }),
  )
})

self.addEventListener("install", (event) => {
  console.log("[CleverTap Service Worker] Installed")
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  console.log("[CleverTap Service Worker] Activated")
  event.waitUntil(self.clients.claim())
})

self.addEventListener("push", (event) => {
  console.log("[CleverTap Service Worker] Push Received:", event)
  let data = {}

  if (event.data) {
    try {
      data = event.data.json()
      console.log("[CleverTap Service Worker] Push data:", data)
    } catch (e) {
      console.error("[CleverTap Service Worker] Error parsing push data:", e)
      data = { title: "CleverTap Notification", body: "You have a new notification!" }
    }
  }

  const title = data.title || "CleverTap Notification"
  const options = {
    body: data.body || "You have a new notification!",
    icon: "/icon.png",
    badge: "/badge.png",
    data: data,
    // Add required tag for authentication
    tag: "clevertap-notification",
    // Ensure notifications require interaction
    requireInteraction: true,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  console.log("[CleverTap Service Worker] Notification click Received:", event)
  event.notification.close()

  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "/"
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === url && "focus" in clientList[i]) {
          return clientList[i].focus()
        }
      }
      return clients.openWindow(url)
    }),
  )
})
