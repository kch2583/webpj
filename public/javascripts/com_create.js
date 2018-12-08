$(function(){
  $('#company1').click(function(){
    $('.companyname').show();
  })
  $('#normal').click(function(){
    $('.companyname').hide();
  })

  $('#summernote').summernote({
    placeholder: '세부사항을 입력하십시오',
    lang: 'ko-KR',
    tabsize: 2,
    height: 300,                 // set editor height
    minHeight: null,             // set minimum height of editor
    maxHeight: null             // set maximum height of edito
  });
  
  $('#comment_form').submit(function() {
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

  


})
