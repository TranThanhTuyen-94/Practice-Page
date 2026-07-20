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

// Network-first cho ĐÚNG file thuộc app (cùng origin) — luôn ưu tiên tải mới nhất,
// chỉ dùng cache khi mất mạng hoàn toàn.
//
// QUAN TRỌNG: request ra NGOÀI origin (vd gọi Apps Script script.google.com, hay
// Drive googleapis.com) phải được BỎ QUA hoàn toàn, để trình duyệt tự xử lý như
// bình thường. Apps Script trả về qua 1 bước redirect 302 sang URL tạm của Google —
// nếu Service Worker chặn ngang để tự fetch lại, kiểu redirect chéo-domain này dễ
// biến thành phản hồi rỗng/không đọc được, khiến gọi API bị sai kết quả (đây chính
// là nguyên nhân tìm học viên không ra trên bản PWA).
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // để mặc trình duyệt tự xử lý
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
