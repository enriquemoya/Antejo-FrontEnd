/**
 * Created by Enrique on 11/04/2017.
 */

antejo.controller('RevolventeCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload", "CreditsFact", '$routeParams', '$filter', function ($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload, CreditsFact, $routeParams, $filter) {

    const DisposicionType = "Disposicion";
    const PagoType = "Pago";
    $scope.DateNow = new Date().toDateString();
    $scope.DateMin = null;
    $scope.credit = [];
    $scope.cliente = '';
    $scope.lastMove = {}
    $scope.proyecto = '';
    $scope.moves = '';
    $scope.idCredito = $routeParams.idCredito;
    $scope.CreditPadre = '';
    $scope.modalpay = {
        pay: '',
        sel_moneda: '',
        currency: '',
        date: '',
        file: null
    }
    $scope.fileData = {
        file : null,
        idstock : null,
        type : null
    };
    $scope.selectPago = function (credito) {
        $scope.modalDetallePago = credito
    }
    $scope.Disposicion = {}
    $scope.lastCredit = {}
    $scope.newMove = {}

    $scope.AddFilePago = function ($file) {
        if($file){
            $scope.filedata.file = $file;
            $scope.filedata.idstock = $routeParams.idStock;
            $scope.filedata.type = DisposicionType;
        }
        $scope.modalpay.file = $file;
        console.log($scope.filedata);
        console.log("PFSL");
    }
    $scope.AddFileDisposicion = function ($file) {
        if($file){
            $scope.filedata.file = $file;
            $scope.filedata.idstock = $routeParams.idStock;
            $scope.filedata.type = DisposicionType;
        }
        console.log($scope.filedata);
        console.log("DFSL");
        return;
    }
    $scope.deleteFile = function (index) {
        $scope.modalpay.file.splice(index, 1);
        if ($scope.modalpay.file.length < 1) {
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        } else {
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
    }

    $scope.insertDisposicion = function () {
        console.log($scope.Disposicion);
        var Form = new FormData();
        Form.append('file',$scope.filedata.file);
        Form.append('idstock',$scope.filedata.idstock);
        Form.append('type',$scope.filedata.type);
        var auxDate = new Date(Date.parse(angular.copy($scope.Disposicion.start_date)));
        $scope.Disposicion.start_date = angular.copy(auxDate);
        if((auxDate.getDate()<$scope.CreditPadre.datelimit)){
            if($scope.diferencia>=($scope.Disposicion.amount)){
                $scope.Disposicion.extends = $scope.CreditPadreUnedit.id;
                CreditsFact.addFile(Form).then(function(response){
                    if(response.data.error){

                        SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                    }else{

                        $scope.modalpay.file = response.data.file.id;
                        CreditsFact.addCreditPay($scope.Disposicion).then(function (response) {
                            if(response.data.error){
                                SweetAlert.swal("Error:","No se agrego disposición.","error");
                            }else{
                                CreditsFact.updateCreditFile(response.data.credit,$scope.modalpay.file).then(function(response){
                                    if(response.data.error){
                                        SweetAlert.swal("Error2:","No se pudo establecer conexion al servidor.","error");
                                    }else{
                                        SweetAlert.swal({
                                                title: "Mensaje:",
                                                text: "Dispocición Agregada.",
                                                type: "success",
                                                type: "success",
                                                showCancelButton: false,
                                                confirmButtonColor: "#DD6B55",
                                                confirmButtonText: "Aceptar.",
                                                closeOnConfirm: false,
                                                closeOnCancel: false
                                            },
                                            function(isConfirm){
                                                if (isConfirm) {
                                                    location.reload(true);
                                                } else {
                                                    location.reload(true);
                                                }
                                            });
                                    }
                                });

                            }
                        })
                    }

                });
            }else{
                SweetAlert.swal("Mensaje","No puedes disponer mas del total del credito restante.","error");
            }
        }
        else{
            SweetAlert.swal("Mensaje","Fecha fuera de plazo.","error");
        }
    }
    /*
    $scope.insertDisposicion = function () {
        var auxDate = new Date(angular.copy($scope.CreditPadre.start_date));
        if (($scope.Disposicion.start_date < auxDate.setMonth(auxDate.getMonth() + $scope.CreditPadre.term))) {
            if ($scope.CreditPadre.amount >= ($scope.lastMove != null ? $scope.lastMove.capital_balance : 0 + parseFloat($scope.Disposicion.amount))) {
                $scope.Disposicion.extends = $scope.CreditPadreUnedit.id;
                $scope.Disposicion.typemove = 'Disposicion';
                CreditsFact.addCondition($scope.Disposicion, function (callback) {
                    if (callback && callback.error == false) {
                        $scope.getData();
                        $("#modalCondicion").modal("hide");
                        SweetAlert.swal("Mensaje", "Disposición agregada.", "success")
                    } else {
                        console.log('response: ', callback)
                        SweetAlert.swal("Mensaje", "Error al agregar disposición.", "error")
                    }
                })
            } else {
                SweetAlert.swal("Mensaje", "No puedes disponer mas del total del credito restante.", "error");
            }
        }
        else {
            SweetAlert.swal("Mensaje", "Fecha fuera de plazo.", "error");
        }
    }
    */
    $scope.CalcularPago = function () {
        var newMove = angular.copy($scope.lastMove);
        var dateFinal = $scope.addTerm()
        var pago = parseFloat($scope.modalpay.pay)
        var lastDate = new Date($scope.lastMove.period)
        var SelectDate = new Date($scope.modalpay.date)
        var diffDays = Math.floor((SelectDate.getTime() - lastDate.getTime()) / 1000 / 60 / 60 / 24) //Diferencia de dias con la fecha seleccionada y la del ultimo movimiento
        var diffDays2 = Math.floor((dateFinal.getTime() - lastDate.getTime()) / 1000 / 60 / 60 / 24) //Diferencia de dias con la fecha final y la ultima
        var diffDays3 = Math.floor((SelectDate.getTime() - new Date($scope.addTerm().setDate($scope.addTerm().getDate() + $scope.CreditPadre.grace_days)).getTime()) / 1000 / 60 / 60 / 24) //Diferecia si se pasa el
        newMove.period = angular.copy(SelectDate)
        newMove.pay = angular.copy(pago)
        var pagoInteres = 0;
        if (dateFinal.getTime() >= SelectDate.getTime()) {
            var interes = parseFloat(angular.copy($scope.lastMove.interest_balance)) +
                (angular.copy(parseFloat($scope.lastMove.capital_balance)) * ((parseFloat($scope.CreditPadre.interest) / 100 / 365) * diffDays));
            var iva = interes * (parseFloat($scope.CreditPadre.iva) / 100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            $scope.liquidarmodal = Math.round((angular.copy(interes) + angular.copy(iva) + angular.copy(parseFloat($scope.lastMove.capital_balance))));
        }
        if ((new Date(dateFinal.setDate(($scope.addTerm().getDate() + $scope.CreditPadre.grace_days))).getTime() >= SelectDate.getTime()) && (SelectDate.getTime() >= $scope.addTerm().getTime())) {
            var interes = parseFloat(angular.copy($scope.lastMove.interest_balance)) +
                (angular.copy(parseFloat($scope.lastMove.capital_balance)) * ((parseFloat($scope.CreditPadre.interest) / 100 / 365) * diffDays2));
            var iva = interes * (parseFloat($scope.CreditPadre.iva) / 100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            $scope.liquidarmodal = Math.round((angular.copy(interes) + angular.copy(iva) + angular.copy(parseFloat($scope.lastMove.capital_balance))));
        }
        if (new Date($scope.addTerm().setDate($scope.addTerm().getDate() + $scope.CreditPadre.grace_days)).getTime() < SelectDate.getTime()) {
            var interes = parseFloat(angular.copy($scope.lastMove.interest_balance)) +
                (angular.copy(parseFloat($scope.lastMove.capital_balance)) * ((parseFloat($scope.CreditPadre.interest) / 100 / 365) * diffDays2));
            var iva = interes * (parseFloat($scope.CreditPadre.iva) / 100)
            var interesmoratorio = angular.copy(parseFloat($scope.lastMove.interest_arrear_balance)) + ((angular.copy(parseFloat($scope.lastMove.capital_balance)) + angular.copy(parseFloat(interes)) + angular.copy(parseFloat($scope.lastMove.interest_arrear_balance))) * (angular.copy((parseFloat($scope.CreditPadre.interest_arrear)) / 100 / 365) * diffDays3));
            var ivaMoratorio = interesmoratorio * ($scope.CreditPadre.iva / 100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            newMove.interest_arrear = angular.copy(interesmoratorio)
            newMove.iva_arrear = angular.copy(ivaMoratorio)
            $scope.liquidarmodal = Math.round((angular.copy(interes) + angular.copy(interesmoratorio) + angular.copy(iva) + angular.copy(ivaMoratorio) + angular.copy(parseFloat($scope.lastMove.capital_balance))));
        }
        if (ivaMoratorio != null) {
            if (pago >= ivaMoratorio) {
                pago -= ivaMoratorio
                newMove.pay_iva_arrear = angular.copy(ivaMoratorio)
                newMove.interest_arrear_iva_balance = 0
                pagoIvaMoratorio = ivaMoratorio
            } else {
                pagoIvaMoratorio = pago
                newMove.pay_iva_arrear = angular.copy(pago)
                newMove.interest_arrear_iva_balance -= angular.copy(pago)
                pago = 0
            }
        } else {
            newMove.pay_iva_arrear = 0
            newMove.interest_arrear_iva_balance = 0
        }
        if (interesmoratorio != null) {
            if (pago >= interesmoratorio) {
                pago -= interesmoratorio
                newMove.pay_interest_arrear = angular.copy(interesmoratorio)
                newMove.interest_arrear_balance = 0
                pagoInteres+=interesmoratorio
            } else {
                pagoInteres = pago
                newMove.pay_interest_arrear = angular.copy(pago)
                newMove.interest_arrear_balance = angular.copy(interesmoratorio) - angular.copy(pago)
                pago = 0
            }
        } else {
            newMove.pay_interest_arrear = 0
            newMove.interest_arrear_balance -= 0
        }
        if (pago >= iva) {
            pago -= iva
            newMove.pay_iva = angular.copy(iva)
            newMove.iva_balance = 0
            pagoIva = iva
        } else {
            pagoIva = pago
            newMove.pay_iva = angular.copy(pago)
            newMove.iva_balance -= angular.copy(pago)
            pago = 0
        }
        if (pago >= interes) {
            pago -= interes
            newMove.pay_interest = angular.copy(interes)
            newMove.interest_balance = 0
            pagoInteres += interes
        } else {
            pagoInteres = pago
            newMove.pay_interest = angular.copy(pago)
            newMove.interest_balance = angular.copy(interes) - angular.copy(pago)
            pago = 0
        }
        if (pago >= $scope.lastMove.capital_balance && pago > 0) {
            pagoCapital = pago
            newMove.capital_balance -= pago
            newMove.pay_capital = pagoCapital
        } else {
            if (pago == 0) {
                pagoCapital = 0
            } else {
                pagoCapital = $scope.lastMove.capital_balance
            }
        }
        $scope.newMove = newMove;
        $scope.calcInterest = $filter('currency')(angular.copy(pagoInteres))
        $scope.calcIva = $filter('currency')(angular.copy(pagoIva))
        $scope.calcMonto = $filter('currency')(angular.copy(pagoCapital))
        console.log($scope.liquidarmodal,$scope.modalpay.pay)

    }
    /*
    $scope.savePago = function () {
        console.log($scope.newMove)
        $scope.newMove.typemove = 'Pago';
        $scope.newMove.idref = $scope.modalpay.file;
        if($scope.modalpay.file != null){
            CreditsFact.addCreditPay($scope.newMove, function (callback) {
                console.log(callback)
                if (callback.error == false) {
                    SweetAlert.swal({
                            title: "Guardado",
                            text: "PAGO CREADO",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#4bdd86",
                            confirmButtonText: "Cerrar",
                            closeOnConfirm: true
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                location.reload();
                            }
                        });
                } else if (callback.errors.length > 0) {
                    var text = "";
                    for (var i = 0; i < callback.errors.length; i++) {
                        text += '\n' + callback.errors[i];
                    }
                    SweetAlert.swal({
                            title: callback.message,
                            text: text,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#dd654f",
                            confirmButtonText: "Cerrar",
                            closeOnConfirm: true
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                //location.reload();
                            }
                        });
                } else {
                    SweetAlert.swal({
                            title: "Error",
                            text: callback.message,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#dd654f",
                            confirmButtonText: "Cerrar",
                            closeOnConfirm: true
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                //location.reload();
                            }
                        });
                }
            })
        }else{
            SweetAlert.swal('Aviso','No hay comprobante.','error');
        }
    } */

    $scope.savePago = function (){
        var Form = new FormData();
        Form.append('file',$scope.filedata.file);
        Form.append('idstock',$scope.filedata.idstock);
        Form.append('type',$scope.filedata.type);

        CreditsFact.addFile(Form).then(function(response){
            if(response.data.error){
                SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
            }else{
                $scope.modalpay.file = response.data.file.id;
                CreditsFact.addCreditPay($scope.newMove).then(function (response) {
                    callback = response.data;
                    if(callback.error==false){
                        CreditsFact.updateCreditFile(response.data.credit,$scope.modalpay.file).then(function(response){
                            if(response.data.error){
                                SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                            }else{
                                SweetAlert.swal({
                                        title: "Guardado",
                                        text: "PAGO CREADO",
                                        type: "success",
                                        showCancelButton: false,
                                        confirmButtonColor: "#4bdd86",
                                        confirmButtonText: "Cerrar",
                                        closeOnConfirm: true
                                    },
                                    function(isConfirm){
                                        if (isConfirm) {
                                            location.reload();
                                        }
                                    });
                            }
                        });

                    }else if(callback.errors.length>0){
                        var text = "";
                        for(let i = 0;i<callback.errors.length;i++){
                            text+= '\n' + callback.errors[i];
                        }
                        SweetAlert.swal({
                                title: callback.message,
                                text: text,
                                type: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#dd654f",
                                confirmButtonText: "Cerrar",
                                closeOnConfirm: true
                            },
                            function(isConfirm){
                                if (isConfirm) {
                                    //location.reload();
                                }
                            });
                    }else{
                        SweetAlert.swal({
                                title: "Error",
                                text: callback.message,
                                type: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#dd654f",
                                confirmButtonText: "Cerrar",
                                closeOnConfirm: true
                            },
                            function(isConfirm){
                                if (isConfirm) {
                                    //location.reload();
                                }
                            });
                    }
                }).catch(function (error) {
                    console.log(error);
                    SweetAlert.swal("Error:","No se puede establecer conexión con el servidor.","error")
                })
            }

        });

    }
    $scope.addTerm = function () {
        var aux = new Date(angular.copy($scope.CreditPadre.start_date));
        aux.setMonth(aux.getMonth() + angular.copy($scope.CreditPadre.term));
        return aux;
    }
    $scope.DownloadFile = function (id) {
        ApplicationsFact.DownloadFile(id);
    }
    $scope.SelectCondition = function (credito) {
        $scope.ModalDetalleCondicion = credito
    }
    $scope.getData = function () {
        CreditsFact.showCredit($scope.idCredito, function (callback) {
            console.log("Callback ", callback)
            if (callback.error) {
                SweetAlert.swal('Mensaje', "No hay Creditos", "warning");
            } else {
                $scope.credit = angular.copy(callback.credits);
                $scope.cliente = callback.client;
                $scope.proyecto = callback.project;
                $scope.moves = callback.moves;
                $scope.selectedCondicion = callback.moves[$scope.idCredito];
                $scope.CreditPadre = angular.copy($scope.credit[0]);
                delete $scope.CreditPadre.updated_at;
                delete $scope.CreditPadre.deleted_at;
                delete $scope.CreditPadre.created_at;
                $scope.lastCredit = angular.copy(callback.credits.pop())
                $scope.CreditPadre.start_date = new Date($scope.CreditPadre.start_date);
                $scope.CreditPadre.start_date = $scope.CreditPadre.start_date.setDate($scope.CreditPadre.start_date.getDate() + 1);
                $scope.CreditPadreUnedit = angular.copy($scope.CreditPadre);
                $scope.DateMin = callback.lastmove != null ? new Date(callback.lastmove.period).toDateString() : new Date($scope.CreditPadre.start_date).toDateString()
                $scope.lastMove = callback.lastmove;
                $scope.credit.shift();
                $scope.Disposicion = angular.copy($scope.CreditPadre)
                $scope.Disposicion.amount = Math.round($scope.Disposicion.amount);
                if($scope.lastMove == null || $scope.lastMove == undefined){
                    $scope.diferencia = Math.round($scope.CreditPadre.amount);
                }else{
                    $scope.diferencia = angular.copy(parseFloat($scope.CreditPadre.amount)) - angular.copy(parseFloat($scope.lastMove.capital_balance))
                }
                console.log($scope.Disposicion.amount,$scope.diferencia);
            }
        })
    }
    // Inicializacion
    $scope.getData();
}]);