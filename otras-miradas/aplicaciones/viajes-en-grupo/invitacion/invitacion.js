/* Página estática: sin lecturas del backend, analítica, almacenamiento ni tokens en consultas HTTP. */
(function(root){'use strict';
 function parse(fragment){
  if(typeof fragment!=='string'||fragment.length>1800||!fragment.startsWith('#'))throw Error('Invitación incompleta. Abre el enlace completo que te ha enviado el organizador.');
  const values=new Map();
  for(const pair of fragment.slice(1).split('&')){const at=pair.indexOf('=');if(at<1)throw Error('Formato de invitación no válido.');const key=decodeURIComponent(pair.slice(0,at).replace(/\+/g,' ')),value=decodeURIComponent(pair.slice(at+1).replace(/\+/g,' '));if(!['token','trip','name'].includes(key)||values.has(key))throw Error('Invitación no válida.');values.set(key,value);}
  const token=values.get('token')||'',trip=values.get('trip')||'',name=values.has('name')?values.get('name'):'Viaje privado';
  if(!/^[0-9a-f]{32}$/.test(token)||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trip)||!name.trim()||name.length>80||/[\u0000-\u001f\u007f-\u009f]/.test(name))throw Error('La invitación no tiene un formato admitido. Pide una nueva al organizador.');
  return {token,trip,name};
 }
 function appLink(p){const q=new URLSearchParams({token:p.token,trip:p.trip,name:p.name});return 'dljviajes://join?'+q.toString();}
 if(typeof module!=='undefined')module.exports={parse,appLink};
 if(!root.document)return;
 const message=document.getElementById('invite-message'),valid=document.getElementById('invite-valid'),open=document.getElementById('open-app');
 try{if(location.search)throw Error('Usa la invitación original, sin añadir parámetros a la dirección.');const invitation=parse(location.hash);document.getElementById('invite-name').textContent=invitation.name;open.href=appLink(invitation);open.removeAttribute('aria-disabled');valid.hidden=false;message.textContent='Invitación preparada para abrir en la app.';}
 catch(error){valid.hidden=true;message.textContent=error instanceof URIError?'La invitación contiene texto mal codificado. Pide un enlace nuevo.':error.message;}
 finally{try{history.replaceState(null,'',location.pathname);}catch(ignore){}}
})(typeof window==='undefined'?globalThis:window);
