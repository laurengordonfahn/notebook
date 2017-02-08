///// for access to environmental variable /////
var app_id



// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI(response);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}


window.fbAsyncInit = function() {
FB.init({
    appId      : '{app_id}',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
});

// Now that we've initialized the JavaScript SDK, we call 
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

// FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });

// The below punctution is needed to contain something to avoid Syntax error
};

// // Load the SDK asynchronously

function facebookLogin(){
    app_id = $(this).val();
    console.log(app_id);
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function postRequest(){
    console.log("In post request");
}

function testAPI(response) {
    console.log('Welcome!  Fetching your information.... ');

    /// TODO TAKE CARE OF THIS SECTION  SEEEK postREQUEST

    var accessToken = response['authResponse']['accessToken'];
    console.log('THIS IS THE ACCESS TOKEN');
    console.log(accessToken);
    var data = {'accessToken': accessToken}
    $.get("/notes", data, postRequest);
    console.log("After POST Request");


    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
}

 //// Update the DOM with new note /////
function updateNotes(response){
    console.log("updateNotes running");

    var tmpl =
                "<div class=\"decorate_note_div\">" +
                "<div>{{created_at}}</div>" +
                "<div>" +
                    "<h4>Note Title:</h4>" +
                    "<p id=\"note_title_{{id}}\">{{title}}</p>" +
                "</div>" +
                 "<div>" +
                    "<h4>Note:</h4>" + 
                    "<p id=\"notes_from_db_{{id}}\">{{content}}</p>"+
                "</div>" +
                "<button class=\"edit_button\" value=\"{{id}}\"> Edit Note </button>" +
                "<button class=\"delete_note\" value=\"{{id}}\"> Delete </button>" +
                "<br>" +
                "</div>";

    var content = Mustache.render(tmpl, response);
    console.log(content);

    $(".add_new_note").prepend(content);
}


function addNewNoteToDB(event){
    event.preventDefault();

    var form = $(this).closest("form");
    var note_title = form.find("[name = \"note_title\"]").val();
    var new_note = form.find("[name = \"new_note\"]").val();

    form.find('[name = "note_title"]').val("");
    form.find('[name = "new_note"]').val("");

    var formInputs = {
        "note_title": note_title,
        "new_note": new_note
    };

    $.post("/notes", formInputs, updateNotes);
}


//// Reorganize Notes In Ascending/Descending Oder ////

function updateNoteOrder(response){
    
    $("#contain_all_notes").empty();


    var data = {
        items: response
    };

    var template = ""+
    "{{#items}}" +
      "<div class=\"decorate_note_div\">"+
        "<div>{{created_at}}</div>" +
        "<div>" +
          "<h4>Note Title:</h4>" +
          "<p id=\"note_title_{{id}}\">{{title}}</p>" +
        "</div>" +
        "<div>" +
            "<h4>Note:</h4>" + 
            "<p id=\"notes_from_db_{{id}}\">{{content}}</p>"+
        "</div>" +
        "<button class=\"edit_button\" value=\"{{id}}\"> Edit Note </button>" +
        "<button class=\"delete_note\" value=\" {{id}}\"> Delete </button>" +
        "<br>" +
      "</div>" +
    "{{/items}}";


    var content = Mustache.render(template,data);

    $('#contain_all_notes').append(content);
    
}


function ascendDescend(event){

    var order_by = $('#ascend_descend').val();

    $.ajax({
        url: '/notes/reorder',
        type: 'GET',
        data: { order_by: order_by },
        success: updateNoteOrder
    });
    
}

////// Edit Exhisting Note //////
function editExhistingNote(event){
    event.preventDefault();

    var note_id = $(this).val();
    var note_title = '#note_title_' + note_id;
    var notes_from_db = '#notes_from_db_' + note_id;
    

    $(note_title).attr("contenteditable", "true");
    $(notes_from_db).attr("contenteditable", "true");


    // Check if button has class 'edit_button' then toggle back to 'save_edits'
    if ($(this).hasClass('edit_button')){
        $(this).html('Save Edits').toggleClass('edit_button save_edits');
    }
    

}

////// Update DB with Edited Notes Content ////
function editAndUpDateNotes(response){
    console.log("editAndUpdateNotes running");
}


function updateDBwithEditedNote(event){
    event.preventDefault();

    var note_id = $(this).val();
    var title_id = "#note_title_"+ note_id;
    var note_content_id = "#notes_from_db_" + note_id;
    var note_title = $(title_id).html();
    var note_content = $(note_content_id).html();



    // Check if button has class 'save_edits' then toggle back to 'edit_note'
    if ($(this).hasClass('save_edits')){
        $(this).html('Edit Note').toggleClass('save_edits edit_button');
        $(title_id).attr("contenteditable", "false");
        $(note_content_id).attr("contenteditable", "false");
    }

    
    $.ajax({
        url: "/notes/edit/" + note_id,
        type: 'PUT',
        data: {
        "title": note_title,
        "content": note_content
        },
        success: editAndUpDateNotes
    });

}
    

///// Remove note from list of notes //////
function removeNote(response){
    
    console.log("removeNote running");
    
}

function removeNoteFromDB(event){
    event.preventDefault();

    var note_id = $(this).val();
    $(this).closest('.decorate_note_div').remove();
    
    $.ajax({
        url: '/notes/' + note_id,
        type: 'DELETE',
        success: removeNote
    });

}

/// Sign-Out with Facebook //////
function signed_out(){
    console.log("signed_out running")
}

function fbLogoutUser(){
    FB.getLoginStatus(function(response) {
                console.log("In getLoginStatus");
                console.log(response);
                if (response && response.status === 'connected') {
                    console.log("connected");
                    FB.logout(function(response) {
                        // user is now logged out
                        console.log("logout function");
                        $.ajax({
                            url: '/log_out',
                            type: 'DELETE',
                            success: signed_out
                        });
                    });
                }
    });
}

////// when ready execute code //////

$(document).ready(function(){
    $('body').on('click', '#log_in_button', facebookLogin);
    $('body').on('click', '#new_note_button', addNewNoteToDB);
    $('body').on('change', '#ascend_descend', ascendDescend);
    $('body').on('click', '.edit_button', editExhistingNote);
    $('body').on('click', '.save_edits', updateDBwithEditedNote);
    $('body').on('click', '.delete_note', removeNoteFromDB);
    $('body').on('click', '#fblogout', fbLogoutUser);
});