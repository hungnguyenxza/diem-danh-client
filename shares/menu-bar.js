let menuBarComponent = Object.freeze({
  'diemDanh': 'diem-danh',
  'danhSachLop': 'danh-sach-lop',
  'thongKe': 'thong-ke',
  'giangVien': 'giang-vien'
});

function generateMenuBar(target, active){
  if(Object.values(menuBarComponent).some(e => e === active)){
    let getUrl = window.location;
    $.get(getUrl.protocol + "//" + getUrl.host + '/shares/menu-bar.html', function(html){
      $(target).html(html);
      $(target).find('a[data-ref="'+active+'"]').addClass('active');
    });
  }
}