// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const P=node?require('./library-presentation.js'):root.MusicLibraryPresentation;
  function createPresenter(document,{capture,onError=()=>{}}){
    const get=id=>document.getElementById(id);
    return {update(){
      try{
        const view=P.present(capture()),list=document.createDocumentFragment();
        // Build the bounded detached literal view before changing current DOM.
        for(const match of view.matches){
          const item=document.createElement('li'),name=document.createElement('strong'),text=document.createElement('span');
          name.textContent=match.name;const points=[...match.text];let start=0;
          for(const [from,to] of match.spans){
            if(from>start)text.append(document.createTextNode(points.slice(start,from).join('')));
            const mark=document.createElement('mark');mark.textContent=points.slice(from,to).join('');text.append(mark);start=to;
          }
          if(start<points.length)text.append(document.createTextNode(points.slice(start).join('')));
          item.append(name,text);list.append(item);
        }
        get('library-selection-note').textContent=view.selection_note;get('library-note').textContent=view.library_note;
        get('library-search-status').textContent=view.search_note;get('library-more').textContent=view.more_label;
        get('library-match-heading').textContent=view.match_heading;get('library-match-list').replaceChildren(list);
        get('library-match-details').hidden=!view.show_matches;
        return true;
      }catch(error){onError(error);return false;}
    }};
  }
  const api=Object.freeze({createPresenter});if(node)module.exports=api;else root.MusicLibraryPresentationDom=api;
})(typeof globalThis==='object'?globalThis:this);
