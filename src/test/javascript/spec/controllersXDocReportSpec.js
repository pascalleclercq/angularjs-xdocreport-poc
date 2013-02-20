'use strict';

describe('XDocReportCtrl', function() {
	var controller;
	var scope;
	var httpBackend;
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope;

		this.addMatchers({
			toBeGreaterThanOrEqualTo : function(expected) {
				return this.actual >= expected;
			},
		equals : function(expected) {
			return this.actual == expected;
		}
		});

		controller = $controller('XDocReportCtrl', {
			$scope : scope
		});
	}));

	// testing controller

	
	it('should receive a dummy blob', inject(function($httpBackend) {
		httpBackend = $httpBackend;
		var data = {
				convertRequest : {
					outputFormat : "PDF",
					via : "XWPF"
				}
		};
		
		//var aFileParts = ["<a id=\"a\"><b id=\"b\">hey!<\/b><\/a>"];
		//var oMyBlob = new Blob(aFileParts, { "type" : "text\/xml" }); // the blob
		var response = 'Dummy';
		
		httpBackend.expectPOST('jaxrs/convert', data).respond(response);
		//scope.convert(controller.NOTE_ON, 77);
		scope.convert();
		//var blobURLref = window.URL.createObjectURL(response);
		//expect(scope.latency).toBeGreaterThanOrEqualTo(0);
		expect(scope.result).equals("about:blank");
	}));
});