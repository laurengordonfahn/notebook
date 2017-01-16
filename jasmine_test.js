//////// Add Message Action Tests
describe("Add Note Button Click Event Tests", function() {
  var spyEvent;
   
  beforeEach(function() {
    setUpHTMLFixture();
  });
      
  it ("should invoke the new_note_button click event.", function() {
    spyEvent = spyOnEvent('#new_note_button', 'click');
    $('#new_note_button').trigger( "click" );
       
    expect('click').toHaveBeenTriggeredOn('#new_note_button');
    expect(spyEvent).toHaveBeenTriggered();
  });

///// Confirm add message action occured

var title = "Test Suite Note";
var MSG = "This is a new note added by the test suite";
describe("Show message tests", function() {
  beforeEach(function() {
    setUpHTMLFixture();
    $('#title_for_new_note').val(title)
    $('#new_note_text_box').val(MSG);
    $('#new_note_button').trigger( "click" );
  });
   
  it ("should display the message when button is clicked.", function() {
    expect($('.new_updated_notes')).toHaveText($('#new_note_text_box').val());
  });
});

describe("Delete New Message", function() {
  beforeEach(function() {
    setUpHTMLFixture();
    $('.new_updated_notes').text(MSG);
    $('.delete_note').trigger( "click" );
  });
   
  it ("should remove the message when button is clicked.", function() {
    expect($('.new_updated_notes')).toHaveText("");
  });
});



///////// Delete Message Action Tests
describe("Delete button click tests", function() {
  var spyEvent;
   
  beforeEach(function() {
    setUpHTMLFixture();
  });  
      
  it ("should invoke the delete_note click event.", function() {
    spyEvent = spyOnEvent('.delete_note', 'click');
    $('.delete_note').trigger( "click" );
       
    expect('click').toHaveBeenTriggeredOn('.delete_note');
    expect(spyEvent).toHaveBeenTriggered();
  });
});

/////// Check deltion action occured tests
var MSG = "A note that does not have an apostrophy but does have a \"quote in it\" that I escaped but I should handle that in the code!";
describe("Delete message from DB tests", function() {
  beforeEach(function() {
    setUpHTMLFixture();
    $('.notes_from_db').val(MSG);
    $('.delete_note').trigger( "click" );
  });
   
  it ("should delete the message when button is clicked.", function() {
    expect($('#pMsg')).toHaveText($('#txtMessage').val());
  });
});


describe("Hide message tests", function() {
  beforeEach(function() {
    setUpHTMLFixture();
    $('.notes_from_db').text("A note that does not have an apostrophy but does have a \"quote in it\" that I escaped but I should handle that in the code!");
    $('.delete_note').trigger( "click" );
  });
   
  it ("should remove the message when button is clicked.", function() {
    expect($('.notes_from_db')).not.toHaveText("A note that does not have an apostrophy but does have a \"quote in it\" that I escaped but I should handle that in the code!");
  });
});