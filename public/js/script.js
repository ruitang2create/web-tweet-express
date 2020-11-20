var baseUrl = 'https://tweet-api.webdxd.com/'

var displayUser = (user) => {
    let profile = $('.profile-content')
    $('<img>').addClass('avatar').attr({
        'src': user.avatarUrl,
        'alt': 'avatar'
    }).appendTo(profile)
    $('<h3>').text(user.name).appendTo(profile)
    $('<h5>').text('@' + user.username).appendTo(profile)
    if (user.location) $('<h4><i class="fas fa-map-marker-alt"></i> ' + user.location + '</h4>').appendTo(profile)
    if (user.location) $('<p>').addClass('center').text(user.bio).appendTo(profile)
    $('.avatar-sm').attr('src', user.avatarUrl)
}

var displayUserEdit = (user) => {
    $('#avatar-image').attr('src', user.avatarUrl)
    $('#name-input').val(user.name)
    $('#username').text('@' + user.username)
    $('#location-input').val(user.location)
    $('#bio-input').val(user.bio)
}

if (localStorage.user) {
    $.ajax({
        type: "GET",
        url: baseUrl + "profile/" + localStorage.user,
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (data) {
            if (data.success) {
                if (window.location.pathname === '/index' || window.location.pathname === '/profile') {
                    displayUser(data.profile)
                } else if (window.location.pathname === '/profile/edit') {
                    displayUserEdit(data.profile)
                }
            } else {
                localStorage.user = null
                window.location.replace("/login")
            }
        },
        error: function () {
            console.log("Auth Check Failed")
        }
    });
} else {
    if (!(window.location.pathname === '/login' || window.location.pathname === '/signup')) window.location.replace("/login")
}

var prependTweet = (tweet) => {
    let tweetContainer = $('<div>').addClass('tweet').attr('id', tweet._id).append()
    let row = $('<div>').addClass('row relative').appendTo(tweetContainer)
    $('<img>').addClass('tweet-avatar').attr({
        'src': tweet.author.avatarUrl,
        'alt': 'avatar'
    }).appendTo(row)
    $('<h4><b>' + tweet.author.name + '</b></h4>').appendTo(row)
    $('<h5>@' + tweet.author.username + '</h5>').appendTo(row)
    $('<h5>').text(moment(tweet.createdAt).calendar()).appendTo(row)
    let content = $('<p>').text(tweet.content).appendTo(tweetContainer)
    if (tweet.imageUrl) {
        $('<br><img src="' + tweet.imageUrl + '" alt="tweet">').appendTo(content)
    }
    if (window.location.pathname === '/profile') {
        $('<button class="btn-clear tweet-del" id="delete-tweet-btn"><i class="far fa-trash-alt"></i></button>').appendTo(row)
    }
    $('#tweet-list').prepend(tweetContainer)
}

var loadAllTweets = () => {

    $.ajax({
        type: 'GET',
        url: baseUrl + 'tweet',
        success: (data) => {
            for (let tweet of data.tweets) {
                if (window.location.pathname === '/profile' || window.location.pathname === '/profile/edit') {
                    if (tweet.author._id === localStorage.user) prependTweet(tweet)
                } else {
                    prependTweet(tweet)
                }
            }
        },
        error: (err) => {
            console.log(err.statusText)
        }
    });

}

loadAllTweets()

$('#signup-btn').click(() => {

    let newUser = {
        username: $('#username').val(),
        password: $('#password').val(),
        repeatPassword: $('#repeat-password').val()
    }

    $('.error-msg').remove()
    $('form input').removeClass('input-alert')

    if (!newUser.username) {
        $('#username').addClass('input-alert').before($('<span>').addClass('error-msg').text('Username required'))
    } else if (!newUser.password) {
        $('#password').addClass('input-alert').before($('<span>').addClass('error-msg').text('Password required'))
    } else if (newUser.password !== newUser.repeatPassword) {
        $('#repeat-password').addClass('input-alert').before($('<span>').addClass('error-msg').text('Password does not match'))
    } else {
        $.ajax({
            type: "POST",
            url: baseUrl + "auth/signup",
            data: newUser,
            success: function (data) {
                if (data.success) {
                    localStorage.token = data.token
                    localStorage.user = data.profile._id
                    $('#signup-form').trigger("reset")
                    window.location.replace("/profile/edit");
                } else {
                    $('#signup-btn').after($('<p>').addClass('error-msg').text(data.error.message))
                }

            },
            error: function () {
                console.log("Signup Failed")
            }
        });
    }
})


