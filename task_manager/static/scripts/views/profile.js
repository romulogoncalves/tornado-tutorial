function buildProfileBlock() {
    fetch('/api/v1/accounts/Romulo').then((response) => {
        return response.json();
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
    });

}

function buildProfileLists() {
    $('#profile-page').append( compileTemplate(profileLists) )
}
