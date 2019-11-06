var Scrollbar = window.Scrollbar;
let formDataToFieldClassMapping = Object.freeze({
  'txtIdLop': 'id',
  'txtTenLop': 'name',
  'txtGVLop': 'teachers',
  'txtTGLop': 'mentors',
  'txtStartDateLop': 'startDate',
  'txtEndDateLop': 'endDate',
  'txtSalaryLop': 'salary',
});

let isEdit = false;
let currentLopHoc = undefined;

generateMenuBar('.menu-bar', menuBarComponent.danhSachLop);

$('form#themLopDay').submit(function (e) {
  e.preventDefault();
  let fields = $(this).serializeArray();
  if (!isEdit) {
    let lopHoc = { date: [], schedule: getListTimeClass() };
    $.each(fields, function (i, field) {
      if (formDataToFieldClassMapping.hasOwnProperty(field.name)) {
        lopHoc[formDataToFieldClassMapping[field.name]] = field.value;
      }
    });
    $.ajax({
      url: apiServer + '/add-lop-hoc',
      type: 'post',
      dataType: 'json',
      data: lopHoc,
      success: function (data) {
        if (data) {
          if (data.isSuccess) {
            toastr.success(data.message);
            $('#themLop').modal('hide');
            getAllDanhSachLop();
          } else {
            toastr.error(data.message);
          }
        } else {
          toastr.info("Vui lòng thử lại sau.");
        }
      },
      error: function (err) {
        toastr.error('Có lỗi, xin thử lại sau');
      }
    });
  } else {
    $.each(fields, function (i, field) {
      if (formDataToFieldClassMapping.hasOwnProperty(field.name)) {
        currentLopHoc[formDataToFieldClassMapping[field.name]] = field.value;
      }
    });
    currentLopHoc.schedule = getListTimeClass();
    $.ajax({
      url: apiServer + '/update-lop-hoc',
      type: 'post',
      dataType: 'json',
      data: currentLopHoc,
      success: function (data) {
        if (data) {
          if (data.isSuccess) {
            toastr.success(data.message);
            $('#themLop').modal('hide');
            getAllDanhSachLop();
          } else {
            toastr.error(data.message);
          }
        } else {
          toastr.info("Vui lòng thử lại sau.");
        }
      },
      error: function (err) {
        toastr.error('Có lỗi, xin thử lại sau');
      }
    });
  }
});

function maxLengthData(value) {
  value = value || '';
  let max = 30;
  return value.length > max ? (value.substr(0, max) + '...') : value;
}

function getAllDanhSachLop() {
  $.ajax({
    url: apiServer + "/get-lop-hoc",
    type: 'get',
    dataType: 'json',
    success: function (data) {
      $('#dataDSLopHoc').html('');
      $.each(data, function (i, lopHoc) {
        let r = $.trim($('#rowDanhSachLopHoc').html());
        r = r.replace(/{stt}/g, i + 1)
          .replace(/{id}/g, lopHoc.id)
          .replace(/{name}/g, lopHoc.name)
          .replace(/{giangvien}/g, lopHoc.teachers)
          .replace(/{trogiang}/g, lopHoc.mentors)
          .replace(/{lichday}/g, maxLengthData(getTextTimeClass(lopHoc.schedule)))
          .replace(/{lichday-title}/g, getTextTimeClass(lopHoc.schedule))
          .replace(/{periodtime}/g, lopHoc.startDate + ' - ' + lopHoc.endDate)
          .replace(/{action}/g, getActionDSLop(lopHoc))
          ;
        $('#dataDSLopHoc').append(r);
      });
    }
  });
}
getAllDanhSachLop();

$(document).on('click', '#list-time-class td div.time-circle', function () {
  $(this).find('input[type="checkbox"]').each(function () {
    $(this).prop("checked", !$(this).prop("checked")).trigger('change');
  })
});
$(document).on('change', '#list-time-class td input[type="checkbox"]', function () {
  if ($(this).is(":checked")) {
    $(this).closest('div').addClass('time-actived');
  } else {
    $(this).closest('div').removeClass('time-actived');
  }
  getAndDisplayTimeClass();
})

function clearAllTimes() {
  $('#list-time-class td input[type="checkbox"]').each(function () {
    $(this).prop('checked', false).trigger('change');
  });
}

