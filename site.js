(function(){
"use strict";
/* apparition douce au défilement (sans JS : tout reste visible) */
document.documentElement.classList.add('js');
var rvs=document.querySelectorAll('.rv');
if(rvs.length){
  var reduit=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduit&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entrees){
      entrees.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('vu');io.unobserve(en.target);}
      });
    },{rootMargin:'0px 0px -8% 0px'});
    rvs.forEach(function(el){io.observe(el);});
  }else{
    rvs.forEach(function(el){el.classList.add('vu');});
  }
}
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
      if(e.target.closest('summary'))return;
      if(e.key==='Enter'||e.key===' '){e.preventDefault();ouvrir(c);}
    });
  });
  btnFermer.addEventListener('click',fermer);
  ov.addEventListener('click',function(e){if(e.target===ov)fermer();});
  document.addEventListener('keydown',function(e){
    if(!ov.classList.contains('ouvert'))return;
    if(e.key==='Escape'){fermer();return;}
    if(e.key!=='Tab')return;
    var f=ov.querySelectorAll('button,[href],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])');
    var liste=Array.prototype.filter.call(f,function(el){return el.offsetParent!==null;});
    if(!liste.length)return;
    var premier=liste[0],dernier=liste[liste.length-1];
    if(e.shiftKey&&document.activeElement===premier){e.preventDefault();dernier.focus();}
    else if(!e.shiftKey&&document.activeElement===dernier){e.preventDefault();premier.focus();}
  },true);
}
/* catalogue : filtre par catégorie + recherche + tri par prix */
var barre=document.getElementById('filtres-cats');
if(barre){
  var boutons=barre.querySelectorAll('button[data-cat]');
  var sections=document.querySelectorAll('section.cat[data-cat]');
  var recherche=document.getElementById('recherche-catalogue');
  function appliquerFiltres(){
    var actif=barre.querySelector('button.actif');
    var cat=actif?actif.dataset.cat:'tous';
    var q=(recherche?recherche.value:'').trim().toLowerCase();
    sections.forEach(function(s){
      var catOk=(cat==='tous'||s.dataset.cat===cat);
      var visibles=0;
      s.querySelectorAll('.carte').forEach(function(c){
        var ok=catOk&&(!q||c.textContent.toLowerCase().indexOf(q)!==-1);
        c.style.display=ok?'':'none';
        if(ok)visibles++;
      });
      s.hidden=!catOk||visibles===0;
    });
  }
  boutons.forEach(function(b){
    b.addEventListener('click',function(){
      boutons.forEach(function(x){
        var a=(x===b);
        x.classList.toggle('actif',a);
        x.setAttribute('aria-pressed',a?'true':'false');
      });
      appliquerFiltres();
    });
  });
  if(recherche){recherche.addEventListener('input',appliquerFiltres);}
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
