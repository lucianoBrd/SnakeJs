<?php
if(isset($_GET['1']) && isset($_GET['2']) && isset($_GET['3'])){
  $data = array(
  	'Niveau1' => $_GET['1'],
  	'Niveau2' => $_GET['2'],
  	'Niveau3' => $_GET['3'],
  );
  $fp = fopen('./assets/scores/score.json', 'w+');
  fwrite($fp, json_encode($data));
  fclose($fp);
}
