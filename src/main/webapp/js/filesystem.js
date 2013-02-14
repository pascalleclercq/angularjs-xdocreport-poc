function onInitFs(fs) {
	alert('Opened file system: ' + fs.name);
}
function errorHandler(e) {
	var msg = '';

	switch (e.code) {
	case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	default:
		msg = 'Unknown Error';
		break;
	}
	;

	alert('Error: ' + msg);
}
function filesystem() {
	window.requestFileSystem = window.requestFileSystem
			|| window.webkitRequestFileSystem;
	window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024 /* 5MB */,
			onInitFs, errorHandler);
	window.webkitStorageInfo.requestQuota(PERSISTENT, 1024 * 1024, function(
			grantedBytes) {
		window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs,
				errorHandler);
	}, function(e) {
		alert('Error', e);
	});

}