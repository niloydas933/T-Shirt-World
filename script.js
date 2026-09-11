let cart=JSON.parse(localStorage.getItem("tshirt_cart")||"[]");
function save(){localStorage.setItem("tshirt_cart",JSON.stringify(cart));renderCart()}
function addProduct(name,price,id){cart.push({name,price,size:document.getElementById(id).value,qty:1});save();toast("কার্টে যোগ হয়েছে ✓")}
function removeItem(i){cart.splice(i,1);save()}
function renderCart(){let count=0,total=0;const box=document.getElementById("cartItems");count=cart.reduce((a,x)=>a+x.qty,0);cart.forEach(x=>total+=x.price*x.qty);document.getElementById("cartCount").textContent=count;document.getElementById("total").textContent=total;box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><span>${x.name}<small> · ${x.size} × ${x.qty}</small></span><b>৳${x.price*x.qty}</b><button class="remove" onclick="removeItem(${i})">✕</button></div>`).join(""):"<p>কার্ট খালি।</p>"}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function checkout(){if(!cart.length)return toast("আগে একটি পণ্য যোগ করুন");location.hash="custom";closeCart();document.getElementById("name").focus()}
function submitOrder(e){e.preventDefault();toast(`ধন্যবাদ ${document.getElementById("name").value}! অর্ডার রিকোয়েস্ট প্রস্তুত ✓`);console.log({name:name.value,phone:phone.value,size:size.value,quantity:qty.value,notes:notes.value,items:cart})}
document.getElementById("design").addEventListener("change",e=>{const f=e.target.files[0];if(f){const el=document.getElementById("previewShirt");el.style.backgroundImage=`url(${URL.createObjectURL(f)})`;el.innerHTML=""}})
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",2200)}
renderCart();