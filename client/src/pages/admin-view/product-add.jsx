import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import { addNewProduct } from "@/store/admin/products-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
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

function AdminProductAdd() {
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  
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

    dispatch(addNewProduct(submissionData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Product added successfully" });
        // Reset form and navigate back to products list
        setFormData(initialFormData);
        setImageFiles([]);
        setUploadedImageUrls([]);
        navigate("/admin/products");
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "image" && currentKey !== "images")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  return (
    <div className="w-full bg-white">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
         <p className="text-gray-500">Fill in the details below to add a new product to the inventory.</p>
      </div>
      
      <div className="border p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
            <ProductImageUpload
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={false}
            />
            
            <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText="Add Product"
                formControls={addProductFormElements}
                isBtnDisabled={!isFormValid() || imageLoadingState}
            />
        </div>
      </div>
    </div>
  );
}

export default AdminProductAdd;