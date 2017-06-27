/**
 * Created by Enrique on 29/05/2017.
 */
antejo.controller('ApplicationEditCtrl', ['$filter', 'SweetAlert', 'ApplicationsFact','$routeParams', function ($filter, SweetAlert, ApplicationsFact,$routeParams) {
    var ctrl = this;
    ctrl.menu='info';
    ctrl.Clients = [];
    ctrl.Application = {
        id: $routeParams.idApp,
        idclient: null,
        amountrequest: null,
        applicationdate: null,
        place: null,
        creditterm: null,
        projectname: null,
        status: null
    }
    ctrl.Aval = {
        id: null,
        idapplication: null,
        name: null,
        lastname: null,
        rfc: null,
        curp: null,
        birthday: null,
        country: null,
        nacionality: null,
        email: null,
        fiel: null,
        address: null,
        phone: null,
        maritalstatus: null,
        regimen: null,
        relationship: null,
        companyjob: null,
        phonejob: null,
        occupation: null,
        oldwork: null,
        typeguarantee: null,
        idguarantee: null,
        idfile: null,
    }
    ctrl.file = {
        id: null,
        idapplication: null,
        name: null,
        path: null,
        extension: null,
        mime: null,
        type: null
    }
    ctrl.GetClients = function () {
        ApplicationsFact.AllClients().then(function (response) {
            if (response.data.error == true) {
                SweetAlert.swal('Mensaje', "No hay Clientes Capaces de solicitar.", 'warning');
            } else {
                ctrl.Clients = response.data.clients;
            }
        }).catch(function (error) {
            console.log(error)
            SweetAlert.swal('Error', 'Error al comunicarse con el servidor.', 'error')
        })
    }
    ctrl.createApplication = function () {
        ctrl.Application.status = "Pendiente";
        ApplicationsFact.addApplication(ctrl.Application).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                ctrl.Application = response.data.app;
                SweetAlert.swal("Aviso:","Creado.","success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Error:","Error al conectarse con servidor.","error");
        })
    }
    ctrl.UpdateApplication = function () {
        ApplicationsFact.updateApplication(ctrl.Application.id,ctrl.Application).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                SweetAlert.swal("Aviso:","Guardado.","success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Error:","Error al conectarse con servidor.","error");
        })
    }
    ctrl.createAval = function () {
        ctrl.Aval.idapplication = ctrl.Application.id;
        ApplicationsFact.addCreditAid(ctrl.Aval).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                ctrl.GetApplication();
                SweetAlert.swal("Aviso:","Creado.","success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Error:","Error al conectarse con servidor.","error");
        })
    }
    ctrl.SubirDom = function($file) {
        if (!angular.equals(null, $file)) {
            var Form = new FormData();
            Form.append('file',$file);
            Form.append('idapplication',ctrl.Application.id);
            Form.append('type','Domicilio');
            console.log(Form,$file);
            ApplicationsFact.AddFile(Form).then(function (response) {
                if(response.data.error){
                    SweetAlert.swal("Aviso","Error: \n"+response.data.message,"error");
                }else{
                    ctrl.GetApplication();
                    SweetAlert.swal("Aviso",response.data.message,"success");
                }
            }).catch(function (error) {
                console.log(error);
                SweetAlert.swal("Aviso","No se pudo conectar con el servidor.","warning");
            })
        }else{
            SweetAlert.swal("Aviso","Archivo invalido.","warning");
        }
    }
    ctrl.SubirCuentas = function($file) {
        if (!angular.equals(null, $file)) {
            var Form = new FormData();
            Form.append('file',$file);
            Form.append('idapplication',ctrl.Application.id);
            Form.append('type','Cuentas');
            ApplicationsFact.AddFile(Form).then(function (response) {
                if(response.data.error){
                    SweetAlert.swal("Aviso","Error: \n"+response.data.message,"error");
                }else{
                    ctrl.GetApplication();
                    SweetAlert.swal("Aviso",response.data.message,"success");
                }
            }).catch(function (error) {
                console.log(error);
                SweetAlert.swal("Aviso","No se pudo conectar con el servidor.","warning");
            })
        }else{
            SweetAlert.swal("Aviso","Archivo invalido.","warning");
        }
    }
    ctrl.SubirIdentificacion = function($file) {
        if (!angular.equals(null, $file)) {
            var Form = new FormData();
            Form.append('file',$file);
            Form.append('idapplication',ctrl.Application.id);
            Form.append('type','Identificacion');
            ApplicationsFact.AddFile(Form).then(function (response) {
                if(response.data.error){
                    SweetAlert.swal("Aviso","Error: \n"+response.data.message,"warning");
                }else{
                    ctrl.GetApplication();
                    SweetAlert.swal("Aviso",response.data.message,"success");
                }
            }).catch(function (error) {
                console.log(error);
                SweetAlert.swal("Aviso","No se pudo conectar con el servidor.","error");
            })
        }else{
            SweetAlert.swal("Aviso","Archivo invalido.","warning");
        }
    }
    ctrl.DownloadFile = function (id) {
        ApplicationsFact.DownloadFile(id);
    }
    ctrl.DeleteCreditAid = function (id) {
        ApplicationsFact.DeleteCreditAid(id).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                ctrl.GetApplication();
                SweetAlert.swal("Aviso:","Eliminado.","success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Aviso","No se pudo conectar con el servidor.","error");
        })
    }
    ctrl.SelectAval = function(aval){
        aval.birthday = new Date(Date.parse(aval.birthday));
        aval.oldwork = new Date(Date.parse(aval.oldwork));
        ctrl.Aval = angular.copy(aval);
    }
    ctrl.editAval = function () {
        ApplicationsFact.UpdateCreditAid(ctrl.Aval).then(function(response){
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                ctrl.Aval = {
                    id: null,
                    idapplication: null,
                    name: null,
                    lastname: null,
                    rfc: null,
                    curp: null,
                    birthday: null,
                    country: null,
                    nacionality: null,
                    email: null,
                    fiel: null,
                    address: null,
                    phone: null,
                    maritalstatus: null,
                    regimen: null,
                    relationship: null,
                    companyjob: null,
                    phonejob: null,
                    occupation: null,
                    oldwork: null,
                    typeguarantee: null,
                    idguarantee: null,
                    idfile: null,
                }
                SweetAlert.swal("Aviso:",response.data.message,"success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Aviso","No se pudo conectar con el servidor.","error");
        })
    }
    ctrl.GetApplication = function () {
        ApplicationsFact.showApplication(ctrl.Application.id).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso","Error: \n"+response.data.message,"warning");
            }else {
                ctrl.avales = response.data.creditaids;
                ctrl.files = response.data.files;
                response.data.application.applicationdate = new Date(Date.parse(response.data.application.applicationdate));
                ctrl.Application = response.data.application;
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Aviso","No se pudo conectar con el servidor.","error");
        })
    }

    // Inicializacion
    ctrl.GetApplication();
    ctrl.GetClients();
}]);