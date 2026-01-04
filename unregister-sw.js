// Run this in browser console to unregister service workers
(async function() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`Found ${registrations.length} service worker(s)`);
    
    for (let registration of registrations) {
      const result = await registration.unregister();
      console.log('Unregistered:', result);
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Caches cleared:', cacheNames);
    }
    
    console.log('Done! Hard refresh (Cmd+Shift+R or Ctrl+Shift+R) to see changes.');
  }
})();
