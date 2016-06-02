(function(){
   "use strict";

   var Tegevus = function(){

     // SEE ON SINGLETON PATTERN
     if(Tegevus.instance){
       return Tegevus.instance;
     }
     //this viitab Tegevus fn
     Tegevus.instance = this;

     this.routes = Tegevus.routes;
     // this.routes['home-view'].render()

     console.log('Tegevus sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.tege = [];
     this.currentRoute = null;
     console.log(this);

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   //window.Moosipurk = Moosipurk; // Paneme muuutja külge

   Tegevus.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         //console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Tegevus.prototype = {

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
       if(localStorage.tege){
           //võtan stringi ja teen tagasi objektideks
           this.tege = JSON.parse(localStorage.tege);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.tege.forEach(function(jar){

               var new_tege = new Tege(tege.id, tege.Nimetus, tege.Prioriteet, tege.timeAdded);

               var li = new_tege.createHtmlElement();
               document.querySelector('.list-of-tege').appendChild(li);

           });

       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-tege').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trükkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
     edit: function(event){
       var selected_id = event.target.dataset.id;
       var klops = event.target.parentNode;
        $("#ModalEdit").modal({backdrop: true});

            $(document).on("click", "#edit_close", function(event){
         return;
       });

        $(document).on("click", "#save", function(event){
            console.log(klops);
          var TegevusName = document.querySelector('.EditTegevusName').value;
          var PrioriteetName = document.querySelector('.EditPrioriteetName').value;
  this.tege = JSON.parse(localStorage.tege);
        klops.parentNode.removeChild(klops);
        for(var i=0; i<this.tege.length; i++){
          if(this.tege[i].id == selected_id){
            this.tege[i].TegevusName = TegevusName;
            this.tege[i].PrioriteetName = PrioriteetName;
            break;
          }
        }
        localStorage.setItem('tege', JSON.stringify(this.tege));
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

		//KUSTUTAN OBJEKTI ja uuenda localStoragit

		var delete_id = event.target.dataset.id;

		for(var i = 0; i < this.tege.length; i++){

			if(this.tege[i].id == delete_id){
				//see on see
				//kustuta kohal i objekt ära
				this.tege.splice(i, 1);
				break;
			}
		}

		localStorage.setItem('tege', JSON.stringify(this.tege));



	 },
     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // ühe listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisõna on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }
             if(li.style.display == 'list-item'){kokku++;}
             document.querySelector('#kokku').innerHTML='Kokku: '+kokku;
         }
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var TegevusName = document.querySelector('.title').value;
       var PrioriteetName = document.querySelector('.ingredients').value;
      var timeAdded = this.writeDate();

    
			}
		};

		//teeb päringu
		xhttp.open("GET", "save.php?id="+id+"&title="+title+"&ingredients="+ingredients"&test="+test, true);
		xhttp.send();


       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-tege').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menüü lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LÕPP

   var Jar = function(new_id, new_title, new_priori, new_time){
	 this.id = new_id;
     this.title = new_title;
     this.priori = new_priori;
     this.time = new_time;
     console.log('created new tege');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // võttes title ja ingredients ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | ingredients
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.priori + ' | ' + this.time);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

	   //DELETE nupp
	   var span_delete = document.createElement('span');
	   span_delete.style.color = "red";
	   span_delete.style.cursor = "pointer";

	   //kustutamiseks panen id kaasa
	   span_delete.setAttribute("data-id", this.id);

	   span_delete.innerHTML = " Delete";

	   li.appendChild(span_delete);

	   //keegi vajutas nuppu
	   span_delete.addEventListener("click", Tegevus.instance.deleteJar.bind(Moosipurk.instance));

       return li;

     }
   };

   //HELPER
   function guid(){
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Moosipurk();
   };

})();
