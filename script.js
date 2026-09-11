let cart=JSON.parse(localStorage.getItem("tshirt_cart")||"[]");
function save(){localStorage.setItem("tshirt_cart",JSON.stringify(cart));renderCart()}
function addToCart(name,price){cart.push({name,price});save();toast("কার্টে যোগ হয়েছে ✓")}
function renderCart(){document.getElementById("cartCount").textContent=cart.length;let box=document.getElementById("cartItems");let total=0;box.innerHTML=cart.length?cart.map((x,i)=>{total+=x.price;return `<div class="cart-row"><span>${x.name}</span><b>৳${x.price}</b></div>`}).join(""):"<p>কার্ট খালি।</p>";document.getElementById("total").textContent=total}
function openCart(){document.getElementById("cart").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open")}
function checkout(){if(!cart.length)return toast("আগে একটি পণ্য যোগ করুন");location.hash="custom";closeCart();document.getElementById("name").focus()}
function submitOrder(e){e.preventDefault();let n=document.getElementById("name").value,p=document.getElementById("phone").value,s=document.getElementById("size").value;toast(`ধন্যবাদ ${n}! অর্ডার রিকোয়েস্ট প্রস্তুত।`);console.log({name:n,phone:p,size:s,items:cart});}
document.getElementById("design").addEventListener("change",e=>{let f=e.target.files[0];if(f){let u=URL.createObjectURL(f);document.getElementById("previewShirt").style.backgroundImage=`url(${u})`;document.getElementById("previewShirt").style.backgroundSize="contain";document.getElementById("previewShirt").style.backgroundRepeat="no-repeat";document.getElementById("previewShirt").textContent=""}})
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",2200)}
renderCart();