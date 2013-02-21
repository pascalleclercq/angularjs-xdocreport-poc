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
		
		var aFileParts = ["<a id=\"a\"><b id=\"b\">hey!<\/b><\/a>"];
		//'Blob' is not define (yet)
		var response = new Blob(aFileParts, { "type" : "text\/xml" }); // the blob
		//var response = 'Dummy';
		//,{responseType : 'blob'}
		httpBackend.expectPOST('jaxrs/convert', data).respond(200,response);
		//scope.convert(controller.NOTE_ON, 77);
		scope.convert();
		httpBackend.flush();
		//var blobURLref = window.URL.createObjectURL(response);
		//expect(scope.latency).toBeGreaterThanOrEqualTo(0);
		expect(scope.result).equals("about:blank");
	}));
});