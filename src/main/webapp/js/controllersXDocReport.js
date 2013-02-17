'use strict';

function XDocReportCtrl($scope, $http) {

	 $scope.model = {
		convertRequest : {
			outputFormat : "PDF",
			via : "XWPF"
		}
	};
	var model = $scope.model;
	$scope.setFiles = function(element) {
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			$scope.$apply(function() {
						// Turn the FileList object into an Array
						var f = element.files[0];
						if (f) {
							var r = new FileReader();
							r.onload = function(e) {
								var contents = e.target.result;
								var base64String = btoa(String.fromCharCode
										.apply(null, new Uint8Array(contents)));
								model.convertRequest.fileName = f.name;
								model.convertRequest.mimeType = f.type;
								model.convertRequest.document = base64String;
								
							};
							r.readAsArrayBuffer(f);
						} else {
							alert("Failed to load file");
						}
					});
		} else {
			alert('The File APIs are not fully supported in this browser.\n Please, update your browser...');
		}
	};

	$scope.convert = function() {
		//$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		$http.defaults.headers.post["Content-Type"] = "application/json";
		$http.defaults.headers.post["Accept"] = "application/pdf";
		$http.post('jaxrs/convert', model).success(
				function(data, status, headers, config) {
					 if (data) {
						 var blob = new Blob([data],{type:"application/pdf"});
						 var blobURLref = window.URL.createObjectURL(blob);
						 document.getElementById('previewFrame').src=blobURLref;
					 }	
				});
	};
//	
//	var BASE64_MARKER = ';base64,';
//
//	function convertDataURIToBinary(dataURI) {
//	  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
//	  var base64 = dataURI.substring(base64Index);
//	  var raw = window.atob(base64);
//	  var rawLength = raw.length;
//	  var array = new Uint8Array(new ArrayBuffer(rawLength));
//	  var i=0;
//	  for(i = 0; i < rawLength; i++) {
//	    array[i] = raw.charCodeAt(i);
//	  }
//	  return array;
//	}
}
