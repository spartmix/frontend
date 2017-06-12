var Account = function(objAccount){
    var self = this;

    self.idCliente = ko.observable(objAccount.idCliente);
    self.nomeCliente = ko.observable(objAccount.nomeCliente);
    self.numeroConta = ko.observable(objAccount.numeroConta);
    self.tipoConta = ko.observable(objAccount.tipoConta);
    self.cNumeroConta = ko.observable(objAccount.cNumeroConta);
    self.saldoConta = ko.observable(objAccount.saldoConta);
    self.limiteConta = ko.observable(objAccount.limiteConta);
};

// var Infos = function(objAccount){
//     var self = this;

//     self.cNumeroConta = ko.observable(objAccount.cNumeroConta);
//     self.saldoConta = ko.observable(objAccount.saldoConta);
//     self.limiteConta = ko.observable(objAccount.limiteConta);
// };


var ModelAccounts = function () {
    var self = this;
    self.accounts = ko.observableArray();
    self.idCliente = ko.observable();
    self.nome = ko.observable('');
    self.numero = ko.observable('');
    self.tipo = ko.observable('');
    self.editing = ko.observable(false);
    self.finding = ko.observable('');
    self.accountsInfo = ko.observableArray();
    self.infosAccount = ko.observable('');


    //Exibir
    $.ajax ({
        url: window.global.urlapi+"/v1/clientes",
        type: "GET",
        success: function(result){
            console.log(result);
            var records = result.records;
            for (var i = 0; i < records.length; i++) {
                self.accounts.push(new Account(records[i]));

            }
        }
    });


}


window.model = new ModelAccounts();

ko.applyBindings(window.model);