 //// Update the DOM with new note /////
function upDateNotes(response){

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

    $.post("/notes", formInputs, upDateNotes);
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
          "<p class=\"note_title_{{id}}\">{{title}}</p>" +
        "</div>" +
        "<div>" +
            "<h4>Note:</h4>" + 
            "<p class=\"notes_from_db_{{id}}\">{{content}}</p>"+
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

////// when ready execute code //////

$(document).ready(function(){
    $('body').on('click', '#new_note_button', addNewNoteToDB);
    $('body').on('change', '#ascend_descend', ascendDescend);
    $('body').on('click', '.edit_button', editExhistingNote);
    $('body').on('click', '.save_edits', updateDBwithEditedNote);
    $('body').on('click', '.delete_note', removeNoteFromDB);
});