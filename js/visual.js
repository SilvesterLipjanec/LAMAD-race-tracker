function ShowProgressBar()
{
    
    var t = $("#progressBar").css('top');
    
    if  (t=='0px')
    {
        $("#progressBar").css({'top' : '-15vmin'});
    } else {
        $("#progressBar").css({'top' : '0px'});
    }
    
}
