var app = {

	/**************************************************************************
	*	Elemento JSON que llama a demas elemento con sus respectivas funciones
	***************************************************************************/
	inicio: function(){
		app.refrescarLista();
		app.iniciarBotones();
		app.iniciaFastclick();
		app.iniciaDiv();
	},

	/***************************************************************************
	*	Elemento en JSON con funcion que retorna la llamada de la base de datos
	****************************************************************************/
	bD: function(){
		return window.openDatabase("notas", "1.0", "Lista de Notas", 100000);
	},

	/*********************************************************************************
	*	Transaccion para insertar datos en los campos de la tabla en la base de datos
	**********************************************************************************/
	guardarNota: function(){
		/*Variable para poder ejecutar las transacciones en la base de datos*/
		var db = app.bD();

		db.transaction(function(tx){
			/*Creacion de la atabla, si no existe*/
			tx.executeSql('create table if not exists notas1 (nota, comentario)');
							/*insercion de datos en tabla*/
			tx.executeSql('insert into notas1 (nota, comentario) values ("'+app.extraerTitulo()+'", "'+app.extraerComentario()+'")');
		});
	},

	/********************************************************
	*	Inicio de la funcion para refrescar lista de notas
	********************************************************/
	refrescarLista: function(){
		/*Variable para poder ejecutar las transacciones en la base de datos*/
		var db = app.bD();

		db.transaction(function(tx){
			/*Consulta a los datos de la tabla*/
			tx.executeSql('select * from notas1', [],
			 function(tx, results){	/*Funcion si la consulta se realizo con exito*/
			 	/*alert('cargado');*/
			 	var len = results.rows.length;	/*Se obtiene la longitud de los resultados de la consulta*/
			 	var div_notas = document.getElementById('notes-list');	/*objeto con propiedades de un elemento div HTML*/
			 	/*Insercion de los resultados de la consulta en el documento HTML*/
			 	for (i = 0; i < len; i++) { 
                  msg = '<div class="note-item" id="notas'+i+'">' + results.rows.item(i).nota + '</div>';
                  div_notas.innerHTML +=  msg; 
               } 
			 }, 
			 function(){	/*Funcion si la consulta genero un error*/
			 	alert('algo salio mal');
			 });
		});	
	},

	/**************************************************************************
	*	Elemento del JSON que permite agregar vento de escucha a los botones
	**************************************************************************/
	iniciarBotones: function(){
		/*	variables objeto con propiedades de los botones en el documento HTML*/
		var btn_aniadir = document.querySelector('#aniadir');
		var btn_salvar = document.querySelector('#salvar');

		/*Se agrega el evento escucha a los botones para cuando sean presionados*/
		btn_aniadir.addEventListener('click', this.mostrarEditor, false);
		btn_salvar.addEventListener('click', this.salvarNota, false);
	},

	/*************************************************
	*	Elemento JSON que carga la libreria fastclick
	*************************************************/
	iniciaFastclick: function(){
		fastclick.attach(document.body);
	},

	/**************************************
	*	Elemento JSON que oculta el editor
	***************************************/
	ocultarEditor: function(){
		document.getElementById('note-editor').style.display = "none";
	},

	/***********************************************
	*	Elemento JSON que permite mostrar el editor
	************************************************/
	mostrarEditor: function(){
		document.getElementById('titulo').value = "";
		document.getElementById('comentario'). value = "";
		document.getElementById('note-editor').style.display = "block";
		document.getElementById('titulo').focus();
	},

	/**********************************************************
	*	Elemento JSON que permite extraer el titulo de la nota
	***********************************************************/
	extraerTitulo: function(){
		return document.getElementById('titulo').value;
	},

	/*************************************************************
	*	Elemento JSON que permite extraer el comentario de la nota
	**************************************************************/
	extraerComentario: function(){
		return document.getElementById('comentario').value;
	},

	/******************************************************************************
	*	Elemento JSON que guarda datos en base de datos y refresca lista de notas
	*******************************************************************************/
	salvarNota: function(){
		app.guardarNota();
		app.refrescarLista();
		app.ocultarEditor();
	},
};

/*Comprobacion para cuando l aaplicacion este cargada*/
if('addEventListener' in document){
	document.addEventListener("deviceready", function(){
		app.inicio();
	},false);
}
