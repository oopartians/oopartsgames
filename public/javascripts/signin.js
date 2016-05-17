$("#input-signin").click(function(){
  alert('q');
  var passwd = $("#slick-login input[name='password']")[0];
  passwd.value = CryptoJS.SHA512(passwd.value);
});
