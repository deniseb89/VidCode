<?PHP
<html>
<head>
<title>Uploader</title>
</head>
<body>
<?PHP

//var_dump($_FILES);
//var_dump($_POST);

$uploadfilename = time() . "_" . rand(1000,9999) . "_" . basename($_FILES['bytes']['name']);
$uploaddir = '/home/vanevery/mobvcasting.com/up/';
$uploadfile = $uploaddir . $uploadfilename;

if (isset($_POST['submit']))
{
	if (move_uploaded_file($_FILES['bytes']['tmp_name'], $uploadfile)) 
	{
    		echo "Video Sent!<br />" . $uploadfilename;
	} 
	else 
	{
    		echo "Error: Video Not Sent!<br />";
    		echo "<pre>";
    		echo print_r($_FILES);
			echo print_r($_POST);
    		echo "</pre>";
	}
}
?>
<form enctype="multipart/form-data" method="post" action="index.php">
File: <input type="file" name="bytes" /><br />
Title: <input type="text" name="title" /><br />
Body: <input type="text" name="body" /><br />
<input type="submit" name="submit" value="submit" />
<br />7M limit
</form>
</body>
</html>