$('#login-btn').click(() => {

    let user = {
        username: $('#username').val(),
        password: $('#password').val(),
    }

    $('.error-msg').remove()
    $('form input').removeClass('input-alert')

    if (!user.username) {
        $('#username').addClass('input-alert').before($('<span>').addClass('error-msg').text('Username required'))
    } else if (!user.password) {
        $('#password').addClass('input-alert').before($('<span>').addClass('error-msg').text('Password required'))
    } else {
        $.ajax({
            type: "POST",
            url: baseUrl + "auth/login",
            data: user,
            success: function (data) {
                if (data.success) {
                    localStorage.token = data.token
                    localStorage.user = data.profile._id
                    $('#login-form').trigger("reset")
                    window.location.replace("/index")
                } else {
                    $('#login-btn').after($('<p>').addClass('error-msg').text('Username and password do not match.'))
                }
            },
            error: function () {
                console.log("Login Failed")
            }
        });
    }
})

var newTweet = {}

$('#tweet-content').keyup(() => {
    newTweet.content = $('#tweet-content').val()
    newTweet.content ? $('#post-btn').prop('disabled', false) : $('#post-btn').prop('disabled', true)
})

$('#tweet-image-btn').click(() => {
    uploadcare.Widget('#tweet-image').openDialog();
    $('.uploadcare--widget').show();
})

$('#post-btn').click(() => {
    newTweet.imageUrl = $('#tweet-image').val() || null

    $.ajax({
        type: "POST",
        url: baseUrl + "tweet",
        data: newTweet,
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (data) {
            if (data.success) {
                $('#tweet-form').trigger("reset")
                uploadcare.Widget('#tweet-image').value(null)
                $('.uploadcare--widget').hide();
                $('#post-btn').prop('disabled', true)
                prependTweet(data.tweet)
            } else {
                console.log(data.error.message)
            }
        },
        error: function () {
            console.log("Authentication Failed")
        }
    });

})

$('#logout-btn').click(() => {
    localStorage.clear()
    window.location.replace("/login")
})

$('#avatar-file-btn').click(() => {
    uploadcare.Widget('#avatar-file').openDialog()
    let widget = uploadcare.Widget('#avatar-file')
    widget.onChange((file) => {
        if (file) {
            file.done((info) => {
                // Handle uploaded file info.
                $('#avatar-image').attr('src', info.originalUrl)
            });
        };
    });
})

$('#save-btn').click(() => {

    let profile = {
        name: $('#name-input').val(),
        location: $('#location-input').val(),
        bio: $('#bio-input').val(),
        avatarUrl: $('#avatar-image').attr('src')
    }

    $.ajax({
        type: "PUT",
        url: baseUrl + "profile/" + localStorage.user,
        data: profile,
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (data) {
            if (data.success) {
                window.location.replace("/profile")
            } else {
                console.log(data.error.message)
            }
        },
        error: function () {
            console.log("Authentication Failed")
        }
    })

})

$('#cancel-btn').click(() => {
    window.location.replace("/profile")
})

$('#tweet-list').on('click', '#delete-tweet-btn', (e) => {
    let tweetId = $(e.target).parent().parent().parent().attr('id')

    $.ajax({
        type: "DELETE",
        url: baseUrl + "tweet/" + tweetId,
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (data) {
            if (data.success) {
                $('#' + tweetId).remove()
            } else {
                console.log(data.error.message)
            }
        },
        error: function () {
            console.log("Authentication Failed")
        }
    });
})