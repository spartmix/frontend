var Account = function(objAccount){
    var self = this;
    self.idCliente = ko.observable(objAccount.idCliente);
    self.nomeCliente = ko.observable(objAccount.nomeCliente);
    self.numeroConta = ko.observable(objAccount.numeroConta);
    self.tipoConta = ko.observable(objAccount.tipoConta);
    self.cNumeroConta = ko.observable(objAccount.cNumeroConta);
    self.saldoConta = ko.observable(objAccount.saldoConta);
    self.limiteConta = ko.observable(objAccount.limiteConta);
    self.idConta = ko.observable(objAccount.idConta);
};


var ModelAccounts = function () {
    var self = this;
    self.accounts = ko.observableArray(); //Array com os valores dos clientes :v
    self.teste = ko.observableArray(); // Array com valores das contas;
    self.idCliente = ko.observable('');
    self.idConta = ko.observable('');
    self.nome = ko.observable('');
    self.numero = ko.observable('');
    self.saldo = ko.observable('');
    self.limite = ko.observable('');
    self.sConta = ko.observable('');
    self.lConta = ko.observable('');
    self.editing = ko.observable(false);
    self.finding = ko.observable('')
    self.showAgain = ko.observable('');
    self.isDisabled = ko.observable(false);
    self.disableEdit = ko.observable(true);
    self.isHidden = ko.observable('none');
    self.isHiddenAlt = ko.observable('none');
    self.isHiddenSec = ko.observable('none');
    self.tipoConta = ko.observable('Corrente');
    self.tipo = ko.observable(true);
    self.somarSaldo = ko.observable('');
    self.tirarValor = ko.observable('');
    self.isHiddenLast = ko.observable('none');
    self.valorTransf = ko.observable('');
    self.contaDestino = ko.observable('');
    self.contaAtual = ko.observable('');
    self.isDisabledLast = ko.observable(true);
    self.isDisabledFirst = ko.observable(false);

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

    self.editAccount = function(editar) {
        self.idCliente(editar.idCliente());
        self.nome(editar.nomeCliente());
        self.numero(editar.numeroConta());
        self.editing(true);
        self.isDisabled(true);
        self.disableEdit(false);
        self.isDisabledFirst(true);

        self.tipo(true);
        if ('Poupança' === editar.tipoConta()) {
            self.tipo(false);
        }
    }

    self.editButton = ko.computed(function(){
        return self.editing() ? 'Editar' : 'Registrar';
    })

    self.deleteConta = function(account) {
        $.ajax ({
            url:window.global.urlapi+"/v1/clientes/" + account.idCliente(),
            type:"DELETE",
            success: function(del) {
                self.accounts.remove(account);
            }
        });
    }

    self.removeAccount = function(account) {
        if (confirm("Você deseja realmente remover essa conta?") === true) {
             $.ajax ({
                url:window.global.urlapi+"/v1/clientes/" + account.idCliente(),
                type:"DELETE",
                success: function(del) {
                    self.accounts.remove(account);
                }
            });
        }
    }

    self.register = function() {
        if (false === self.editing()){
            self.add();
            self.ad();
            return;
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
                tipoConta: self.tipoConta()
            },
            success: function(insert) {
                self.accounts.push(new Account(insert.records));
                self.idCliente(insert.records.idCliente);
                self.nome('');
                self.tipo(true);
            }
        });
    }

    self.ad = function() {
        $.ajax ({
            url: window.global.urlapi+"/v1/contas",
            type: "POST",
            data: {
                cNumeroConta: self.numero(),
                limiteConta: self.limite(),
                saldoConta: self.saldo()
            },
            success: function(insert) {
               var secSearch = ko.utils.arrayFirst(self.accounts(), function(secEditingAccount){
                    return secEditingAccount.idCliente() === self.idCliente();
                });
                self.idConta(insert.records.idConta);
                secSearch.idConta(insert.records.idConta);
                secSearch.cNumeroConta(insert.records.numeroConta);
                secSearch.saldoConta(insert.records.saldoConta);
                secSearch.limiteConta(insert.records.limiteConta);
                self.saldo('');
                self.limite('');
                self.numero('');
            }
        })
    }

    self.edit = function() {
        $.ajax ({
            url: window.global.urlapi+"/v1/clientes/" + self.idCliente(),
            type: "PUT",
            data: {
                nomeCliente: self.nome(),
                numeroConta: self.numero(),
                tipoConta: self.tipoConta()
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
                self.editing(false);
                self.isDisabled(false);
                self.disableEdit(true);
                self.isDisabledFirst(false);
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

    self.infosAccount = function(consulta) {
        self.teste.push(consulta);
        self.nome('');
        self.numero('');
        self.editing(false);
        self.isDisabled(false);
    }

    self.backRegister = function() {
        self.nome('');
        self.numero('');
        self.tipo('');
        self.editing(false);
        self.isDisabled(false);
        self.disableEdit(true);
        self.isDisabledFirst(false);
    }

    self.editConta = function(edit) {
        self.isHidden('');
        self.valorTransf('');
        self.contaDestino('');
        self.isHiddenAlt('none');
        self.isHiddenSec('none');
        self.isHiddenLast('none');
        self.idConta(edit.idConta());
        self.sConta(edit.saldoConta());
        self.lConta(edit.limiteConta());
    }

    self.changeValues = function() {
        $.ajax ({
            url: window.global.urlapi+"/v1/contas/" + self.idConta(),
            type: "PUT",
            data: {
                saldoConta: self.sConta(),
                limiteConta: self.lConta()
            },
            success: function(result) {
                var accountSearch = ko.utils.arrayFirst(self.teste(), function(accountEditing){
                    return accountEditing.idConta() === self.idConta();
                });

                accountSearch.saldoConta(result.records.saldoConta);
                accountSearch.limiteConta(result.records.limiteConta);
                self.sConta('');
                self.lConta('');
            }
        });
    }

    self.inserirDeposito = function() {
        $.ajax ({
            url: window.global.urlapi+"/v1/contas/depositar/" + self.idConta(),
            type: "POST",
            data: {
                depositarValor: self.somarSaldo()
            },
            success: function(result) {
                var insertValues = ko.utils.arrayFirst(self.teste(), function(inserting){
                    return inserting.idConta() === self.idConta();
                });
                insertValues.saldoConta(result.records.saldoConta);
                self.somarSaldo('');
            }
        })
    }

    self.sacarValores = function() {
        $.ajax({
            url:window.global.urlapi+"/v1/contas/sacar/" + self.idConta(),
            type: "POST",
            data: {
                sacarValor: self.tirarValor()
            },
            success: function(result) {
                var saque = ko.utils.arrayFirst(self.teste(), function(sacando) {
                    return sacando.idConta() === self.idConta();
                });
                saque.saldoConta(result.records.saldoConta);
                self.tirarValor('');
            }
        })
    }

    self.transferirValores = function() {
        $.ajax({
            url:window.global.urlapi+"/v1/contas/transferir",
            type: "POST",
            data: {
                contaAtual: self.contaAtual(),
                contaDestino: self.contaDestino(),
                valorTransferencia: self.valorTransf()
            },
            success: function(result) {
                var transf = ko.utils.arrayFirst(self.teste(), function(transferindo) {
                    return transferindo.idConta() === self.idConta();
                });

                var depContaDestino = ko.utils.arrayFirst(self.accounts(), function(saque) {
                    return saque.cNumeroConta() === self.contaDestino();
                });
                depContaDestino.saldoConta(result.records.Destino.saldoConta);
                transf.saldoConta(result.records.Atual.saldoConta);
                self.contaDestino('');
                self.valorTransf('');
            }
        })
    }

    self.showAgain = function() {
        self.isHidden('none');
        self.isHiddenAlt('none');
        self.isHiddenSec('none');
    }

    self.sacar = function(id) {
        self.idConta(id.idConta());
        self.saldo('');
        self.limite('');
        self.somarSaldo('');
        self.valorTransf('');
        self.isHiddenAlt('');
        self.contaDestino('');
        self.isHidden('none');
        self.isHiddenSec('none');
        self.isHiddenLast('none');
    }

    self.closeMenu = function() {
        self.saldo('');
        self.limite('');
        self.isHidden('none');
    }

    self.closeMenuAlt = function() {
        self.tirarValor('');
        self.isHiddenAlt('none');
    }

    self.closeMenuSec = function() {
        self.somarSaldo('');
        self.isHiddenSec('none');
    }

    self.closeMenuLast = function() {
        self.isHiddenLast('none');
        self.contaDestino('');
        self.valorTransf('');
    }

    self.depositar = function(teste) {
        self.saldo('');
        self.limite('');
        self.somarSaldo('');
        self.tirarValor('');
        self.isHiddenSec('');
        self.valorTransf('');
        self.contaDestino('');
        self.isHidden('none');
        self.isHiddenAlt('none');
        self.isHiddenLast('none');
        self.idConta(teste.idConta());
    }

    self.transferir = function(conta) {
        self.saldo('');
        self.limite('');
        self.tirarValor('');
        self.isHiddenLast('');
        self.isHidden('none');
        self.isHiddenSec('none');
        self.isHiddenAlt('none');
        self.idConta(conta.idConta());
        self.contaAtual(conta.cNumeroConta());
    }

    self.tipo.subscribe(function() {
        self.tipoConta(self.tipo() ? 'Corrente' : 'Poupança');
    })
}

window.model = new ModelAccounts();

ko.applyBindings(window.model);



$("#myModal").on("hidden.bs.modal", function () {
    window.model.teste.removeAll();
    window.model.isHidden('none');
    window.model.isHiddenLast('none');
});

$('#idDoElemento').change(function() {
    window.model.tipo($(this).prop('checked'));
});