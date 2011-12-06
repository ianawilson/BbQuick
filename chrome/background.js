var engineURL = 'http://localhost:8000/';

$(document).ready(function() {
    $.get('http://my.rochester.edu/',
        function(data) {
            $.post(engineURL + 'getContentURL', {'html': data}, 
                function(response) {
                    console.log(response)
                }
            );
        }

    );
});
