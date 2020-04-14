function serializeFormData(form) {
    let asString = form.serialize()
    let data = asString.split('&').reduce((agg, item) => {
        let [key, val] = item.split('=')
        agg[key] = val.replace(/\%20/g, ' ')
        return agg
    }, {})
    return data
}

/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

//https://gist.github.com/hom3chuk/692bf12fe7dac2486212
function post(path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);

    $.each(parameters, function(key, value) {
        if ( typeof value == 'object' || typeof value == 'array' ){
            $.each(value, function(subkey, subvalue) {
                var field = $('<input />');
                field.attr("type", "hidden");
                field.attr("name", key+'[]');
                field.attr("value", subvalue);
                form.append(field);
            });
        } else {
            var field = $('<input />');
            field.attr("type", "hidden");
            field.attr("name", key);
            field.attr("value", value);
            form.append(field);
        }
    });
    $(document.body).append(form);
    form.submit();
}

function get(path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "get");
    form.attr("action", path);

    $.each(parameters, function(key, value) {
        if ( typeof value == 'object' || typeof value == 'array' ){
            $.each(value, function(subkey, subvalue) {
                var field = $('<input />');
                field.attr("type", "hidden");
                field.attr("name", key+'[]');
                field.attr("value", subvalue);
                form.append(field);
            });
        } else {
            var field = $('<input />');
            field.attr("type", "hidden");
            field.attr("name", key);
            field.attr("value", value);
            form.append(field);
        }
    });
    $(document.body).append(form);
    form.submit();
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
    var data_form = {
        username: data.username,
        password: data.password,
    }
    var test = post('/api/v1/login', data_form)
    page('/profile')
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
    var data_form = {
        username: data.username,
        email: data.email,
        password: data.password,
        password2: data.password2
    }
    var test = post('/api/v1/accounts', data_form)
    console.log(this.responseText)
    page('/')
}
