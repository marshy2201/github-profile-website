$(function () {

    const $section = $('section');
    const $textInput = $('input[type="text"]');
    let username = 'marshy2201';

    //username on submit
    $('form').on('submit', function (e) {
        e.preventDefault();
        username = $textInput.val()
        loadData();
        $textInput.val('');
    });
    
    function loadData() {
    
        //user info JSON
        $.getJSON('https://api.github.com/users/' + username, function (data) {
            let content = '';
            content += '<div><p><b>Name: </b>' + data.name + '</p>';
            content += '<p><b>Username:</b> ' + data.login + '</p>';
            content += '<p><b>Location: </b> ' + data.location + '</p>';
            content += '<img src="' + data.avatar_url + '" /></div>';
            content += '<p><b>Bio: </b>' + data.bio + '</p>';
            content += '<p><b>Website: </b><a href="http://www.lewismarshall.co.uk">' + data.blog + '</a></p>';
            content += '<p><b>Repositories:</b> ' + data.public_repos;
            //update section
            $section.html(content).hide().fadeIn(700);
        }).fail(function () {
            content = '<p>Sorry there is no username called ' + username + '.</p>';
            username = 'marshy2201';
            $section.html(content).hide().fadeIn(700);
        });

        //repo info JSON
        $.getJSON('https://api.github.com/users/' + username + '/repos', function (repo) {
            let content = '';
            content += '<ul>';

            $.each(repo, function (index, value) {
                content += '<li><a href="#">' + value.name + '</a></li>';
            });

            content += '</ul>';
            //update section
            $section.append(content).hide().fadeIn(700);

            //click on repo
            $section.on('click', 'li a', function (e) {
                e.preventDefault();
                $this = $(this);
                let content = '';
                const $repoInfo = $('<article id="repo-info"></article>');

                $.each(repo, function (i, val) {
                    if ($this.text() === val.name) {
                        content += '<h2>' + val.name + '</h2>';
                        content += '<p>' + val.description + '</p>';
                    }
                });

                $repoInfo.append(content);

                //repo info JSON
                $.getJSON('https://api.github.com/repos/' + username + '/' + $this.text(), function (data) {
                    let content = '<p><b>File Size:</b> ' + data.size + ' KB';
                    $repoInfo.append(content);
                });

                //master commits info JSON
                $.getJSON('https://api.github.com/repos/' + username + '/' + $this.text() + '/commits/master', function (data) {
                    let content = '<p><b>Additions: </b>' + data.stats.additions + '</p>';
                    content += '<p><b>Deletions: </b>' + data.stats.deletions + '</p>';
                    content += '<ul>';
                    $repoInfo.append(content);
                });

                //commits info JSON
                $.getJSON('https://api.github.com/repos/' + username + '/' + $this.text() + '/commits', function (data) {
                    let content = '<h3>Commits</h3>';
                    let number = 1;

                    $.each(data, function (i, val) {
                        content += '<p><b>' + number + '.</b> ' + val.commit.message + '</p>';
                        number++;
                    });

                    $repoInfo.append(content);
                });

                $section.html($repoInfo).hide().fadeIn(800);
            });
        });
    }
    
    loadData();

    //return to profile
    $('nav a').on('click', function (e) {
        e.preventDefault();
        loadData();
    });
    
});