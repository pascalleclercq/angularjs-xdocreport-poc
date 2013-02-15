'use strict';

function XDocReportCtrl($scope, $http) {

	$scope.convertRequest = {
		convertRequest : {
			outputFormat : "PDF",
			via : "XWPF",
			document : null
		}
	};

	$scope.setFiles = function(element) {
		$scope.$apply(function() {
			// console.log('files:', element.files);
			// Turn the FileList object into an Array
			var f = element.files[0];
			if (f) {
				var r = new FileReader();
				r.onload = function(e) {
					var contents = e.target.result;
					
					var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(contents)));
/*					
					alert("Got the file.n"
							+ "name: " + f.name + "\n"
							+ "type: " + f.type + "\n"
							+ "size: " + f.size
							+ " bytes\n" + "starts with: " + base64String);
*/					   
					$scope.convertRequest.convertRequest.fileName = f.name;
					$scope.convertRequest.convertRequest.mimeType = f.type;
					$scope.convertRequest.convertRequest.document = base64String;
				};
				r.readAsArrayBuffer(f);
			} else {
				alert("Failed to load file");
			}
		});
	};

	$scope.convert = function() {
		$http.post('toto/convert', $scope.convertRequest).success(
				function(code, response) {
					alert(code+" - "+response);
				});
	};
}
