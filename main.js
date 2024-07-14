if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('invacker-sw.js')
      .then(registration => console.log('Service Worker registered: ', registration.scope))
      .catch(err => console.error('Service Worker registration failed: ', err));
  });
}
