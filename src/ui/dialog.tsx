
/*
const dialog = {
  container : HTMLElement
  width : "",
  title : "",
  content : jsx,
  primaryTitle : "",
  closeTitle : "CLOSE",
  closeClick : () => {},
  primaryTitle : "SET",
  primaryClick : () => {},
  closeHandler : () => {},
  onMount : (dialog) => {}
  container : node,
}

*/
let dialogContainer : HTMLElement | null = null;
let dialogInstance : HTMLDivElement | null = null;

export function hideDialog() {
  if(dialogInstance === null || dialogContainer === null) return;
  document.body.removeChild(dialogContainer);
  dialogContainer = null;
  dialogInstance = null;
}
export function showDialog(cfg : any) {
  hideDialog();

  dialogContainer = document.createElement("div");
  document.body.appendChild(dialogContainer);
  dialogContainer.innerHTML = `<div className="SubEditorDialog is-active">
  <div className="background"></div>
    <div className="card" style={style}>      
      <header className="card-head">        
        <p className="card-title">{this.props.Dialog.title}</p>        
        <button className="delete" onClick={(e) => this.props.Dialog.closeHandler(e)}></button>      
      </header>      
    <section className="card-body dialog-body" style={style}>{this.props.Dialog.content}</section>      
    <footer className="card-foot">
      {this.btnClose()}        
      {this.btnPrimary()}  
    </footer>    
  </div>  
</div>`;

}
