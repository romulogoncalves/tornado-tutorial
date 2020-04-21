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

function loginHandler(event){
    event.preventDefault()
    let data = serializeFormData($(this))
    // TODO: handle actual login. This is a placeholder for front-end functionality
    localStorage.user = JSON.stringify({
        username: data.username,
        token: 'l8xQ8o4dIRXvDA'
    })
    console.log("Send Post")
    const data_form = {
        username: data.username,
        password: data.password,
    };

    user = create_form(data_form)
    const options = {
        method: 'POST',
        body: user,
    }

    fetch('/api/v1/login', options).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(res.json());
        }
        }).then(response => { alert(response.msg); page('/profile')})
        .catch(err => { err.then(err => {
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
    // TODO: handle actual registration. This is a placeholder for front-end functionality
    localStorage.user = JSON.stringify({
        username: data.username,
        token: 'l8xQ8o4dIRXvDA'
    })

    console.log("Send Post")
    const data_form = {
        username: data.username,
        email: data.email,
        password: data.password,
        password2: data.password2
    }

    user = create_form(data_form)
    const options = {
        method: 'POST',
        body: user,
    }

    fetch('/api/v1/accounts', options).then( res => {
        if (res.ok) {
            console.log("The status is " + res.status)
            res.json().then(res => { alert(res.msg); page('/profile')});
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
