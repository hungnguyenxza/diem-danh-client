
// async function getMenuBarFile(){
//   await $.getScript('shares/menu-bar.js', function (data){
//     var js = document.createElement("script");
//     js.text = data;
//     js.setAttribute('async', 'async');
//     document.getElementsByTagName('head')[0].appendChild(js);
//   });
// };

// await getMenuBarFile();

var apiServer = "http://diem-danh-server.herokuapp.com";
// var apiServer = "http://localhost:8080";

let utilities = (function (){
  return {
    confirmDelete: confirmDelete
  };
  function confirmDelete(title, message){
    return Swal.fire({
      title: title || 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Okie, xóa đê!',
      cancelButtonText: 'Oh, đừng!'
    })
  }
})();

$('body').prepend('<div class="loader-container" style="display:none"><div class="sbl-circ-ripple"></div></div>');

let loading = (function(){
  return {
    startFetching: start,
    stopFetching: stop,
  };
  function start(){
    $('.loader-container').show();
  }
  function stop(){
    $('.loader-container').hide();
  }
})();


