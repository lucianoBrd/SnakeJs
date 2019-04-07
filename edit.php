<?php
if(isset($_GET['1']) && isset($_GET['2']) && isset($_GET['3']) && isset($_GET['4']) && isset($_GET['1n']) && isset($_GET['2n']) && isset($_GET['3n']) && isset($_GET['4n'])){
  $niv1 = htmlspecialchars($_GET['1']);
  $niv1N = htmlspecialchars($_GET['1n']);
  $niv2 = htmlspecialchars($_GET['2']);
  $niv2N = htmlspecialchars($_GET['2n']);
  $niv3 = htmlspecialchars($_GET['3']);
  $niv3N = htmlspecialchars($_GET['3n']);
  $niv4 = htmlspecialchars($_GET['4']);
  $niv4N = htmlspecialchars($_GET['4n']);
  $data = array(
  	'Niveau1' => array($niv1, $niv1N),
  	'Niveau2' => array($niv2, $niv2N),
    'Niveau3' => array($niv3, $niv3N),
    'Niveau4' => array($niv4, $niv4N)
  );
  $fp = fopen('./assets/scores/score.json', 'w+');
  fwrite($fp, json_encode($data));
  fclose($fp);
}
