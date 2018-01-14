'use strict';

// Register the 'purchaseForm' page along with its controller an template
angular.
  module('purchaseForm').
  component('purchaseForm', {
    templateUrl: 'app/purchase-form/purchase-form.template.html',
    controller: ['$routeParams', '$location', 'Purchase', 'Project',
      function PurchaseFormController($routeParams, $location, Purchase, Project) {

        //get data if exist; if not create an empty object
        $routeParams.id ? this.purchase = Purchase.api.get({ id: $routeParams.id }) : 
                          this.purchase = {comments: '', requestDate : new Date().getTime()};
        

        //retrieve the list of projects, status, type and supplier
        this.projList = Project.api.query();

        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        this.editPurchase = function () {
          return Purchase.save(this.purchase).then(
            function(value){
              console.log('Purchase saved: ID=', value.id);
              $location.path("/purchases")},
            function(err) {
              console.error("The purchase cannot be modified",  err.status, err.statusText)});
        };

        this.uploadFile = function() {
          var f = document.getElementById('file').files[0],
          r = new FileReader();

          r.onloadend = function(e) {
            var data = e.target.result;
            var blob = new Blob([data], {type: "application/pdf",});
            return Purchase.invoice.upload({id: vm.purchase.id}, blob);
            
          }
      
          r.readAsArrayBuffer(f);
        }
      }
    ]
  });
