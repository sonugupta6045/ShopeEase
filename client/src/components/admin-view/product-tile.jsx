import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  // Define low stock threshold (e.g., 5 items or less)
  const isLowStock = product?.totalStock <= 5;

  return (
    <Card 
      className={`w-full max-w-sm mx-auto overflow-hidden transition-shadow hover:shadow-lg ${
        isLowStock ? "border-red-500 border-2" : ""
      }`}
    >
      <div className="relative">
        {/* Image Section */}
        <div className="relative w-full h-[300px]">
          <img
            src={
              product?.image || 
              (product?.images && product?.images.length > 0 ? product.images[0] : "/placeholder.png")
            }
            alt={product?.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isLowStock && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                Low Stock: {product?.totalStock} left
              </span>
            )}
          </div>
          
          {product?.salePrice > 0 && (
             <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                Sale
             </div>
          )}
        </div>

        <CardContent className="pt-4">
          <h2 className="text-xl font-bold mb-2 truncate" title={product?.title}>
            {product?.title}
          </h2>
          
          {/* Brand & Category Info */}
          <div className="flex justify-between items-center mb-3 text-sm text-muted-foreground">
             <span className="capitalize">{product?.brand || "No Brand"}</span>
             <span className="capitalize">{product?.category || "No Category"}</span>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-baseline gap-2">
                <span
                className={`${
                    product?.salePrice > 0 ? "line-through text-gray-500 text-sm" : "text-lg font-bold text-primary"
                }`}
                >
                ${product?.price}
                </span>
                {product?.salePrice > 0 && (
                <span className="text-lg font-bold text-primary">
                    ${product?.salePrice}
                </span>
                )}
            </div>
            
            {/* Explicit Stock Display */}
            <div className={`text-sm font-medium ${isLowStock ? "text-red-600" : "text-black"}`}>
                Stock: {product?.totalStock}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center gap-3 bg-gray-50 p-4">
          <Button
            className="flex-1"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData({
                ...product,
                // Preserving your specific sizes logic
                sizes: product?.sizes && product.sizes.length > 0 ? product.sizes[0] : "",
              });
            }}
          >
            Edit
          </Button>
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
            onClick={() => handleDelete(product?._id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;