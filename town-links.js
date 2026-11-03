// Link destination mentions, including content replaced by itinerary/filter controls.
(() => {
 const names=['Blowing Rock','Christiansburg','Charleston','Greenville','Brevard','Asheville','Linville','Boone','Floyd','Roanoke'];
 const pattern=new RegExp('\\b('+names.join('|')+')\\b','gi');
 function connect(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
   return node.parentElement && !node.parentElement.closest('a,script,style,textarea,button,select,svg,nav') && names.some(n=>node.textContent.toLowerCase().includes(n.toLowerCase())) ? NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
   const text=node.textContent;let offset=0;const fragment=document.createDocumentFragment();
   for(const match of text.matchAll(pattern)){
    fragment.append(text.slice(offset,match.index));const a=document.createElement('a');a.href='locations/'+match[0].toLowerCase().replaceAll(' ','-')+'.html';a.className='town-link';a.textContent=match[0];a.title='Explore '+match[0];fragment.append(a);offset=match.index+match[0].length;
   }
   if(offset){fragment.append(text.slice(offset));node.replaceWith(fragment)}
  }
 }
 connect(document.body);
 const observer=new MutationObserver(records=>{observer.disconnect();for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)connect(node);else if(node.nodeType===3 && node.parentElement)connect(node.parentElement);observer.observe(document.body,{childList:true,subtree:true});});
 observer.observe(document.body,{childList:true,subtree:true});
})();
