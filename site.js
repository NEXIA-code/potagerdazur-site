(function(){
"use strict";
/* menu mobile */
var t=document.getElementById('nav-toggle'),nav=document.getElementById('nav-principal');
if(t&&nav){
  t.addEventListener('click',function(){
    var o=nav.classList.toggle('ouvert');
    t.setAttribute('aria-expanded',o?'true':'false');
  });
  nav.addEventListener('click',function(e){
    if(e.target.closest('a')){nav.classList.remove('ouvert');t.setAttribute('aria-expanded','false');}
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('ouvert')){
      nav.classList.remove('ouvert');t.setAttribute('aria-expanded','false');t.focus();
    }
  });
}
/* fiche produit en surimpression */
var ov=document.getElementById('fiche-overlay');
if(ov){
  var contenu=document.getElementById('fiche-contenu');
  var btnFermer=document.getElementById('fiche-fermer');
  var retourFocus=null;
  var ouvrir=function(carte){
    contenu.innerHTML=carte.innerHTML;
    var d=contenu.querySelector('details');if(d)d.open=true;
    ov.classList.add('ouvert');
    document.body.style.overflow='hidden';
    retourFocus=carte;
    btnFermer.focus();
  };
  var fermer=function(){
    ov.classList.remove('ouvert');
    document.body.style.overflow='';
    contenu.innerHTML='';
    if(retourFocus){retourFocus.focus();retourFocus=null;}
  };
  document.querySelectorAll('.carte').forEach(function(c){
    c.addEventListener('click',function(e){
      if(e.target.closest('summary'))return;
      ouvrir(c);
    });
    c.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();ouvrir(c);}
    });
  });
  btnFermer.addEventListener('click',fermer);
  ov.addEventListener('click',function(e){if(e.target===ov)fermer();});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&ov.classList.contains('ouvert'))fermer();
  });
}
/* catalogue : filtre par catégorie + tri par prix */
var barre=document.getElementById('filtres-cats');
if(barre){
  var boutons=barre.querySelectorAll('button[data-cat]');
  var sections=document.querySelectorAll('section.cat[data-cat]');
  boutons.forEach(function(b){
    b.addEventListener('click',function(){
      boutons.forEach(function(x){
        var actif=(x===b);
        x.classList.toggle('actif',actif);
        x.setAttribute('aria-pressed',actif?'true':'false');
      });
      var cat=b.dataset.cat;
      sections.forEach(function(s){s.hidden=(cat!=='tous'&&s.dataset.cat!==cat);});
    });
  });
  var tri=document.getElementById('tri');
  if(tri){
    tri.addEventListener('change',function(){
      var desc=(tri.value==='desc');
      document.querySelectorAll('.grille').forEach(function(g){
        var cartes=Array.prototype.slice.call(g.querySelectorAll('.carte'));
        cartes.sort(function(a,b){
          var pa=parseFloat(a.dataset.prix||'0'),pb=parseFloat(b.dataset.prix||'0');
          return desc?pb-pa:pa-pb;
        });
        cartes.forEach(function(c){g.appendChild(c);});
      });
    });
  }
}
})();
