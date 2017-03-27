<?php
define('EMAIL_ADMIN_SENT_TO', 'html@aisconverse.com');
define('EMAIL_ADMIN_SUBJECT', 'Feedback letter from contacts form on Mexico');
define('EMAIL_CLIENT_SUBJECT', 'Feedback letter from Mexico');

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: html@aisconverse.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$_POST[ 'php' ] = true;

$errors = array();

if ( is_array( $_POST ) && !empty( $_POST) ) {
	foreach ( $_POST as $name => $data ) {
		if ( !empty( $data[ 'required' ] ) && !strip_tags( trim( $data[ 'value' ] ) ) ) {
			$errors[] = $name;
		}
		if ( !empty( $data[ 'type' ] ) && 'email' === $data[ 'type' ] && $data[ 'value' ] && !filter_var( $data[ 'value' ], FILTER_VALIDATE_EMAIL ) ) {
			$errors[] = 'email';
		}
	}
}

$name = !empty( $_POST[ 'name' ] ) && is_array( $_POST[ 'name' ] ) && !empty( $_POST[ 'name' ][ 'value' ] ) ? $_POST[ 'name' ][ 'value' ] : '';
$email = !empty( $_POST[ 'email' ] ) && is_array( $_POST[ 'email' ] ) && !empty( $_POST[ 'email' ][ 'value' ] ) ? $_POST[ 'email' ][ 'value' ] : '';
$age = !empty( $_POST[ 'age' ] ) && is_array( $_POST[ 'age' ] ) && !empty( $_POST[ 'age' ][ 'value' ] ) ? $_POST[ 'age' ][ 'value' ] : '';
$city = !empty( $_POST[ 'city' ] ) && is_array( $_POST[ 'city' ] ) && !empty( $_POST[ 'city' ][ 'value' ] ) ? $_POST[ 'city' ][ 'value' ] : '';
$send_form_select = !empty( $_POST[ 'send-form-select' ] ) && is_array( $_POST[ 'send-form-select' ] ) && !empty( $_POST[ 'send-form-select' ][ 'value' ] ) ? $_POST[ 'send-form-select' ][ 'value' ] : '';
$send_form_radio = !empty( $_POST[ 'send-form-radio' ] ) && is_array( $_POST[ 'send-form-radio' ] ) && !empty( $_POST[ 'send-form-radio' ][ 'value' ] ) ? $_POST[ 'send-form-radio' ][ 'value' ] : '';
$message = !empty( $_POST[ 'message' ] ) && is_array( $_POST[ 'message' ] ) && !empty( $_POST[ 'message' ][ 'value' ] ) ? $_POST[ 'message' ][ 'value' ] : '';

if (empty($errors)) {
	$datetime = date('Y-m-d H:i:s');

	$author = '';
	if ( $name || $email ) {
		$author = 'Author: ';
		if ( $name ) {
			$author .= $name . ' ';
		}
		if ( $email ) {
			$author .= "<a href='mailto:{$email}'>{$email}</a>";
		}

		$author .= '<br/>';
	}

	$age_text = '';
	if ( $age ) {
		$age_text ="Age: <br/>{$age} <br/><br/>";
	}

	$city_text = '';
	if ( $city ) {
		$city_text ="City: <br/>{$city} <br/><br/>";
	}

	$message_text = '';
	if ( $message ) {
		$message_text ="Message: <br/>{$message} <br/><br/>";
	}

	$select_text = '';
	if ( $send_form_select ) {
		$select_text ="Select {$send_form_select} <br/>";
	}

	$radio_text = '';
	if ( $send_form_radio ) {
		$radio_text ="Radio {$send_form_radio} <br/>";
	}

	$letterToAdmin = <<<MSG
<html>
<body>
	<strong>Feedback form</strong><br/>
	{$author}
	{$age_text}
	{$city_text}
	{$message_text}
	{$select_text}
	{$radio_text}
	Email was sent at {$datetime}
</body>
</html>
MSG;

$name_text = '';
if ( $name ) {
	$name_text = "Hi, {$name}! <br/>";
}

$message_text = '';
if ( $message ) {
	$message_text ="Your message: <br/>{$message} <br/><br/>";
}

$select_text = '';
if ( $send_form_select ) {
	$select_text ="Your select {$send_form_select} <br/>";
}

$radio_text = '';
if ( $send_form_radio ) {
	$radio_text ="Your radio {$send_form_radio} <br/><br/>";
}

$letterToClient = <<<MSG
<html>
<body>
	{$name_text}
	You sent a message to Mexico administrators at {$datetime}.<br/><br/>
	Wait answer in few days. We will send our reply on {$email} <br/>

	{$message_text}

	{$age_text}
	{$city_text}

	{$select_text}
	{$radio_text}

	Thank you for your letter!
</body>
</html>
MSG;

	mail(EMAIL_ADMIN_SENT_TO, EMAIL_ADMIN_SUBJECT, $letterToAdmin, $headers);
	mail($email, EMAIL_CLIENT_SUBJECT, $letterToClient, $headers);

	$response = array('status' => 'ok');
} else {
	$response = array(
		'status' => 'error', 
		'errors' => $errors
	);
}

die(json_encode($response));