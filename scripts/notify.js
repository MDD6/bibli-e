(function(){
  function requestPerm(){
    if(!('Notification' in window)) return;
    if(Notification.permission==='default'){
      Notification.requestPermission();
    }
  }
  document.addEventListener('DOMContentLoaded', requestPerm);
})();