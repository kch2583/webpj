$(function(){
    //유저 권한 변경
    $('.auth-check').click( function(e) {
      var $el = $(e.currentTarget);
      if ($el.hasClass('clicked') === true) {
        $.ajax({
          url: '/admin/userAuthChange/' + $el.data('id') + '/admin',
          method: 'POST',
          dataType: 'json',
          success: function(data) {
            $('#userAuthCheck').removeClass('fas');
            $('#userAuthCheck').addClass('far');
            $el.removeClass('clicked');
            alert('해당 유저의 권한이 normal로 바뀌었습니다.');
          },
          error: function(data, status) {
            if (data.status == 401) {
              alert('Login required!');
              location = '/login';
            }
            console.log(data, status);
          }
        });
      }
      else{
        $.ajax({
          url: '/admin/userAuthChange/' + $el.data('id') + '/normal',
          method: 'POST',
          dataType: 'json',
          success: function(data) {
            $('#userAuthCheck').removeClass('far');
            $('#userAuthCheck').addClass('fas');
            $el.addClass('clicked');
            alert('해당 유저의 권한이 admin으로 바뀌었습니다.');
          },
          error: function(data, status) {
            if (data.status == 401) {
              alert('Login required!');
              location = '/login';
            }
            console.log(data, status);
          }
        });
      }
    }); 
})