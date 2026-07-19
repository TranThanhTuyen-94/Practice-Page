// ====== sw.js — Service Worker tối thiểu cho PWA "app.html" ======
// Chỉ đủ để trình duyệt coi đây là PWA hợp lệ (điều kiện bắt buộc để hiện nút
// "Cài đặt / Thêm vào màn hình chính"). Không cache gì đặc biệt — mọi request
// vẫn đi thẳng ra mạng như bình thường, vì app cần dữ liệu mới liên tục từ
// Apps Script (không hợp để dùng bản cache cũ).

const CACHE_NAME = 'english-practice-shell-v1';
const SHELL_FILES = ['app.html', 'style.css'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: luôn ưu tiên tải mới nhất, chỉ dùng cache khi mất mạng hoàn toàn
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
