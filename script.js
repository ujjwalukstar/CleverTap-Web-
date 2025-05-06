// Declare clevertap variable (assuming it's globally available or will be initialized elsewhere)
var clevertap = window.clevertap || {}

// Enable verbose logging for CleverTap
sessionStorage["WZRK_D"] = ""
console.log("Verbose logging enabled for CleverTap")

// Register service worker
function initializeServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/clevertap_sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope)
        // Initialize CleverTap notifications after service worker is registered
        if (typeof clevertap !== "undefined" && clevertap.notifications) {
          clevertap.notifications.push({
            serviceWorker: registration,
            scope: registration.scope,
          })
          console.log("CleverTap notifications initialized with service worker")
        }
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error)
      })
  } else {
    console.warn("Service workers are not supported in this browser")
  }
}

function validateForm() {
  let isValid = true
  const name = document.getElementById("name").value.trim()
  const email = document.getElementById("email").value.trim()
  const phone = document.getElementById("phone").value.trim()
  const dob = document.getElementById("dob").value

  // Name validation
  if (name.length < 2) {
    document.getElementById("nameError").style.display = "block"
    isValid = false
    console.log("Validation failed: Name must be at least 2 characters")
  } else {
    document.getElementById("nameError").style.display = "none"
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").style.display = "block"
    isValid = false
    console.log("Validation failed: Invalid email format")
  } else {
    document.getElementById("emailError").style.display = "none"
  }

  // Phone validation
  const phoneRegex = /^\+\d{10,15}$/
  if (!phoneRegex.test(phone)) {
    document.getElementById("phoneError").style.display = "block"
    isValid = false
    console.log("Validation failed: Phone must start with + and have 10-15 digits")
  } else {
    document.getElementById("phoneError").style.display = "none"
  }

  // DOB validation
  if (!dob) {
    document.getElementById("dobError").style.display = "block"
    isValid = false
    console.log("Validation failed: DOB is required")
  } else {
    document.getElementById("dobError").style.display = "none"
  }

  return isValid
}

function handleLogin() {
  if (!validateForm()) {
    console.log("Form validation failed")
    alert("Please fix form errors")
    return
  }

  const name = document.getElementById("name").value.trim()
  const email = document.getElementById("email").value.trim()
  const phone = document.getElementById("phone").value.trim()
  const dob = new Date(document.getElementById("dob").value)

  if (typeof clevertap !== "undefined") {
    clevertap.onUserLogin.push({
      Site: {
        Name: name,
        Email: email,
        Phone: phone,
        DOB: dob,
      },
    })
    console.log("Login data sent to CleverTap:", { Name: name, Email: email, Phone: phone, DOB: dob })
    alert("Login successful!")
  } else {
    console.error("CleverTap SDK not initialized")
    alert("Error: CleverTap SDK not loaded")
  }
}

function handleProfilePush() {
  if (!validateForm()) {
    console.log("Form validation failed")
    alert("Please fix form errors")
    return
  }

  const name = document.getElementById("name").value.trim()
  const email = document.getElementById("email").value.trim()
  const phone = document.getElementById("phone").value.trim()
  const dob = new Date(document.getElementById("dob").value)

  if (typeof clevertap !== "undefined") {
    clevertap.profile.push({
      Site: {
        Name: name,
        Email: email,
        Phone: phone,
        DOB: dob,
      },
    })
    console.log("Profile data pushed to CleverTap:", { Name: name, Email: email, Phone: phone, DOB: dob })
    alert("Profile updated!")
  } else {
    console.error("CleverTap SDK not initialized")
    alert("Error: CleverTap SDK not loaded")
  }
}

function handleEvent() {
  if (!validateForm()) {
    console.log("Form validation failed")
    alert("Please fix form errors")
    return
  }

  const name = document.getElementById("name").value.trim()
  const eventTime = new Date()
  const randomInteger = Math.floor(Math.random() * 100)
  const randomFloat = Number.parseFloat((Math.random() * 100).toFixed(2))

  if (typeof clevertap !== "undefined") {
    clevertap.event.push("CustomEvent", {
      EventTime: eventTime,
      UserName: name,
      RandomInteger: randomInteger,
      RandomFloat: randomFloat,
    })
    console.log("Custom event raised in CleverTap:", {
      EventTime: eventTime,
      UserName: name,
      RandomInteger: randomInteger,
      RandomFloat: randomFloat,
    })
    alert("Event raised!")
  } else {
    console.error("CleverTap SDK not initialized")
    alert("Error: CleverTap SDK not loaded")
  }
}

function askForPush() {
  if (typeof clevertap === "undefined") {
    console.error("CleverTap SDK not initialized")
    alert("Error: CleverTap SDK not loaded")
    return
  }

  // Check browser support for push notifications
  if (!("PushManager" in window)) {
    console.warn("Push notifications not supported in this browser")
    alert("Push notifications are not supported in this browser. Please try Chrome or Firefox.")
    return
  }

  try {
    clevertap.notifications.push({
      titleText: "Would you like to receive Push Notifications?",
      bodyText: "We promise to only send you relevant content and give you updates on your transactions",
      okButtonText: "Sign me up!",
      rejectButtonText: "No thanks",
      askAgainTimeInSeconds: 5,
      okButtonColor: "#f28046",
    })
    console.log("Push notification permission requested")
  } catch (error) {
    console.error("Error requesting push notification permission:", error)
    alert("Error: Failed to request push notifications. Check console for details.")
  }
}
// Initialize CleverTap properly
window.clevertap = {event:[], profile:[], account:[], onUserLogin:[], notifications:[], privacy:[]};
clevertap.account.push({'id': 'Z44-Z4K-K65Z'});

// Load CleverTap SDK
var wzrk = document.createElement('script');
wzrk.type = 'text/javascript';
wzrk.async = true;
wzrk.src = ('https:' == document.location.protocol ? 'https://d2r1yp2w7bby2u.cloudfront.net' : 'http://static.clevertap.com') + '/js/a.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wzrk, s);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/clevertap_sw.js')
        .then(registration => {
            clevertap.notifications.push({
                "apnsWebPushId": "web.com.yourdomain",
                "apnsWebPushServiceUrl": "https://push.service.com"
            });
        });
}

// Event Listeners
document.getElementById('login').addEventListener('click', handleLogin);
document.getElementById('profilePush').addEventListener('click', handleProfilePush);
document.getElementById('raiseEvent').addEventListener('click', handleEvent);
document.getElementById('askPush').addEventListener('click', askForPush);

// Rest of your existing functions (validateForm, handleLogin, etc.) remain unchanged
// Keep all your existing validation and handler functions as they are correct
