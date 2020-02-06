
  jQuery( document ).ready(function() {
      jQuery(document).on('keypress', function(e) {
        debugger;
        e.preventDefault();
          if ( e.which == 27 ) {
          window.close();
      }
      });
  });
  
  function fontLarger() {
    let fsize = parseInt($('#musicchart').css("font-size"), 10);
    fsize += 2;
    if( fsize <= 32 ) {
      $('#musicchart').css("font-size", fsize + 'px');
    }
  }
  function fontSmaller() {
    let fsize = parseInt($('#musicchart').css("font-size"), 10);
    fsize -= 2;
    if( fsize >= 10 ) {
      $('#musicchart').css("font-size", fsize + 'px');
    }    
  }
  

