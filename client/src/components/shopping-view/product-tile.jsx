import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// reviews removed from product tile
import { Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // reviews removed from product tile
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);
  const { toast } = useToast();
  
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // initialize wishlist state from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
      const exists = stored.find((item) => item.productId === product?._id);
      setIsWishlisted(Boolean(exists));
    } catch (err) {
      setIsWishlisted(false);
    }
  }, [product?._id]);

  // keep wishlisted state in sync when wishlist is changed elsewhere (header or other tabs)
  useEffect(() => {
    const handler = (e) => {
      try {
        const stored = e?.detail?.items ?? JSON.parse(localStorage.getItem("wishlistItems") || "[]");
        const exists = stored.find((item) => item.productId === product?._id);
        setIsWishlisted(Boolean(exists));
      } catch (err) {
        // ignore
      }
    };

    const storageHandler = (e) => {
      if (e.key !== "wishlistItems") return;
      try {
        const stored = JSON.parse(e.newValue || "[]");
        const exists = stored.find((item) => item.productId === product?._id);
        setIsWishlisted(Boolean(exists));
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener("wishlistUpdated", handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("wishlistUpdated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [product?._id]);
  // Check if product is in cart
  const cartItem = cartItems?.items?.find(
    (item) => item.productId === product?._id
  );

  // review fetching removed

  useEffect(() => {
    if (cartItem) {
      setCartQuantity(cartItem.quantity);
    } else {
      setCartQuantity(0);
    }
  }, [cartItem]);

  

  const handleQuantityChange = (action) => {
    const getCurrentProductIndex = productList?.findIndex(
      (p) => p._id === product?._id
    );
    const getTotalStock = productList?.[getCurrentProductIndex]?.totalStock;

    if (action === "plus") {
      if (cartQuantity + 1 > getTotalStock) {
        toast({
          title: `Only ${getTotalStock} items available`,
          variant: "destructive",
        });
        return;
      }
      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: product?._id,
          quantity: cartQuantity + 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          setCartQuantity(cartQuantity + 1);
        }
      });
    } else if (action === "minus") {
      if (cartQuantity === 1) {
        dispatch(
          deleteCartItem({
            userId: user?.id,
            productId: product?._id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            setCartQuantity(0);
            toast({ title: "Item removed from cart" });
          }
        });
      } else {
        dispatch(
          updateCartQuantity({
            userId: user?.id,
            productId: product?._id,
            quantity: cartQuantity - 1,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            setCartQuantity(cartQuantity - 1);
          }
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.images && product?.images.length > 0 ? product?.images[0] : "/placeholder.png"}
            alt={product?.title}
            className="w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product?.totalStock === 0 ? (
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
                Only {product?.totalStock} left
              </Badge>
            ) : product?.salePrice > 0 ? (
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium">
                Sale
              </Badge>
            ) : null}
          </div>
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              // toggle wishlist in localStorage and notify header
              try {
                const stored = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
                let updated = [];
                if (isWishlisted) {
                  updated = stored.filter((item) => item.productId !== product?._id);
                  setIsWishlisted(false);
                } else {
                  const item = {
                    productId: product?._id,
                    title: product?.title,
                    price: product?.price,
                    salePrice: product?.salePrice,
                    image: product?.images && product?.images.length > 0 ? product.images[0] : "/placeholder.png",
                  };
                  updated = [...stored, item];
                  setIsWishlisted(true);
                }
                localStorage.setItem("wishlistItems", JSON.stringify(updated));
                window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { items: updated } }));
              } catch (err) {
                console.error("Wishlist update failed", err);
              }
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
        </div>
        
        <CardContent className="p-5">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                {product?.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium">{categoryOptionsMap[product?.category]}</span>
                <span className="font-medium">{brandOptionsMap[product?.brand]}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {product?.salePrice > 0 ? (
                  <>
                    <span className="text-xl font-bold text-green-600">
                      ${product?.salePrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product?.price}
                    </span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">
                    ${product?.price}
                  </span>
                )}
              </div>
            </div>
            
            {/* Reviews removed from product card */}
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="p-5 pt-0" onClick={(e) => e.stopPropagation()}>
        {product?.totalStock === 0 ? (
          <Button className="w-full h-11 opacity-60 cursor-not-allowed bg-gray-400" disabled>
            Out Of Stock
          </Button>
        ) : cartQuantity === 0 ? (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full h-11 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        ) : (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-lg p-2">
              <Button
                variant="outline"
                className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-gray-400"
                size="icon"
                onClick={() => handleQuantityChange("minus")}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-lg min-w-[2rem] text-center">{cartQuantity}</span>
              <Button
                variant="outline"
                className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-gray-400"
                size="icon"
                onClick={() => handleQuantityChange("plus")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200" 
              onClick={() => navigate("/shop/checkout")}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;