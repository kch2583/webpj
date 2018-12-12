$(function(){
  $('#summernote').summernote({
    placeholder: '세부사항을 입력하십시오',
    lang: 'ko-KR',
    tabsize: 2,
    height: 300,                 // set editor height
    minHeight: null,             // set minimum height of editor
    maxHeight: null
  });
  
  $('#create_contest').submit(function() {
    $(this).ajaxSubmit({
      error: function(xhr) {
        status('Error: ' + xhr.status);
      },
     success: function(response) {
      console.log(response);
     }
    });
    return false;
  });

  $('textarea[name="content"]').val($('#summernote').summernote('code'));

  
  $('#details1').html($('#details1').text());


})

function chkCaptcha() {
  if (typeof(grecaptcha) != 'undefined') {
     if (grecaptcha.getResponse() == "") {
         alert("스팸방지코드를 확인해 주세요.");
         return false;
     }
  }
  else {
       return false;
  }
}