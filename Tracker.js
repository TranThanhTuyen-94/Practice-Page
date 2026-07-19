// ====== tracker.js — DÙNG CHUNG cho mọi file bài học độc lập (Lớp luyện đề, Ngữ pháp cơ bản...) ======
//
// CÁCH DÙNG trong file bài học hằng ngày:
// 1. Thêm 1 dòng ở đầu file (trong <head> hoặc trước </body> đều được):
//      <script src="../tracker.js"></script>
//    (đường dẫn "../" vì file bài học nằm trong thư mục con, vd lopluyende/)
//
// 2. Ở đúng chỗ học viên bấm "Hoàn thành" bài (nút tường minh, KHÔNG tự động),
//    gọi hàm này, truyền vào bao nhiêu điểm/thông tin tùy bài:
//      logActivity({ theory: '9/9', grammar: '8/9', vocab: '10/10' });
//    Tracker sẽ tự gói lại cùng Mã HV / Tên HV / Ngày rồi gửi lên hệ thống —
//    không cần biết gì thêm về backend.

(function () {
  const params  = new URLSearchParams(window.location.search);
  const ma      = params.get('ma')     || '';
  const ten     = params.get('ten')    || '';
  const loai    = params.get('loai')   || '';
  const bai     = params.get('bai')    || '';
  const apiUrl  = params.get('apiUrl') || '';

  window.logActivity = function (diem) {
    if (!apiUrl) { console.warn('tracker.js: thiếu apiUrl trên URL, không ghi được hoạt động.'); return; }
    if (!ma)     { console.warn('tracker.js: thiếu mã học viên trên URL, không ghi được hoạt động.'); return; }
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'logActivity', maHV: ma, tenHV: ten, loai: loai, bai: bai, diem: diem || {} })
    }).catch(function (err) { console.warn('tracker.js: lỗi gửi hoạt động:', err); });
  };
})();