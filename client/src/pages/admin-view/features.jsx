import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminFeatures() {
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    const currentUrl = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : "";

    if (currentUrl) {
      dispatch(addFeatureImage(currentUrl)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFiles([]);
          setUploadedImageUrls([]);
        }
      });
    }
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Feature Images & Banners</h1>
        <p className="text-muted-foreground">
          Manage the banner images displayed on the home page carousel.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload New Feature Image</h2>
        <div className="flex flex-col gap-4">
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="w-full sm:w-auto self-end"
            disabled={uploadedImageUrls.length === 0 || imageLoadingState}
          >
            {imageLoadingState ? "Uploading..." : "Save Feature Image"}
          </Button>
        </div>
      </div>

      {/* Display Gallery */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Existing Feature Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((featureImgItem) => (
              <div key={featureImgItem._id} className="relative group rounded-lg overflow-hidden border shadow-sm">
                <div className="w-full h-48 relative">
                  <img
                    src={featureImgItem.image}
                    alt="Feature Banner"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2 bg-gray-50">
                   <Button
                    onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    Delete Banner
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
               <p>No feature images found.</p>
               <p className="text-sm">Upload an image above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;