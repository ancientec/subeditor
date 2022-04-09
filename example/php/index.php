<?php

//cross domain hack for testing, should not use in production
header("Access-Control-Allow-Origin: *");

if(!empty($_FILES)) {
    upload();
    exit;
}

echo "ready for test";

function upload() {
    //should only have one file:
    $result = array();
    foreach ($_FILES as $key => $file) {
        $name = "uploaded-".uniqid()."-".$file['name'];
        $result = ['Name' => $name, 
        'File' => '/upload/'.$name, 
        'URL' => 'http://localhost:8000//upload/'.$name,
        'Type' => $file['type'],
        'Thumb' => 'http://localhost:8000//upload/'.$name,
        'Size' => $file['size'],
        'Ext' => substr($file['name'], strpos($file['name'], "."))
        ];
        move_uploaded_file($file['tmp_name'], __DIR__."/upload/".$name);
    }
    header("Content-Type: application/json");
    echo json_encode($result);

}