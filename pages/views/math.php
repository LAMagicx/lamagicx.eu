<?php 

$scan = scandir(get_path('views', 'math/'));
foreach($scan as $file) {
   if (!is_dir(get_path('views', "math/$file"))) {
      echo "<a href=" . explode('.', $file, 2)[0] . ">$file</a><br>";
   }
}

?>
