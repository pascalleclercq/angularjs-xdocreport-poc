	'use strict';

function XDocReportCtrl($scope, $http) {

	$scope.model = {
		convertRequest : {
			outputFormat : "PDF",
			via : "XWPF"
		}
	};
	$scope.result="about:blank";
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
						var base64String = btoa(String.fromCharCode.apply(null,
								new Uint8Array(contents)));
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
		$http.post('jaxrs/convert', model, {
			responseType : 'blob'
		}).success(function(data, status, headers, config) {
			var blobURLref = window.URL.createObjectURL(data);
			$scope.result=blobURLref;
		}).error(function(data, status, headers, config) {
			var blobURLref = window.URL.createObjectURL(data);
			$scope.result=blobURLref;
		});
	};

	

//	function get_type(thing) {
//		if (thing === null)
//			return "[object Null]"; // special case
//		return Object.prototype.toString.call(thing);
//	}

}
