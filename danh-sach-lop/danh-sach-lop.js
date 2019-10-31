
generateMenuBar('.menu-bar', menuBarComponent.danhSachLop);

$('form#themLopDay').submit(function (e){
  e.preventDefault();
  let fields = $(this).serializeArray();
  let lopHoc = {date: [], time: ''};
  $.each(fields, function (i, field){
    switch(field.name){
      case 'txtIdLop':
        lopHoc.id = field.value;
        break;
      case 'txtTenLop':
        lopHoc.name = field.value;
        break;
      case 'txtGVLop':
        lopHoc.teachers = field.value;
        break;
    }
  });
  $.ajax({
    url: apiServer + '/add-lop-hoc',
    type:'post',
    dataType: 'json',
    data: lopHoc,
    success: function(data){
      toastr.success("Thêm lớp thành công")
      $('#themLop').modal('hide');
      getAllDanhSachLop();
    },
    error: function(err){
      toastr.error('Có lỗi, xin thử lại sau');
    }
  });
});

function getAllDanhSachLop(){
  $.ajax({
    url: apiServer + "/get-lop-hoc",
    type:'get',
    dataType: 'json',
    success: function (data){
      $('#dataDSLopHoc').html('');
      $.each(data, function (i, lopHoc){
        let r = $.trim($('#rowDanhSachLopHoc').html());
        r = r.replace(/{stt}/g, i+1)
          .replace(/{id}/g, lopHoc.id)
          .replace(/{name}/g, lopHoc.name)
          .replace(/{giangvien}/g, lopHoc.teachers)
          .replace(/{thoigian}/g, new Date());
        $('#dataDSLopHoc').append(r);
      });
    }
  });
}
getAllDanhSachLop();