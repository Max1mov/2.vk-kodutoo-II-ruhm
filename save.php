<?php

  $file_name= "data.txt";

  $entries_from_file = file_get_contents($file_name);

  //massiiv olemasolevate purkidega
  $entries = json_decode($entries_from_file);


  if(isset($_GET["id"]) && isset($_GET["title"]) && isset($_GET["ingredients"]) && isset($_GET["test"]) && !empty($_GET["id"]) && !empty($_GET["title"]) && !empty($_GET["ingredients"]) && !empty($_GET["test"])){

	  //salvestan juurde
	  $object = new StdClass();
	  $object->id = $_GET["id"];
	  $object->title = $_GET["title"];
	  $object->ingredients = $_GET["ingredients"];
    $object->test = $_GET["test"];

	  //lisan massiiivi juurde
	  array_push($entries, $object);

	  //teen stringiks
	  $json = json_encode($entries);

	  //salvestan
	  file_put_contents($file_name, $json);

  }

  if(isset($_GET_delete["id"]) && isset($_GET_delete["title"]) && isset($_GET_delete["ingredients"]) && isset($_GET_delete["ingredients"])){

    //salvestan juurde
    $object_delete = new StdClass();
    $object_delete->id = $_GET_delete["id"];
    $object_delete->title = $_GET_delete["title"];
    $object_delete->ingredients = $_GET_delete["ingredients"];
    $object_delete->test = $_GET_delete["test"];

    //teen stringiks
    $json = json_encode($entries);

    //salvestan
    file_put_contents($file_name, $json);

  }


  //var_dump($entries);
	echo(json_encode($entries));



?>
