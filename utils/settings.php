<?php
/**
 * Global settings.
 */


 // Branding and URL settings
 define('SETTINGS', array(
     'name' => 'lamagicx',
     'version' => '0.0.1',
     'url' => 'http://lamagicx.eu',
     'proxy' => false
 ));
// Time zone settings, see https://www.php.net/manual/en/timezones.php
 date_default_timezone_set('Europe/Paris');
 // List of possible path were web server files are stored for router to look into
 define('PATH', array(
     'utils' => SERVER_ROOT . '/utils/',
     'views' => SERVER_ROOT . '/pages/views/',
     'math' => SERVER_ROOT . '/pages/views/',
     'tree' => SERVER_ROOT . '/pages/views/tree/',
     'partials' => SERVER_ROOT . '/pages/partials/',
     'static' => SERVER_ROOT . '/pages/static/',
     'images' => SERVER_ROOT . '/pages/static/images/',
     'css' => SERVER_ROOT . '/pages/static/css/',
     'js' => SERVER_ROOT . '/pages/static/js/',
     'other' => SERVER_ROOT . '/pages/static/other/',
 ));
 ?>
