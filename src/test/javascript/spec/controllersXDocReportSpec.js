'use strict';

describe('XDocReportCtrl', function() {
	var controller;
	var scope;
	var httpBackend;
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope;

		this.addMatchers({

			startWith : function(expected) {
				 var str= this.actual.toString();
				return str.substr(0,5) == expected;
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
		// 'Blob' is not define (yet)
		var response = new Blob([ "dummy" ]); // the blob
		// var response = 'Dummy';
		// ,{responseType : 'blob'}
		httpBackend.expectPOST('jaxrs/convert', data).respond(200, response);
		// scope.convert(controller.NOTE_ON, 77);
		scope.convert();
		httpBackend.flush();
		// var blobURLref = window.URL.createObjectURL(response);
		
		expect(scope.result).startWith("blob:");
	}));
});