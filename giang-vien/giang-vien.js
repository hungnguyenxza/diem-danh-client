let formDataToFieldLectureMapping = Object.freeze({
  'txtId': 'LectureID',
  'txtName': 'Name',
  'txtPhone': 'Phone',
  'txtBirth': 'Birthday',
  'txtJoinAt': 'JoinAt',
  'txtDescription': 'Description',
  'txtEmail': 'Email',
});

generateMenuBar('.menu-bar', menuBarComponent.giangVien);

async function getAllLectures() {
  try {
    loading.startFetching();
    let res = await fetch(apiServer + "/get-lectures");
    let data = await res.json();
    console.log(data);
    $('#dataListLectures').html('');
    $.each(data, function (i, lecture) {
      let r = $.trim($('#rowListLecture').html());
      r = r.replace(/{stt}/g, i + 1)
        .replace(/{name}/g, lecture.Name)
        .replace(/{phone}/g, lecture.Phone)
        .replace(/{birth}/g, moment(lecture.Birthday).format('DD/MM/YYYY'))
        .replace(/{email}/g, lecture.Email)
        .replace(/{role}/g, lecture.RoleName)
        .replace(/{joinAt}/g, moment(lecture.JoinAt).format('DD/MM/YYYY'))
        .replace(/{desc}/g, lecture.Description)
        .replace(/{action}/g, generateActionButton(lecture))
        ;
      $('#dataListLectures').append(r);
    });
  } catch (err) {
    console.log(err);
  }
  loading.stopFetching();
}

function generateActionButton(lecture) {
  let s = `
    <button type="button" class="btn btn-sm btn-success" onclick="onEditLecture('${lecture.LectureID}')">Sửa</button>  
    <button type="button" class="btn btn-sm btn-danger" onclick="onDeleteLecture('${lecture.LectureID}')">Xóa</button>  
  `;
  return s;
}

function onEditLecture(id) {
  loading.startFetching();
  $.ajax({
    url: apiServer + '/get-lecture-by-id',
    type: 'post',
    dataType: 'json',
    data: {
      id: id
    },
    success: function (data) {
      if (data) {
        $('#editLecture').modal('show');
        Object.keys(formDataToFieldLectureMapping).forEach(k => {
          $('form#frmEditLecture [name="' + k + '"]').val(data[formDataToFieldLectureMapping[k]]);
        });
        $('form#frmEditLecture #txtBirth').datepicker('setDate', moment(data.Birthday).format('DD/MM/YYYY'));
        $('form#frmEditLecture #txtJoinAt').datepicker('setDate', moment(data.JoinAt).format('DD/MM/YYYY'));
        $('form#frmEditLecture #txtRole').val(data.RoleType);
      }
    },
    complete: function () {
      loading.stopFetching();
    }
  })
}

$('form#frmEditLecture').submit(function (e) {
  e.preventDefault();
  let fields = $(this).serializeArray();
  let lecture = { RoleType: parseInt($(this).find('#txtRole').val()) };
  $.each(fields, function (i, field) {
    if (formDataToFieldLectureMapping.hasOwnProperty(field.name)) {
      lecture[formDataToFieldLectureMapping[field.name]] = field.value;
    }
  });
  console.log(lecture);
  loading.startFetching();
  $.ajax({
    url: apiServer + '/edit-lecture',
    type: 'post',
    dataType: 'json',
    data: lecture,
    success: function (data) {
      if (data.isSuccess) {
        toastr.success(data.message);
        $('#editLecture').modal('hide');
        getAllLectures();
      } else {
        toastr.error(data.message);
      }
    },
    complete: function () {
      loading.stopFetching();
    }
  })

})

function onDeleteLecture(id) {
  utilities.confirmDelete("Cảnh báo", "Bạn có muốn xóa giảng viên này?").then(function (result) {
    if (result.value) {
      loading.startFetching();
      $.ajax(
        {
          url: apiServer + "/delete-lecture-by-id",
          type: 'post',
          dataType: 'json',
          data: {
            id: id,
          },
          success: function (data) {
            if (data.isSuccess) {
              toastr.success(data.message);
              getAllLectures();
            } else {
              toastr.error(data.message);
            }
          },
          complete: function () {
            loading.stopFetching();
          }
        }
      )
    }
  });
}

function addNewLecture() {
  $('#addLecture').modal('show');
}
getAllLectures();

$('form#frmAddLecture').submit(function (e) {
  e.preventDefault();
  let fields = $(this).serializeArray();
  let lecture = { RoleType: 1 };
  $.each(fields, function (i, field) {
    if (formDataToFieldLectureMapping.hasOwnProperty(field.name)) {
      lecture[formDataToFieldLectureMapping[field.name]] = field.value;
    }
  });
  loading.startFetching();
  $.ajax({
    type: 'post',
    url: apiServer + '/add-lecture',
    data: lecture,
    dataType: 'json',
    success: function (data) {
      if (data) {
        if (data.isSuccess) {
          toastr.success(data.message);
          $('#addLecture').modal('hide');
          getAllLectures();
        } else {
          toastr.error(data.message);
        }
      } else {
        toastr.info("Vui lòng thử lại sau.");
      }
    },
    complete: function () {
      loading.stopFetching();
    }
  })
})

function getAllRoles() {
  $.ajax({
    url: apiServer + '/get-all-roles',
    type: 'get',
    dataType: 'json',
    success: function (data) {
      if (data) {
        $.each(data, function (i, value) {
          $('form #txtRole').append(`<option value="${value.RoleID}">${value.RoleName}</option>`);
        });
      }
    }
  })
}
getAllRoles();
$(document).ready(function () {
  $('.date-picker').datepicker({
    format: "dd/mm/yyyy",
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
  });
  $('#addLecture').on('shown.bs.modal', function (e) {
    $('#frmAddLecture')[0].reset();
  });
})
