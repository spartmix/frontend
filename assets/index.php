<!DOCTYPE html>
<html>
<head>
    <title>Gerenciar Clientes</title>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/img/sad-frog--feels-bad-man---meme-512-222252.png" />
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/index.css">
    <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> -->
</head>
<body>

<?php
    include("includes/nav.html");
?>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-8" style="float:left;">
        <!-- Mostra os dados no tela -->
        <?php
            include("includes/arrayClientes.html");
        ?>
        </div>
        <!-- Inputs com registro de conta e cliente -->
        <?php
            include("includes/registro.html");
        ?>
        <!-- Modal com informações e funções do array Contas-->
        <?php
            include("includes/modal.html");
        ?>
    </div>
</div>
 <script>
    function somenteNumeros(num) {
        var er = /[^0-9.]/;
        er.lastIndex = 0;
        var campo = num;
        if (er.test(campo.value)) {
          campo.value = "";
        }
    }

 </script>

<script type="text/javascript" src="./vendor/jquery/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="./vendor/bootstrap/js/bootstrap.min.js"></script>
<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
<!-- <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
<script type="text/javascript" src="./vendor/knockout/knockout-3.4.2.js"></script>
<script type="text/javascript" src="./js/global.js"></script>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>