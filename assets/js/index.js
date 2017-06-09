var Account = function(objAccount){
    var self = this;

    self.idCliente = ko.observable(objAccount.idCliente);
    self.nomeCliente = ko.observable(objAccount.nomeCliente);
    self.numeroConta = ko.observable(objAccount.numeroConta);
    self.tipoConta = ko.observable(objAccount.tipoConta);
};

var Infos = function(objAccount){
    var self = this;

    self.cNumeroConta = ko.observable(objAccount.cNumeroConta);
    self.saldoConta = ko.observable(objAccount.saldoConta);
    self.limiteConta = ko.observable(objAccount.limiteConta);
};


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
    self.infosAccount = ko.observable(false);

    //Exibir
    $.ajax ({
        url: window.global.urlapi+"/v1/clientes",
        type: "GET",
        success: function(result){
            var records = result.records;
            for (var i = 0; i < records.length; i++) {
                self.accounts.push(new Account(records[i]));
            }
        }
    });

    //Editar
    self.editAccount = function(editar) {
        self.idCliente(editar.idCliente());
        self.nome(editar.nomeCliente());
        self.numero(editar.numeroConta());
        self.tipo(editar.tipoConta());
        self.editing(true);
    }

    self.editButton = ko.computed(function(){
        return self.editing() ? 'Editar' : 'Registrar';
    })

    //remover
    self.removeAccount = function(account) {
        console.log('removeAccount');
        $.ajax ({
            url:window.global.urlapi+"/v1/clientes/" + account.idCliente(),
            type:"DELETE",
            success: function(del) {
                self.accounts.remove(account);
            }
        });
    }
    //Registrar
    self.register = function() {
        if (false === self.editing()){
            return self.add();
        }
        self.edit();
    }

    self.add = function() {
        $.ajax ({
            url: window.global.urlapi+"/v1/clientes",
            type: "POST",
            data: {
                nomeCliente: self.nome(),
                numeroConta: self.numero(),
                tipoConta: self.tipo()
            },
            success: function(insert) {
                self.accounts.push(new Account(insert.records));
                self.nome('');
                self.numero('');
                self.tipo('');
            }
        });
    }

    self.edit = function() {
        $.ajax ({
            url: window.global.urlapi+"/v1/clientes/" + self.idCliente(),
            type: "PUT",
            data: {
                nomeCliente: self.nome(),
                numeroConta: self.numero(),
                tipoConta: self.tipo()
            },
            success: function(result) {
                var searchAccount = ko.utils.arrayFirst(self.accounts(), function(editingAccount){
                    return editingAccount.idCliente() === self.idCliente();
                });
                searchAccount.nomeCliente(result.records.nomeCliente);
                searchAccount.numeroConta(result.records.numeroConta);
                searchAccount.tipoConta(result.records.tipoConta);
                self.nome('');
                self.numero('');
                self.tipo('');
                self.editing(false);
            }
        });
    }

    var accentRemover = function(s) {
        var jsonAccentMap = '{"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"a","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ß":"s","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y"}';
        var ret = '';

        for (var i = 0; i < s.length; i++) {
            ret += JSON.parse(jsonAccentMap)[s.charAt(i)] || s.charAt(i);
        }

        return ret;
    };


    self.filteredAccounts = ko.computed(function() {
        if (self.finding().trim().length === 0) {
            return self.accounts();
        }
        return self.accounts().filter(function(account){
            return account.numeroConta().indexOf(self.finding().trim()) >= 0
            || accentRemover(account.nomeCliente().toLowerCase()).indexOf(accentRemover(self.finding().toLowerCase())) >= 0
            || accentRemover(account.tipoConta().toLowerCase()).indexOf(accentRemover(self.finding().toLowerCase())) >= 0;
        })
    });


    // self.infosAccount = function() {
    //     infosAccount(true);
    // }

    // self.verif = function() {
    //     if(false === infosAccount()) {
    //     }
    //         $.ajax ({
    //             url: window.global.urlapi+"/v1/contas",
    //             type: "GET",
    //             success: function(result){
    //                 var records = result.records;
    //                 for (var i = 0; i < records.length; i++) {
    //                     self.accountsInfo.push(new Infos(records[i]));
    //                 }
    //             }
    //         });
    // }


}


window.model = new ModelAccounts();

ko.applyBindings(window.model);



