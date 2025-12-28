import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Get product image from product list
  const product = productList?.find((p) => p._id === cartItem?.productId);
  const productImage =
    product?.images && product?.images.length > 0
      ? product?.images[0]
      : cartItem?.image || "/placeholder.png";

  function handleUpdateQuantity(getCartItem, newQuantity) {
    const qty = Number(newQuantity);

    const getCurrentProductIndex = productList.findIndex(
      (product) => product._id === getCartItem?.productId
    );
    const getTotalStock = productList[getCurrentProductIndex]?.totalStock || 0;

    if (qty > getTotalStock) {
      toast({ title: `Only ${getTotalStock} items available`, variant: "destructive" });
      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: qty,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item is updated successfully" });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item is deleted successfully" });
      }
    });
  }

  return (
    <div className="flex items-start gap-4">
      <img src={productImage} alt={cartItem?.title} className="w-28 h-28 rounded object-cover" />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <h3 className="font-extrabold">{cartItem?.title}</h3>
          {cartItem?.size ? (
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">Size: </span>
              <span className="inline-block ml-2 px-2 py-1 border rounded">{cartItem.size}</span>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Qty:</label>
            <select
              value={cartItem?.quantity}
              onChange={(e) => handleUpdateQuantity(cartItem, e.target.value)}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleCartItemDelete(cartItem)}
              className="text-sm text-destructive underline"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            ${((cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price) * cartItem.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
