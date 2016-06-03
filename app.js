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
            this.tege[i].TegevusName = Nimetus;
            this.tege[i].PrioriteetName = Prioriteet;
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

       var Nimetus = document.querySelector('.Nimetus').value;
       var Prioriteet = document.querySelector('.Prioriteet').value;
      var timeAdded = this.writeDate();

      //console.log(BookAuthor+' '+BookName+' Lisatud: '+timeAdded);
      var className = document.getElementById("show-feedback").className;
      //lisan masiivi purgid


      if(Nimetus === '' || Prioriteet === ''){
          if(className == "feedback-success"){
              document.querySelector('.feedback-success').className=document.querySelector('.feedback-success').className.replace('feedback-success','feedback-error');
          }
          document.querySelector('#show-feedback').innerHTML='Kõik read peavad täidetud olema';
      }else{
        if(className == "feedback-error"){
          document.querySelector('.feedback-error').className=document.querySelector('.feedback-error').className.replace('feedback-error','feedback-success');
        }
        document.querySelector('#show-feedback').innerHTML='Salvestamine õnnestus';
        var new_tege = new Book(guid(), Nimetus, Prioriteet, timeAdded);
        //lisan massiivi moosipurgi
        this.tege.push(new_tege);
        //console.log(JSON.stringify(this.books));
        //JSON'i stringina salvestan local storagisse
        localStorage.setItem('tege', JSON.stringify(this.tege));
        document.querySelector('.list-of-tege').appendChild(new_tege.createHtmlElement());


			}
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
 	},
  writeDate : function(){
      var d = new Date();
      var day = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();
      //#clock element htmli
      var curTime = this.addZeroBefore(day)+"."+this.addZeroBefore(month+1)+"."+year;
      return curTime;
  },
  addZeroBefore : function(number){
      if(number<10){
      number="0"+number;
      }
      return number;
  },
    trimWord: function (str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
  }
    };
  var Tege = function(new_id, new_Nimetus, new_Prioriteet, new_timeAdded){
  this.id = new_id;
    this.Nimetus = new_Nimetus;
    this.Prioriteet = new_Prioriteet;
    this.timeAdded = new_timeAdded;
    console.log('created new tege');
  };

   Tege.prototype = {
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

       var letter = document.createTextNode(this.Nimetus.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.Nimetus + ' | ' + this.Prioriteet + ' | ' + this.timeAdded);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

	   //DELETE nupp
     var delete_span = document.createElement('button');
     delete_span.setAttribute('data-id', this.id);
     delete_span.innerHTML = "Kustuta";
     li.appendChild(delete_span);
     delete_span.addEventListener('click', Tegevus.instance.delete.bind(Tegevus.instance));

     var edit_span = document.createElement('button');
     edit_span.setAttribute('data-id', this.id);
     edit_span.innerHTML = "Muuda";
     li.appendChild(edit_span);
     edit_span.addEventListener('click', Tegevus.instance.edit.bind(Tegevus.instance));


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
     var app = new Tegevus();
   };

})();
