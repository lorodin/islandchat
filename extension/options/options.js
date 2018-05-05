let name = '';

$(function(){
    name = localStorage.getItem('name');
    if(name == undefined) name = 'Guest';
    $("#default-user-name").val(name);
    $("#save-change").click(SaveChange)
})

function SaveChange(){
    let new_name = $("#default-user-name").val();
    if(new_name.trim() == ''){
        alert('The name field can not be empty!');
        $("#default-user-name").val(name);
        return;
    }
    localStorage.setItem('name', new_name);
    alert('The name has been changed');
}