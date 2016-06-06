(function(){
   "use strict";

   var Tegevused = function(){

     // SEE ON SINGLETON PATTERN
     if(Tegevused.instance){
       return Tegevused.instance;
     }
     //this viitab Tegevus fn
     Tegevused.instance = this;

     this.routes = Tegevused.routes;
     // this.routes['home-view'].render()

     console.log('Tegevused sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.currentRoute = null;
     this.teges = [];
     console.log(this);

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   //window.Moosipurk = Moosipurk; // Paneme muuutja külge

   //kirjeldatud kõik lehed
   Tegevused.routes = {
     "home-view" : {
       render: function(){
         console.log('JS avalehel');
       }
     },
     "list-view" : {
       render: function(){
       console.log('JS loend lehel');
       }
     },
     "manage-view" : {
       render: function(){
         console.log('JS haldus lehel');
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Tegevused.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }

       //saan kätte purgid localStorage kui on
       if(localStorage.teges){
           //võtan stringi ja teen tagasi objektideks
           this.tege = JSON.parse(localStorage.teges);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.teges.forEach(function(jar){

               var new_teges = new Tege(teges.id, teges.Nimetus, teges.Prioriteet, teges.timeAdded);

               var li = new_teges.createHtmlElement();
               document.querySelector('.list-of-teges').appendChild(li);

           });

       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-teges').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trükkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
     edit: function(event){
       var selected_id = event.target.dataset.id;
       var clicked_li = event.target.parentNode;
        $("#ModalEdit").modal({backdrop: true});

            $(document).on("click", "#edit_close", function(event){
         return;
       });

        $(document).on("click", "#save", function(event){
            console.log(clicked_li);
          var Tegevus = document.querySelector('.EditTegevus').value;
          var Prioriteet = document.querySelector('.EditPrioriteet').value;
          this.teges = JSON.parse(localStorage.teges);
          clicked_li.parentNode.removeChild(klops);
        for(var i=0; i<this.teges.length; i++){
          if(this.teges[i].id == selected_id){
            this.teges[i].Tegevus = Tegevus;
            this.teges[i].Prioriteet = Prioriteet;
            break;
          }
        }
        localStorage.setItem('teges', JSON.stringify(this.teges));
        location.reload();
       });
     },
	 delete: function(event){

		var c = confirm("Oled kindel?");

		// vajutas no, pani ristist kinni
		if(!c){	return; }

		//KUSTUTAN
		console.log('kustutan');

		// KUSTUTAN HTMLI
		var ul = event.target.parentNode.parentNode;
		var li = event.target.parentNode;

		ul.removeChild(li);

		//KUSTUTAN OBJEKTI ja uuenda localSt