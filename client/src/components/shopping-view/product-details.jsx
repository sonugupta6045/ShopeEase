import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems, updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { orderList } = useSelector((state) => state.shopOrder) || {};
  const { toast } = useToast();
  const [cartQuantity, setCartQuantity] = useState(0);

  // Check if user has purchased this product
  const hasUserPurchasedProduct = () => {
    if (!user || !orderList || orderList.length === 0) return false;
    
    return orderList.some((order) =>
      order.cartItems.some(
        (item) => item.productId === productDetails?._id && order.orderStatus === "confirmed"
      )
    );
  };

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");
    setRating(getRating);
  }

  function handlePrevImage() {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (productDetails?.images?.length || 1) - 1 : prevIndex - 1
    );
  }

  function handleNextImage() {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (productDetails?.images?.length || 1) - 1 ? 0 : prevIndex + 1
    );
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    return dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }

      return data;
    });
  }

  function handleQuantityChange(action) {
    const totalStock = productDetails?.totalStock || 0;

    if (action === "plus") {
      if (cartQuantity + 1 > totalStock) {
        toast({ title: `Only ${totalStock} items available`, variant: "destructive" });
        return;
      }
      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: productDetails?._id,
          quantity: cartQuantity + 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          setCartQuantity((q) => q + 1);
          dispatch(fetchCartItems(user?.id));
        }
      });
    } else if (action === "minus") {
      if (cartQuantity === 1) {
        dispatch(
          deleteCartItem({ userId: user?.id, productId: productDetails?._id })
        ).then((data) => {
          if (data?.payload?.success) {
            setCartQuantity(0);
            dispatch(fetchCartItems(user?.id));
            toast({ title: "Item removed from cart" });
          }
        });
      } else {
        dispatch(
          updateCartQuantity({
            userId: user?.id,
            productId: productDetails?._id,
            quantity: cartQuantity - 1,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            setCartQuantity((q) => q - 1);
            dispatch(fetchCartItems(user?.id));
          }
        });
      }
    }
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setCurrentImageIndex(0);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
      setCurrentImageIndex(0);
    }
  }, [productDetails, dispatch]);

  useEffect(() => {
    const item = cartItems?.items?.find((i) => i.productId === productDetails?._id);
    if (item) setCartQuantity(item.quantity);
    else setCartQuantity(0);
  }, [cartItems, productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const images = productDetails?.images || [];
  const currentImage = images.length > 0 ? images[currentImageIndex] : "/placeholder.png";

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={currentImage}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : cartQuantity === 0 ? (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(productDetails?._id, productDetails?.totalStock).then((data) => {
                    if (data?.payload?.success) setCartQuantity(1);
                  })
                }
              >
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
                    -
                  </Button>
                  <span className="font-bold text-lg min-w-[2rem] text-center">{cartQuantity}</span>
                  <Button
                    variant="outline"
                    className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-gray-400"
                    size="icon"
                    onClick={() => handleQuantityChange("plus")}
                  >
                    +
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
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              {!hasUserPurchasedProduct() ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    You can only write a review if you have purchased this product.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-1">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Write a review..."
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                  >
                    Submit
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
