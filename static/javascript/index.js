///// for access to environmental variable /////
var app_id = $(".fb-login-button").attr('value');

// This is called with the results from from FB.getLoginStatus().
window.onload = function(){
    FB.logout();
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    
    var app_session_class = document.getElementsByClassName("fb-login-button");
    var app_status = $(app_session_class).attr("app-session");
    
    console.log(app_status);

    if (response.status === 'connected') {
      console.log("connected");
      onFBLogin(response);

    } else if (response.status === 'not_authorized') {
    
    } 
    else if (app_status === 'no' && response.status === 'connected') {

        FB.logout(function(response) {
        
            console.log("LogOut Because not in Session");
        });

    }
    else {
      
        FB.getLoginStatus(function(response) {
            $.ajax({
                url: '/session',
                type: 'DELETE',
                success: afterSignOut
            });
            console.log("In getLoginStatus");
        });
    }
}

// window.load= checkLoginState();
function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : app_id,
        cookie     : true,                 
        xfbml      : true,  
        version    : 'v2.9' 
    });
};


function postRequest(){
    
    window.location.replace("/");
}

(function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                  
                if (d.getElementById(id)) return;
                  
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=1899079457005459";
                fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function onFBLogin(response) {

    var accessToken = response['authResponse']['accessToken'];
    var data = {"accessToken": accessToken}

    $.get("/session", data, postRequest);
}

 //// Update the DOM with new note /////
function updateNotes(response){
    if (response['error_msg']) {

        $("#new_note_form").value = response['note_title'];
        $('#new_note_text_box').value = response['new_note'];

    } else {
        
        var tmpl =
                    "<div class=\"decorate_note_div\">" +
                    "<div class=\"note_created_at\"> {{created_at}} </div>" +
                    "<div class=\"div_note_title\">" +
                        "<h3 class=\"header_note_title\" >Note Title:</h3>" +
                        "<div class=\"note_title\" id=\"note_title_{{id}}\"" +
                        "style=\"white-space: break-word; width: 100%; word-wrap: break-word\"" + 
                        "contenteditable=\"false\"> {{title}} </div>" +
                    "</div>" +
                     "<div class=\"div_note_content\">" +
                        "<h3 class=\"note\" >Note:</h3>" + 
                        "<div class=\"note_content\" id=\"notes_from_db_{{id}}\"" + 
                        "style=\"white-space: break-word; width: 100%; word-wrap: break-word\"" +
                        "contenteditable=\"false\">{{content}}</div>"+
                    "</div>" +
                    "<button class=\"edit_button\" value=\"{{id}}\"> Edit Note </button>" +
                    "<button class=\"delete_note\" value=\"{{id}}\"> Delete </button>" +
                    "<br/>" +
                    "</div>";

        var content = Mustache.render(tmpl, response);
        
        $(".no_notes").remove();
        
        $("p.head_font").remove();
        $("#contain_all_notes").prepend(content);
    }
}

function addNewNoteToDB(event){
    
    event.preventDefault();

    var form = $(this).closest("form");
    var note_title = form.find("[name = \"note_title\"]").val();
    var new_note = form.find("[name = \"new_note\"]").val();

    if (note_title.length > 200){
        alert("Please, keep title to fewer than 200 characters you are using" + note_title.length + "characters.");

    } else {

        form.find('[name = "note_title"]').val("");
        form.find('[name = "new_note"]').val("");

        var formInputs = {
            "note_title": note_title,
            "new_note": new_note
        };

        $.post("/notes", formInputs, updateNotes);
    }
}

//// Reorganize Notes In Ascending/Descending Oder ////

function updateNoteOrder(response){
    if (response.length !== 0){
        console.log(response.length, "if is running");
        $("#contain_all_notes").empty();
        
        var data = {
            items: response
        };

        var template = ""+
        "{{#items}}" +
          "<div class=\"decorate_note_div\">"+
            "<div class=\"note_created_at\">{{created_at}}</div>" +
            "<div class=\"div_note_title\">" +
              "<h3 class=\"header_note_title\">Note Title:</h3>" +
              "<div class=\"note_title\" id=\"note_title_{{id}}\"" + 
              "style=\"white-space: pre-line; width: 100%; word-wrap:break-word\"" +
              "contenteditable=\"false\">{{title}}</div>" +
            "</div>" +
            "<div class=\"div_note_content\">" +
                "<h3 class=\"note\">Note:</h3>" + 
                "<div class=\"note_content\" id=\"notes_from_db_{{id}}\"" +
                "style=\"white-space: pre-line; width: 100%; word-wrap:break-word\"" + 
                "contenteditable=\"false\">{{content}}</div>"+
            "</div>" +
            "<button class=\"edit_button\" value=\"{{id}}\"> Edit Note </button>" +
            "<button class=\"delete_note\" value=\" {{id}}\"> Delete </button>" +
            "<br/>" +
          "</div>" +
        "{{/items}}";


        var content = Mustache.render(template, data);

        $('#contain_all_notes').append(content);
    } else {
        console.log(response, "Else is running");
        return
    }
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

    // style="white-space: pre-line; width: 100%; word-wrap:break-word"
    $(note_title).attr("contenteditable", "true");
    $(note_title).attr("style","white-space: pre-line");
    $(note_title).attr("style","width: 100%");
    $(note_title).attr("style","word-wrap: break-word");
    $(notes_from_db).attr("contenteditable", "true");
    $(notes_from_db).attr("style","white-space: pre-line");
    $(notes_from_db).attr("style","width: 100%");
    $(notes_from_db).attr("style","word-wrap: break-word");
    $(note_title).attr("class", "highlight");
    $(notes_from_db).attr("class", "highlight");

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

    var title_id = "note_title_"+ note_id;
    var note_content_id = "notes_from_db_" + note_id;
    var note_content = document.getElementById(note_content_id).innerText;
    var note_title = document.getElementById(title_id).innerText;
    console.log(note_title, note_content);

    // Check if button has class 'save_edits' then toggle back to 'edit_note'
    if ($(this).hasClass('save_edits')){
        $(this).html('Edit Note').toggleClass('save_edits edit_button');
        $("#" + title_id).attr("contenteditable", "false");
        $("#" + note_content_id).attr("contenteditable", "false");
        $("#" + title_id).toggleClass('highlight unhighlight');
        $("#" + note_content_id).toggleClass('highlight unhighlight'); 

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
    if (response["num_notes"] === 0) {
        var template = "" +
            "<div class=\"no_notes\">" +
                "<p> You do not have any notes. </p>" +
            "</div>";
        $("#contain_all_notes").append(template);
    }
    
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
function afterSignOut(){
    console.log("pass");
    window.location.assign("/");
}

////// when ready execute code //////

$(document).ready(function(){
    $('body').on('click', '#new_note_button', addNewNoteToDB);
    $('body').on('change', '#ascend_descend', ascendDescend);
    $('body').on('click', '.edit_button', editExhistingNote);
    $('body').on('click', '.save_edits', updateDBwithEditedNote);
    $('body').on('click', '.delete_note', removeNoteFromDB);
});