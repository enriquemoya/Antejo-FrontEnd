/**
 * Created by Enrique on 18/05/2017.
 */
antejo.controller('FundsCtrl', ['$filter', 'SweetAlert','FoundFact','$routeParams', function($filter, SweetAlert,FoundFact,$routeParams) {
    this.idStock = $routeParams.idStock;
    var ctrl = this;
    ctrl.fund = [];
    ctrl.GetAll = function () {
        FoundFact.fundsByStock(ctrl.idStock).then(response=>{
            if(response.data.error){
                ctrl.stock = response.data.stock;
                console.log(ctrl.stock.type)
                if(ctrl.stock.type=='Moral'){
                    ctrl.title = ctrl.stock.businessname;
                }else{
                    ctrl.title = ctrl.stock.name+' '+ctrl.stock.lastname;
                }
                SweetAlert.swal('Mensaje',"No hay Creditos para este Fondeador.",'warning');
            }else{
                for(var i = 0;i<response.data.fund.length;i++){
                    response.data.fund[i].statuscode = 0;
                    if((Date.now()/1000)>response.data.fund[i].datelimit){
                        response.data.fund[i].statuscode = 1;
                        if(Date.now()/1000>response.data.fund[i].grace){
                            response.data.fund[i].statuscode = 2;
                        }
                    }
                    response.data.fund[i].datelimit = new Date((response.data.fund[i].datelimit*1000)+(1000*60*60*24));
                }
                ctrl.fund = response.data.fund;
                ctrl.stock = response.data.stock;
                console.log(ctrl.stock.type)
                if(ctrl.stock.type=='Moral'){
                    ctrl.title = ctrl.stock.businessname;
                }else{
                    ctrl.title = ctrl.stock.name+' '+ctrl.stock.lastname;
                }
            }
        }).catch(function (error) {
            console.log(error)
            SweetAlert.swal('Error','Error al comunicarse con el servidor.','error')
        })
    }

    // Inicializacion
    ctrl.GetAll();
}]);