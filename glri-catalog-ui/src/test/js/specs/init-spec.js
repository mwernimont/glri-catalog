describe("Javascript imports: ", function() {
	//this is only imported during and required for testing
    it("loads jQuery library", function() {
        expect(jQuery).toBeDefined();
    });
    
    it("loads jQuery simulate library", function() {
        expect(jQuery.simulate).toBeDefined();
    });

//    it("loads underscore.js library", function() {
//        expect(_).toBeDefined();
//    });
    


    it("loads Angular library", function() {
        expect(angular).toBeDefined();
    });
    
    it("loads Angular Mocks library", function() {
         expect(angular.mock).toBeDefined();
    });
    
    it("loads Angular bootstrap library", function() {
        expect( angular.module('ui.bootstrap') ).toBeDefined();
    });
    
    it("loads glri module", function() {
        expect( angular.module('GLRICatalogApp') ).toBeDefined();
    });        
    
});
