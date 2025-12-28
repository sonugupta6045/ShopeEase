import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Tax and handling configuration
  const GST_RATE = 0.18;
  const HANDLING_FEE = 40;
  const gstAmount = Number((totalCartAmount * GST_RATE).toFixed(2));
  const handlingAmount = cartItems && cartItems.length > 0 ? HANDLING_FEE : 0;
  const orderTotal = Number((totalCartAmount + gstAmount + handlingAmount).toFixed(2));

  return (
    <SheetContent className="w-full max-w-4xl">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <SheetDescription>Review items and proceed to checkout</SheetDescription>
      </SheetHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, idx) => (
              <div key={item?._id || `${item?.productId}-${item?.size || "nosize"}-${idx}`} className="bg-white p-4 rounded shadow-sm">
                <UserCartItemsContent cartItem={item} />
              </div>
            ))
          ) : (
            <div className="p-6 text-center">Your cart is empty</div>
          )}
        </div>

        <aside className="lg:col-span-1 sticky top-6">
          <div className="bg-white p-4 rounded shadow-sm space-y-4">
            <h3 className="text-lg font-bold">Order Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({Math.round(GST_RATE * 100)}%):</span>
              <span className="font-medium">${gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Handling:</span>
              <span className="font-medium">${handlingAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-bold">Order Total</span>
              <span className="font-bold">${orderTotal.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout</div>
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartSheet(false);
              }}
              className="w-full mt-2"
            >
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </aside>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
