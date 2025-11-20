const CACHE_NAME = 'ads-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/pages/LoginPage.tsx',
  '/pages/DashboardPage.tsx',
  '/pages/FileNewPage.tsx',
  '/pages/ProfilePage.tsx',
  '/pages/HistoryPage.tsx',
  '/pages/FaqPage.tsx',
  '/pages/ResourcesPage.tsx',
  '/pages/PaymentPage.tsx',
  '/pages/WhistleblowingPage.tsx',
  '/pages/ContactPage.tsx',
  '/components/Header.tsx',
  '/components/DashboardCard.tsx',
  '/components/DeclarationRow.tsx',
  '/components/ProgressBar.tsx',
  '/components/Modal.tsx',
  '/components/icons/LogoIcon.tsx',
  '/components/icons/DashboardIcon.tsx',
  '/components/icons/FileIcon.tsx',
  '/components/icons/HistoryIcon.tsx',
  '/components/icons/ProfileIcon.tsx',
  '/components/icons/LogoutIcon.tsx',
  '/components/icons/BellIcon.tsx',
  '/components/icons/PlusIcon.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/icons/CheckIcon.tsx',
  '/components/icons/CameraIcon.tsx',
  '/components/icons/QuestionMarkCircleIcon.tsx',
  '/components/icons/BookOpenIcon.tsx',
  '/components/icons/CreditCardIcon.tsx',
  '/components/icons/MegaphoneIcon.tsx',
  '/components/icons/ChevronDownIcon.tsx',
  '/components/icons/DocumentIcon.tsx',
  '/components/icons/MailIcon.tsx',
  '/components/icons/PaperClipIcon.tsx',
  '/components/icons/XIcon.tsx',
  '/components/icons/PngLogoIcon.tsx',
  'https://cdn.tailwindcss.com',
  'https://rsms.me/inter/inter.css',
  'https://picsum.photos/100',
  'https://www.acc.org.bt/wp-content/uploads/2021/08/ACC-Location.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});