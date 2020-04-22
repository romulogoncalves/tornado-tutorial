function serializeFormData(form) {
    let asString = form.serialize()
    let data = asString.split('&').reduce((agg, item) => {
        let [key, val] = item.split('=')
        agg[key] = val.replace(/\%20/g, ' ')
        return agg
    }, {})
    return data
}

function create_form(parameters) {
    let formData = new FormData();
    $.each(parameters, function(key, value) {
        if ( typeof value == 'object' || typeof value == 'array' ){
            $.each(value, function(subkey, subvalue) {
                formData.append(key+'[]', subvalue)
            });
        } else {
            formData.append(key, value)
        }
    });

    return formData
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function loginHandler(event){
    event.preventDefault()
    let data = serializeFormData($(this))

    var xrsf = getCookie('_xsrf')
    const data_form = {
        username: data.username,
        password: data.password,
    };

    user = create_form(data_form)
    const options = {
        method: 'POST',
        headers: new Headers({
            'X-Xsrftoken': xrsf
        }),
        body: user,
    }

    fetch('/api/v1/login', options).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(res.json());
        }
        }).then(response => {
                alert(response.msg);
                localStorage.user = JSON.stringify({
                    username: data.username,
                    auth_token: getCookie('auth_token')
                });
                page.redirect('/profile');
                return;
        }).catch(err => { err.then(err => {
            alert("Login failed: " + err.error); clearMain(); localStorage.clear(); page.redirect('/')});
        });

    /*
        console.log("The status is: " + res.status);
        console.log("The status text is: " + res.statusText);
        console.log("The redirect is: " + res.redirected);
        console.log("The url is: " + res.url);
        console.log("The response text is :" + res.responseText);
        res.json();
    }).then(res => alert("The message is:" + JSON.stringify(res)))
    */

}

function reqListener () {
  console.log(this.responseText);
}

function registrationHandler(event){
    event.preventDefault()
    let data = serializeFormData($(this))

    var xrsf = getCookie('_xsrf')
    const data_form = {
        username: data.username,
        email: data.email,
        password: data.password,
        password2: data.password2,
    }

    user = create_form(data_form)
    const options = {
        method: 'POST',
        headers: new Headers({
            'X-Xsrftoken': xrsf
        }),
        body: user,
    }

    fetch('/api/v1/accounts', options).then( res => {
        if (res.ok) {
            console.log("The status is " + res.status)
            res.json().then(res => { alert(res.msg); page('/profile')});
            localStorage.user = JSON.stringify({
                username: data.username,
                token: $(document)
            })
            return;
        } else {
            if (res.status == 500) {
                alert(res.statusText);
                clearMain();
                localStorage.clear();
                page.redirect('/')
                return;
            } else {
                return Promise.reject(res.json());
            }
        }
    }).catch(err =>
        { err.then ( err =>
            {
                alert("Registration failed: " + err.error);
                clearMain();
                localStorage.clear();
                page.redirect('/')
            });
        });
}
