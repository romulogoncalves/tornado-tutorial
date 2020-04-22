function buildProfileBlock() {
    if (localStorage.getItem('user') == null) {
        alert("You need first to login!!!")
        page.redirect('/')
    } else {
        fetch('/api/v1/accounts/' + JSON.parse(localStorage.getItem('user')).username).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response.json());
            }
        }).then((data) => {
            console.log(data);
            var user_data = {
                firstname: data.username,
                lastname: "",
                email: data.email,
            }
            var tasksLeft = 0;
            var tasksOverdue = 0;
            var tasksCompleted = 0;

            var tasks = data.tasks;
            if (tasks.length != 0) {
                console.log("The tasks are: " + tasks[0])
            }

            let profile = {
                user: user_data,
                tasksLeft: tasksLeft,
                overdue: tasksOverdue,
                completed: tasksCompleted
            }
            $('#profile-page').append( compileTemplate(profileBlock, profile))
        }).catch(err =>
            { err.then ( err => {
                alert("Profile retrieve failed: " + err.error);
                clearMain();
                localStorage.clear();
                page.redirect('/');
                return;
            });
        });
    }

}

function buildProfileLists() {
    $('#profile-page').append( compileTemplate(profileLists) )
}
