//// Update the DOM with new note /////
function upDateNotes(response){
    console.log(response.id);
    console.log(response.title);
    console.log(response.content);

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

    var form = $(this).closest("form");
        var note_title = form.find("[name = \"note_title\"]").val();
    var new_note = form.find("[name = \"new_note\"]").val();


    var formInputs = {
        "note_title": note_title,
        "new_note": new_note
    };

    $.post("/add_note.json", formInputs, upDateNotes);
}


$("#new_note_button").on('click', addNewNoteToDB);




///// Remove note from list of notes //////
function removeNote(){
    
    console.log("removeNote running");
    
}
function removeNoteFromDB(){
    var note_id = $(this).val();
    $(this).closest('form').remove();

    $.post('/delete_note', {'note_id': note_id}, removeNote);

}

$(".delete_note").on('click', removeNoteFromDB);


