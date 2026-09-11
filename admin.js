const KEY="tshirt_world_products_v1";
const demo=[
 {id:"p1",name:"Classic Custom",price:399,oldPrice:0,category:"Custom",sizes:"S, M, L, XL",description:"নিজের পছন্দের ডিজাইনে custom T-shirt.",image:"",featured:true},
 {id:"p2",name:"Puja Special 2026",price:449,oldPrice:499,category:"Puja",sizes:"S, M, L, XL, XXL",description:"Durga Puja special collection.",image:"",featured:true},
 {id:"p3",name:"Group Custom",price:379,oldPrice:0,category:"Group",sizes:"M, L, XL",description:"বন্ধু বা group order-এর জন্য.",image:"",featured:false}
];
let products=load(), editingId=null, imageData="";
const $=id=>document.getElementById(id);
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));return Array.isArray(x)?x:demo}catch{return demo}}
function save(){localStorage.setItem(KEY,JSON.stringify(products));render();show("Saved successfully");}
function show(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function render(){
 const q=$("search").value.trim().toLowerCase();
 const list=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q));
 $("productCount").textContent=products.length;
 $("featuredCount").textContent=products.filter(p=>p.featured).length;
 $("empty").classList.toggle("hidden",list.length!==0);
 $("productList").innerHTML=list.map(p=>`<div class="product">
  <img class="thumb" src="${p.image||placeholder()}" alt="">
  <div><div class="prod-name">${esc(p.name)} ${p.featured?'<span class="badge">Featured</span>':''}</div>
  <div class="meta">${esc(p.category||"")} · ${esc(p.sizes||"")}</div><div class="price">৳${Number(p.price).toLocaleString("en-BD")}${p.oldPrice?` <del class="meta">৳${p.oldPrice}</del>`:""}</div></div>
  <div class="actions"><button onclick="editProduct('${p.id}')">Edit</button><button onclick="deleteProduct('${p.id}')">Delete</button></div>
 </div>`).join("");
}
function placeholder(){return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="#eef1f5"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#8a94a3" font-size="14">T-Shirt</text></svg>')}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function resetForm(){editingId=null;imageData="";$("productForm").reset();$("productId").value="";$("formTitle").textContent="নতুন Product";$("saveBtn").textContent="+ Add Product";$("cancelEdit").classList.add("hidden");$("preview").classList.remove("has-image");$("preview").src=""}
function editProduct(id){const p=products.find(x=>x.id===id);if(!p)return;editingId=id;imageData=p.image||"";$("productId").value=id;$("name").value=p.name;$("price").value=p.price;$("oldPrice").value=p.oldPrice||"";$("category").value=p.category||"";$("sizes").value=p.sizes||"";$("description").value=p.description||"";$("imageUrl").value=p.image&&p.image.startsWith("http")?p.image:"";$("featured").checked=!!p.featured;$("formTitle").textContent="Product Edit";$("saveBtn").textContent="Save Changes";$("cancelEdit").classList.remove("hidden");setPreview(imageData)}
window.editProduct=editProduct;
function deleteProduct(id){const p=products.find(x=>x.id===id);if(!p)return;if(!confirm(`"${p.name}" delete করবেন?`))return;products=products.filter(x=>x.id!==id);save()}
window.deleteProduct=deleteProduct;
function setPreview(src){if(src){$("preview").src=src;$("preview").classList.add("has-image")}else{$("preview").classList.remove("has-image");$("preview").src=""}}
$("imageFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{imageData=r.result;setPreview(imageData);$("imageUrl").value=""};r.readAsDataURL(f)});
$("imageUrl").addEventListener("input",e=>{if(e.target.value){imageData=e.target.value;setPreview(imageData)}});
$("productForm").addEventListener("submit",e=>{e.preventDefault();const data={id:editingId||"p"+Date.now(),name:$("name").value.trim(),price:Number($("price").value),oldPrice:Number($("oldPrice").value)||0,category:$("category").value.trim(),sizes:$("sizes").value.trim(),description:$("description").value.trim(),image:imageData||$("imageUrl").value.trim(),featured:$("featured").checked};if(!data.name||!data.price)return;if(editingId){products=products.map(p=>p.id===editingId?data:p)}else products.unshift(data);save();resetForm()});
$("cancelEdit").onclick=resetForm;$("search").oninput=render;
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="t-shirt-world-products.json";a.click();URL.revokeObjectURL(a.href)};
$("importFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x))throw Error();products=x;save();show("Imported successfully")}catch{alert("Invalid JSON file")}};r.readAsText(f)};
$("resetBtn").onclick=()=>{if(confirm("Demo products দিয়ে reset করবেন?")){products=demo;save();resetForm()}};
render();
