
 //// Update the DOM with new note /////
function upDateNotes(response){

    var add_note_form = 
        "<form>" +
            "<button class=\"delete_note\" value=\""+ response.id +"\"> Delete </button>" +
            "<div class=\"decorate_note_div\">" +

                "<div>" + response.created_at +"</div>" +
                "<div>" + response.title + "</div>" +
                "<div>" +
                    "<p>" + response.content + "</p>" +
                "</div>" +
            "</div>" +
        "</form>";

    $(".new_updated_notes").prepend(add_note_form);
}


function addNewNoteToDB(event){
    event.preventDefault();
    var form = $(this).closest("form");
        var note_title = form.find("[name = \"note_title\"]").val();
    var new_note = form.find("[name = \"new_note\"]").val();


    var formInputs = {
        "note_title": note_title,
        "new_note": new_note
    };


    $.post("/notes", formInputs, upDateNotes);
}


$("#new_note_button").on('click', addNewNoteToDB);


///// Remove note from list of notes //////
function removeNote(response){
    
    console.log("removeNote running");
    
}

function removeNoteFromDB(event){
    event.preventDefault();

    var note_id = $(this).val();
    $(this).closest('form').remove();
    
    $.ajax({
        url: '/notes/' + note_id,
        type: 'DELETE',
        success: removeNote
    });

}


////// when read execute code //////

$(document).ready(function(){
    $('body').on('click', '#new_note_button', addNewNoteToDB);
    $('body').on('click', '.delete_note', removeNoteFromDB);
});