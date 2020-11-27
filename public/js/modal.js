let focusedTweet="";
$('.tweet').hover(
    () => {
        focusedTweet = event.target.children[1].innerHTML;
    }, () => {
        focusedTweet="";
    }
);

$('.editButton').click(() => {
    const tweetID = event.target.id;
    $('#editArea').val(focusedTweet);
    $('#myModal').css('display', 'block');
    $('#submitEdit').click(() => {
        $.ajax({
            url: `/tweet/`,
            type: 'PUT',
            data: {
                tweetID: tweetID,
                newContent: $('#editArea').val(),
            },
            success(res) {
                if (res.updated) {
                    location.reload();
                }
            }
        });
    });
});

$('.close').click(() => {
    $('#myModal').css('display', 'none');
});

$('#cancelEdit').click(() => {
    $('#myModal').css('display', 'none');
});

$(window).click(() => {
    if (event.target.id === 'myModal') {
        $('#myModal').css('display', 'none');
    }
});
