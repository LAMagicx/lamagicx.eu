<?php
    define('SERVER_ROOT', __DIR__);
    include_once 'utils/settings.php';
    include_once 'utils/router.php';
    include_once 'utils/session.php';

    $url = $_SERVER['REQUEST_URI'];
    $path = explode('?', $url, 2)[0];
    $path_array = array_slice(explode('/', $path), 1);

    Router::add('', get_path('views', 'coming-soon.html')); // Sans regex ni wildcard
    Router::add('functions', get_path('utils', 'ajax-controller.php'));
    Router::add('mail', get_path('views', 'sendmail.php'));
    Router::add('sendmail', get_path('views', 'mailtest.php'));
    Router::add('math', get_path('math', 'math.php'));
    Router::add('tree', get_path('tree', 'tree.html'));

    $scan = scandir(get_path('views', 'math/'));
    foreach($scan as $file) {
        if (!is_dir(get_path('views', "math/$file"))) {
            Router::add(explode('.', $file, 2)[0], get_path('views', "math/$file"));
            echo "<script> console.log('" . explode('.', $file, 2)[0] . "');</script>";
        }
    }

    Router::default(get_path('views', 'error.php'));

    try {
        Router::start($path_array);
    } catch (\Throwable $th) {
        http_response_code(500);
        die();
    }
?>
