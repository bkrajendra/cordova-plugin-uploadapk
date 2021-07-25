# UploadApk

An Android Cordova plugin to add hook after build complete to upload APK to a server.

This plugin adds a hook into your cordova, ionic project to upload apk to private server after build.
Its designed specifically for Android platform.

## Need for UploadApk?
Intention behind this plugin is to provide a complementary support for a cordova app-update plugin [cordova-plugin-app-update](https://www.npmjs.com/package/cordova-plugin-app-update) which updates apk from private server with our own apk.

As its needed to upload apk every time we build, this plugin automates the process of uploading apk to private server, which can be consumed latter by update script and update request from app.

## Installation
Run following command at your project root

```
cordova plugin add cordova-plugin-uploadapk
```

Currently plugin only works with android platform.

## How it works
This plugin adds a javascript hook to automate upload of apk after-build, the js file is at path:

```
plugins\cordova-plugin-uploadapk\scripts\build-after.js
```

For this plugin to work properly, what you need is a 
- simple php script running on server to accept a uploaded file and move it to appropriate location.
The simple instruction to create php file upload script can be found here: 
```https://www.w3schools.com/php/php_file_upload.asp```

- And making few changes in the build-after.js file for your upload url (YOUR_SERVER_URL) and a key (YOUR_PASSWORD). The key is optional and can be avoid if its not required in php upload script.

Currently I am sending two parameteres here, **file** and a **key** (password).

At server side script checks for valid apk and key (sha256), uploads file to proper location on server.

Find a upload script from my implementation for [octobercms/wintercms](https://wintercms.com/):



```php
function onStart(){

	if (Request::isMethod('post')) {
		
        // change this path as per your server path for apk storage
		$destinationPath = "/home/user/public_html/storage/app/media/application/";
		$fileName = Input::file('apk')->getClientOriginalName();
		$size = Input::file('apk')->getSize();
		$path = Input::file('apk')->getRealPath();
		$extension = Input::file('apk')->getClientOriginalExtension();
		$mime = Input::file('apk')->getMimeType();
        
		$key = Input::get('key');
        //Its needed to create a sha256 key hash to add here
		$p_key = "ADD_A_SHA256_HASH_FOR_YOUR_PASSWORD_HERE";
		
		$file = Input::file('apk');
		if (Input::hasFile('apk') && ($mime =='application/zip') && ($extension =='apk') && ($fileName =='app-debug.apk') && ($p_key == hash('sha256', $key))) {
		    Input::file('apk')->move($destinationPath, $fileName);
		    $path = Input::file('apk')->getRealPath();
		    return Response::json(['state' => 'success','mime' => $mime,'ext' => $extension,'name' => $fileName]);
		} else {
			return Response::json(['state' => 'fail']);
		}
	}
	return Response::json(['state' => 'fail']);
}
```

