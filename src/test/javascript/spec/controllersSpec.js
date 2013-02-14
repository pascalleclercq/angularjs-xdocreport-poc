'use strict';

describe('PianoCtrl', function() {
	var controller;
	var scope;
	var httpBackend;
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope;

		this.addMatchers({
			toBeGreaterThanOrEqualTo : function(expected) {
				return this.actual >= expected;
			}
		});

		controller = $controller('PianoCtrl', {
			$scope : scope
		});
	}));

	// testing controller

	
	it('should measure latency on each send', inject(function($httpBackend) {
		httpBackend = $httpBackend;
		var data = {
			jsonMidiMessage : {
				channel : 0,
				note : 77,
				velocity : 60
			}
		};
		var response = {
			jsonMidiMessage : {
				channel : 0,
				command : 144,
				note : 77,
				velocity : 60
			}
		};
		
		httpBackend.expectPOST('data/midi/send', data).respond(response);
		scope.sendMidiCommand(controller.NOTE_ON, 77);
		expect(scope.latency).toBeGreaterThanOrEqualTo(0);
	}));
});