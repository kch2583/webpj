$(function() {
  //공모전 좋아요 버튼 클릭, 취소
  $('.contest-like-btn').click( function(e) {
    var $el = $(e.currentTarget);
    if ($el.hasClass('clicked') === true) {
      $.ajax({
        url: '/api/contest/' + $el.data('id') + '/notlike',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $('.contest .num-likes').text(data.numLikes);
          $el.removeClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
    else{
      $.ajax({
        url: '/api/contest/' + $el.data('id') + '/like',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $('.contest .num-likes').text(data.numLikes);
          $el.addClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
  });


  //싫어요 버튼 클릭, 취소
  $('.contest-hate-btn').click( function(e) {
    var $el = $(e.currentTarget);
    if ($el.hasClass('clicked') === true) {
      $.ajax({
        url: '/api/contest/' + $el.data('id') + '/nothate',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $('.contest .num-hates').text(data.numHates);
          $el.removeClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
    else{
      $.ajax({
        url: '/api/contest/' + $el.data('id') + '/hate',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $('.contest .num-hates').text(data.numHates);
          $el.addClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
  });

  //댓글 좋아요 버튼 클릭, 취소
  $('.comments-like-btn').click(function(e) {
    var $el = $(e.currentTarget);
    if ($el.hasClass('clicked') === true) {
      $.ajax({
        url: '/api/comments/' + $el.data('id') + '/notlike',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $el.parents('.comments').find('.num-likes').text(data.numLikes);
          $el.removeClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
    else{
      $.ajax({
        url: '/api/comments/' + $el.data('id') + '/like',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $el.parents('.comments').find('.num-likes').text(data.numLikes);
          $el.addClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
  });


  //댓글 싫어요 버튼 클릭, 취소
  $('.comments-hate-btn').click(function(e) {
    var $el = $(e.currentTarget);
    if ($el.hasClass('clicked') === true) {
      $.ajax({
        url: '/api/comments/' + $el.data('id') + '/nothate',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $el.parents('.comments').find('.num-hates').text(data.numHates);
          $el.removeClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    } 
    else{
      $.ajax({
        url: '/api/comments/' + $el.data('id') + '/hate',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $el.parents('.comments').find('.num-hates').text(data.numHates);
          $el.addClass('clicked');
        },
        error: function(data, status) {
          if (data.status == 500) {
            alert('Login required!');
            location = '/login';
          }
          console.log(data, status);
        }
      });
      e.preventDefault();
    }
  });



  //공모전 즐겨찾기 버튼 클릭시
  $('.contest-favorite-btn').click( function(e) {
    var $el = $(e.currentTarget);

    if ($el.hasClass('clicked') === true) {
      $.ajax({
        url: '/api/contest/' + $el.data('id') + '/notfavorite',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#favorite').removeClass('fas');
          $('#favorite').addClass('far');
          $el.removeClass('clicked');
          alert('즐겨찾기에 등록이 취소되었습니다.');
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
        url: '/api/contest/' + $el.data('id') + '/favorite',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          
          $('#favorite').removeClass('far');
          $('#favorite').addClass('fas');
          $el.addClass('clicked');
          alert('즐겨찾기에 등록되었습니다.');
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



});