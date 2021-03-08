$(document).ready(function(){

  var activeInput = "<img id=\"Small_movie\" src=\"icons/movie.svg\" alt=\"Small Movie Image\" class=\"img-fluid img_in_input\">"+
                "<div id=\"inp_cont\" class=\"d-block bgr_white rounded-top ms-n1\">"+
                "   <input id=\"input_field_2\" type=\"text\" class=\"d-inline-block form-control ps-0 rounded-1 input_bgrd\" placeholder=\"Enter movie name\" aria-label=\"Movie Name\">"+
                "   <small id=\"hint\" class=\"hint text-muted\">Enter a movie name</small>"+
                "</div>";
   var inActiveInput = "<input id=\"input_field_1\" type=\"text\" class=\"form-control ps-0 rounded-1 input_bgrd\" placeholder=\"Enter movie name\" aria-label=\"Movie Name\">" +
                        "<span id=\"search_button\" class=\"btn rounded-1 search_btn ms-1\" type=\"submit\"><img  class=\"img-fluid img-size-search\" src=\"icons/search.svg\" alt=\"Search Button\"></span>"
              

  $('#input_field').on('focus', function(){
    $("input").remove("#input_field");
      focusIn(activeInput);
  });

  $('#block').on('focus', '#input_field_1', function(){
      var value = $(this).val();
      $("input").remove("#input_field_1");
      focusIn(activeInput);
      $('#input_field_2').val(value);
  });
  
  $('#block').on({
    'focusout': function(){
      focusOut(inActiveInput);
    },
    'keypress': function(e){
      if (e.keyCode === 13) {
        $('#input_field_2').blur(); 
      }
    }
  },'#input_field_2');
    
  $('#block').bind('input', '#input_field_2', function() { 
    var title = $('#input_field_2').val();
    title = title.replace(" ", "+");
    getData(title);
  });
});

//Call to server and generate suggestion list
function getData(title) {
  $("#input_field_2").autocomplete({
      autoFocus: true,
      minLength: 3,
       //Delay function for debounce
      delay: 200,
      select: function (event, ui) {
          $('#input_field_2').val(ui.item.value);
          $('#input_field_2').blur();
        return false;
      },
      position: { my : "left top+14", at: "left bottom" },
      source: function(request, response){
        //Ajax call to server
            $.ajax({
                dataType: "json",
                type : 'Get',
                url: 'https://api.themoviedb.org/3/search/movie?api_key=a713c9806215c1d89bf1eb9874ea1268&query='+title,
                success: function(data) {  
                  data.results = data.results.slice(0, 8);
                  response($.map( data.results, function( item ) {
                    return {
                        value: item.original_title,
                        label: item.vote_average + " Raiting, " + item.release_date.substring(0, 4)
                    }
                }));
              },
              //Error handling
              error: function(xhr, status, error) {
                    var errorMessage = xhr.statusText + ': ' + xhr.status
                    alert('Alert! '+ errorMessage);
                   }
            });
          }
  }).autocomplete( "instance" )._renderItem = function( ul, item ) {
    return $( "<li>" )
      .append( "<div><b>" + item.value + "</b>" )
      .append( " <sup>" + item.label + "</sup></div>")
      .appendTo( ul )
  }
}
//Actions performed when input is focused out
function focusOut(inActiveInput) {
  var value = $('#input_field_2').val();
  $("img").remove("#Small_movie");
  $("div").remove("#inp_cont");
  $(inActiveInput).insertAfter("#movie_icon");
  $('#input_field_1').val(value);
  console.log($('#input_field_1').val());
}

//Actions performed when input is focused in
function focusIn(activeInput) {
  $("span").remove("#search_button");
  $(activeInput).insertAfter("#movie_icon");
  $('#input_field_2').focus();
}
