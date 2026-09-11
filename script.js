let cart=JSON.parse(localStorage.getItem("tshirt_cart")||"[]");
const DEMO_PRODUCTS=[
 {id:"demo1",name:"Classic Custom",price:399,old_price:null,category:"Custom",sizes:"S, M, L, XL, XXL",description:"নিজের ছবি / নাম / লেখা",image:"",featured:true},
 {id:"demo2",name:"Puja Special",price:449,old_price:499,category:"Puja",sizes:"S, M, L, XL, XXL",description:"দুর্গাপূজা কালেকশন",image:"",featured:true},
 {id:"demo3",name:"Group Custom",price:379,old_price:null,category:"Group",sizes:"S, M, L, XL, XXL",description:"বন্ধু / পরিবার / টিম",image:"",featured:false}
];
let products=[];
const hasConfig=window.TW_CONFIG && TW_CONFIG.SUPABASE_URL && !TW_CONFIG.SUPABASE_URL.includes("YOUR_");
const db=hasConfig && window.supabase ? supabase.createClient(TW_CONFIG.SUPABASE_URL,TW_CONFIG.SUPABASE_ANON_KEY) : null;

function saveCart(){localStorage.setItem("tshirt_cart",JSON.stringify(cart));renderCart()}
function addProduct(name,price,size){cart.push({name,price,size,qty:1});saveCart();toast("কার্টে যোগ হয়েছে ✓")}
function removeItem(i){cart.splice(i,1);saveCart()}
function renderCart(){const box=document.getElementById("cartItems");if(!box)return;let count=cart.reduce((a,x)=>a+x.qty,0),total=cart.reduce((a,x)=>a+x.price*x.qty,0);document.getElementById("cartCount").textContent=count;document.getElementById("total").textContent=total;box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><span>${esc(x.name)}<small> · ${esc(x.size)} × ${x.qty}</small></span><b>৳${x.price*x.qty}</b><button class="remove" onclick="removeItem(${i})">✕</button></div>`).join(""):"<p>কার্ট খালি।</p>"}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function checkout(){if(!cart.length)return toast("আগে একটি পণ্য যোগ করুন");location.hash="custom";closeCart();document.getElementById("name").focus()}
async function submitOrder(e){e.preventDefault();const order={name:document.getElementById("name").value.trim(),phone:document.getElementById("phone").value.trim(),size:document.getElementById("size").value,quantity:Number(document.getElementById("qty").value),notes:document.getElementById("notes").value.trim(),items:cart,total:cart.reduce((a,x)=>a+x.price*x.qty,0)};if(db){const {error}=await db.from("orders").insert(order);if(error){console.error(error);toast("Order save হয়নি—আবার চেষ্টা করুন");return}}toast(`ধন্যবাদ ${esc(order.name)}! অর্ডার রিকোয়েস্ট তৈরি হয়েছে ✓`);cart=[];saveCart()}
async function loadProducts(){let data=null;if(db){const r=await db.from("products").select("*").eq("active",true).order("created_at",{ascending:false});if(!r.error)data=r.data}products=data&&data.length?data:DEMO_PRODUCTS;renderProducts()}
function renderProducts(){const grid=document.getElementById("productsGrid");if(!grid)return;grid.innerHTML=products.map(p=>{const sizes=String(p.sizes||"S, M, L, XL, XXL").split(",").map(s=>s.trim()).filter(Boolean);return `<article class="product"><div class="art ${p.category==="Puja"?"puja":p.category==="Group"?"group":"dark"}" style="${p.image?`background-image:url('${escAttr(p.image)}');background-size:cover;background-position:center`:''}">${p.image?"":esc(p.name)}</div><div class="info">${p.featured?'<i>FEATURED</i>':''}<h3>${esc(p.name)}</h3><p>${esc(p.description||"")}</p><b>৳${Number(p.price).toLocaleString("en-BD")}${p.old_price?` <del style="font-size:13px;color:#888">৳${p.old_price}</del>`:""}</b></div><div class="controls"><select id="size-${escAttr(p.id)}">${sizes.map(s=>`<option>${esc(s)}</option>`).join("")}</select><button onclick="addProduct('${jsq(p.name)}',${Number(p.price)},document.getElementById('size-${jsq(p.id)}').value)">কার্টে যোগ করুন</button></div></article>`}).join("")}
document.getElementById("design")?.addEventListener("change",e=>{const f=e.target.files[0];if(f){const el=document.getElementById("previewShirt");el.style.backgroundImage=`url(${URL.createObjectURL(f)})`;el.innerHTML=""}})
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",2200)}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escAttr(s=""){return esc(s).replace(/`/g,"&#096;")}
function jsq(s=""){return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g," ")}
renderCart();loadProducts();
