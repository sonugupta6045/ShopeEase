import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  // State handles EDITING only now
  const [openEditProductsDialog, setOpenEditProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    const currentImage = uploadedImageUrls.length > 0 
        ? uploadedImageUrls[0] 
        : (formData.image || formData.images?.[0]);

    const submissionData = {
        ...formData,
        image: currentImage,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : (formData.images || []),
    };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: submissionData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenEditProductsDialog(false);
          setCurrentEditedId(null);
          setImageFiles([]);
          setUploadedImageUrls([]);
          toast({ title: "Product updated successfully" });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "image" && currentKey !== "images")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
         {/* Button now navigates to the new Add Page */}
        <Button onClick={() => navigate("/admin/add-product")}>
          Add New Product
        </Button>
      </div>
      
      {/* Grid Layout */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem?._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenEditProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : <div className="col-span-full flex flex-col items-center justify-center mt-10 text-gray-500">
              <p className="text-lg">No products found.</p>
              <p className="text-sm">Start by adding a new product above.</p>
            </div>}
      </div>

      {/* Sheet used ONLY for Editing now */}
      <Sheet
        open={openEditProductsDialog}
        onOpenChange={() => {
          setOpenEditProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFiles([]);
          setUploadedImageUrls([]);
        }}
      >
        <SheetContent side="right" className="overflow-auto w-[400px] sm:w-[540px] bg-white text-gray-900">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-xl font-bold text-gray-900">
              Edit Product
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-2 space-y-6">
            <ProductImageUpload
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={true}
            />
            
            <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText="Save Changes"
                formControls={addProductFormElements}
                isBtnDisabled={!isFormValid() || imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;