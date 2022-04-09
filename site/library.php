<?php

$kw = !empty($_REQUEST['keyword']) ? strtolower($_REQUEST['keyword']) : "";
$page = !empty($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
$perpage = !empty($_REQUEST['perpage']) ? intval($_REQUEST['perpage']) : 20;

$libdata = [];
$cached = __DIR__."/upload/cache.library.json";
if(!file_exists($cached) || !$libdata = json_decode(file_get_contents($cached), true)) {
    $d = file_get_contents("https://picsum.photos/v2/list?page=1&limit=100");
    $libdata = json_decode($d, true);
    file_put_contents($cached, $d);
}



$data = [];
if($kw) {
    foreach ($libdata as $pic) {
        if(strpos(strtolower($pic['author']), $kw) !== false) $data[] = $pic;
    }
} else $data = $libdata;

$dataPaged = [];
$start = ($page -1)*$perpage;

$total = count($data);
$end = $start + $perpage > $total ? $total : $start + $perpage; 

for($i = $start; $i < $start + $perpage; $i++ ) {
    $dataPaged[] = $data[$i];
}

$output = [
    "Pages" => [
        "Total" => $total, 
        "TotalPages" => ceil($total/$perpage),
        "Page" => $page,
        "PerPage" => $perpage],
    "Data" => $dataPaged
];

//cross domain hack for testing, should not use in production
//header("Access-Control-Allow-Origin: *");
header("content-type:application/json");
echo json_encode($output);