function getListTimeClass() {
  function defaultTime() {
    return {
      'date': '',
      'time': ''
    };
  }
  let timeClass = [];
  $('#list-time-class td input[type="checkbox"]').each(function () {
    if ($(this).is(":checked")) {
      let time = defaultTime();
      let split = $(this).val().split('_');
      time.date = split[0];
      time.time = split[1];
      timeClass.push(time);
    }
  });
  timeClass = timeClass.sort(function (a, b) {
    if (a.date === 'CN' && b.date === 'CN') {
      let n1 = a.time === 'S' ? 0 : (a.time === 'C' ? 1 : 2);
      let n2 = b.time === 'S' ? 0 : (b.time === 'C' ? 1 : 2);
      if (n1 >= n2) return 1;
      else return -1;
    } else if (a.date === 'CN') {
      return -1;
    } else if (b.date === 'CN') {
      return 1;
    } else {
      return parseInt(a.date) - parseInt(b.date) >= 0 ? 1 : -1;
    }
  });
  return timeClass;
}
function getAndDisplayTimeClass() {
  displayTimeClass(getListTimeClass());
}

function getTextTimeClass(timeClass) {
  let data = [];
  if (timeClass instanceof Array) {
    timeClass.forEach(time => {
      let sTime = time.time === 'S' ? 'Sáng' : (time.time === 'C' ? 'Chiều' : 'Tối');
      let sDate = time.date === 'CN' ? 'CN' : 'T' + time.date;
      let s = sTime + " " + sDate;
      data.push(s);
    });
  }
  return data.join(', ');
}
function displayTimeClass(timeClass) {
  let $block = $('#time-class');
  let data = getTextTimeClass(timeClass);
  $block.html(data);
}

function getActionDSLop(lopHoc) {
  let s = `
    <button type="button" class="btn btn-sm btn-success" onclick="onEditLopHoc('${lopHoc.id}')">Sửa</button>  
    <button type="button" class="btn btn-sm btn-danger" onclick="onDeleteLopHoc('${lopHoc.id}')">Xóa</button>  
  `;
  return s;
}

function onEditLopHoc(lopHocId) {
  $.ajax({
    url: apiServer + '/get-lop-hoc-by-id',
    type: 'post',
    data: {
      id: lopHocId
    },
    dataType: 'json',
    success: function (data) {
      if (data) {
        currentLopHoc = data;
        isEdit = true;
        $('#themLop').modal('show');
        Object.keys(formDataToFieldClassMapping).forEach(k => {
          $('form#themLopDay input[name="' + k + '"]').val(data[formDataToFieldClassMapping[k]]);
        });
        showScheduleClass(currentLopHoc.schedule);
      }
    },
    error: function (err) {

    }
  });
}

function onDeleteLopHoc(lopHocId) {
  utilities.confirmDelete("Cảnh báo", "Bạn có muốn xóa lớp này?").then(function (result) {
    if (result.value) {
      $.ajax({
        url: apiServer + '/delete-lop-hoc',
        type: 'post',
        dataType: 'json',
        data: { id: lopHocId },
        success: function (data){
          if(data){
            if (data.isSuccess) {
              toastr.success(data.message);
              $('#themLop').modal('hide');
              getAllDanhSachLop();
            } else {
              toastr.error(data.message);
            }
          } else {
            toastr.info("Vui lòng thử lại sau.");
          }
        }
      })
    }
  })
}

function preparaForUpdate(lopHoc) {
  $('#themLopLabel').text('Thông tin lớp: ' + lopHoc.id);
}

function showScheduleClass(schedules) {
  new Promise(function (resolve, reject) {
    clearAllTimes();
    resolve();
  }).then(function () {
    if (schedules) {
      schedules.forEach(s => {
        $(`form#themLopDay input[type='checkbox'][value='${s.date}_${s.time}']`).closest('div').trigger('click');
      });
    }
  })
}

$(document).ready(function () {
  $('.date-picker').datepicker({
    format: "dd/mm/yyyy",
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
  });
  $('#themLop').on('shown.bs.modal', function (e) {
    if (!isEdit) {
      $('#themLopDay')[0].reset();
      clearAllTimes();
    }
  });
  $('#themLop').on('hidden.bs.modal', function (e) {
    isEdit = false;
    currentLopHoc = undefined;
  });
});
