const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {

    const later = () => {
      timeout = null;
      
      // Execute the callback
      func(...args);
    };
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
  };
};

$(document).ready(function(){
    $("#search").on("keyup", debounce(handleInput, 800).bind(this));
});

function handleInput(e){
    var username = e.target.value;

    $.ajax({
        url: `https://api.github.com/users/${username}`,
        data: {
            client_id: '26b7861a9a08d40ab40a',
            client_secret: 'f91536333f286f2d2b45ca2f86b10714d993ba22'    
        }
    })
    .done(function(user){
        $.ajax({
            url: `https://api.github.com/users/${username}/repos`,
            data: {
                client_id: '26b7861a9a08d40ab40a',
                client_secret: 'f91536333f286f2d2b45ca2f86b10714d993ba22',
                sort: "created: asc",
                per_page: 5   
            }
        })
        .done(function(repos){
            $.each(repos, function(index, repo){
                $("#repos").append(`
                    <div class="well">
                        <div class="row">
                            <div class="col-md-5">
                                <strong>${repo.name}</strong>: ${repo.description}
                            </div>
                            <div class="col-md-5">
                                <span class="btn btn-danger">Forks: ${repo.forks}</span>
                                <span class="btn btn-primary">Watchers: ${repo.watchers_count}</span>
                                <span class="btn btn-success">Stars: ${repo.stargazers_count}</span>
                            </div>
                            <div class="col-md-2">
                                <a href="${repo.html_url}" target="_blank" class="btn btn-danger">View Repo</a>
                            </div>
                        </div>
                    </div>
                `)
            });
        });
        $("#profile").html(`
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${user.name}</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${user.avatar_url}" class="img-thumbnail" s alt="">
                            <a href="${user.html_url}" class="btn btn-danger btn-block" target="_blank">View Profile</a>
                        </div>
                    <div class="col-md-9">
                        <span class="label btn btn-danger">Public Repos: ${user.public_repos}</span>
                        <span class="label btn btn-primary">Public Gists: ${user.public_gists}</span>
                        <span class="label btn btn-success">Followers: ${user.followers}</span>
                        <span class="label btn btn-info">Following: ${user.following}</span>
                        <br><br>
                        <ul class="list-group">
                            <li class="list-group-item">Company: ${user.company}</li>
                            <li class="list-group-item">Website/blog: ${user.blog}</li>
                            <li class="list-group-item">Location: ${user.location}</li>
                            <li class="list-group-item">Member Since: ${user.created_at}</li>
                        </ul>
                    </div>
                </div>
                </div>
            </div>

            <h3>Lastest Repos</h3>
            <div id="repos"></div>
        `);
    });
}