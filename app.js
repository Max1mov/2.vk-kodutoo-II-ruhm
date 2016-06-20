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
   Tegevus.routes = {
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
       if(localStorage.teges){
           //võtan stringi ja teen tagasi objektideks
           this.teges = JSON.parse(localStorage.teges);
           console.log('laadisin localStorageist massiiivi ' + this.teges.length);

           //tekitan loendi htmli
           this.teges.forEach(function(teges){

               var new_teges = new Tege(teges.id, teges.Nimetus, teges.Prioriteet, teges.timeAdded);

               var li = new_teges.createHtmlElement();
               document.querySelector('.list-of-teges').appendChild(li);

           });

       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('#show-feedback').addEventListener('click', this.addNewClick.bind(this));

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
        var BookAuthor = document.querySelector('.EditNimetus').value;
        var BookName = document.querySelector('.EditPrioriteet').value;
        this.teges = JSON.parse(localStorage.teges);
        clicked_li.parentNode.removeChild(clicked_li);
        for(var i=0; i<this.teges.length; i++){
          if(this.books[i].id == selected_id){
            this.books[i].Nimetus = Nimetus;
            this.books[i].Prioriteet = Prioriteet;
            break;
          }
        }
        localStorage.setItem('books', JSON.stringify(this.books));
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

    for(var i=0; i<this.teges.length; i++){
      if(this.teges[i].id == event.target.dataset.id){
        //kustuta kohal i objekt ära
        this.teges.splice(i, 1);
        //ei lähe edasi
        break;
      }
    }
    localStorage.setItem('teges', JSON.stringify(this.teges));
	 },
     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-teges li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // ühe listitemi sisu tekst
             var stack = li.querySelector('.list-of-teges').innerHTML.toLowerCase();

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

       var Nimetus = this.trimWord(document.querySelector('.Nimetus').value);
       var Prioriteet = this.trimWord(document.querySelector('.Prioriteet').value);
       var timeAdded = this.writeDate();


       //  nimetus + prioriteet + timeAdded
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
        var new_tege = new Tege(guid(), Nimetus, Prioriteet, timeAdded);
        //lisan massiivi moosipurgi
        this.teges.push(new_tege);
        //JSON'i stringina salvestan local storagisse
        localStorage.setItem('teges', JSON.stringify(this.teges));
        console.log(this);
        document.querySelector('.list-of-teges').appendChild(new_tege.createHtmlElement());


			}
		},

    routeChange: function(event){
      this.currentRoute = window.location.hash.slice(1);
      //kas leht on olemas
      if(this.routes[this.currentRoute]){
        //jah olemas
        this.updateMenu();

        this.routes[this.currentRoute].render();
      }else{
        //404? ei ole
        //console.log('404');
        window.location.hash = 'home-view';
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
  var Tege = function(new_id, Nimetus, new_Prioriteet, timeAdded){
  this.id = new_id;
    this.Nimetus = Nimetus;
    this.Prioriteet = new_Prioriteet;
    this.timeAdded = timeAdded;
    console.log('created new tege');
  };

   Tege.prototype = {
     createHtmlElement: function(){

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

       li.appendChild(content);

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
