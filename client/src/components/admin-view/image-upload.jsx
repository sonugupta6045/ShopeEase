import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";

function ProductImageUpload({
  imageFiles,
  setImageFiles,
  imageLoadingState,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode = false,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const { toast } = useToast();

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFiles = event.target.files;
    
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      const validFiles = [];

      for (let file of filesArray) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `File ${file.name} exceeds 5MB`,
            variant: "destructive",
          });
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setImageFiles((prevFiles) => [...(prevFiles || []), ...validFiles]);
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    
    if (droppedFiles) {
      const filesArray = Array.from(droppedFiles);
      const validFiles = [];

      for (let file of filesArray) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `File ${file.name} exceeds 5MB`,
            variant: "destructive",
          });
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setImageFiles((prevFiles) => [...(prevFiles || []), ...validFiles]);
      }
    }
  }

  function handleRemoveImage(index) {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary(file) {
    const data = new FormData();
    data.append("my_file", file);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "response");

      if (response?.data?.success) {
        return response.data.result.url;
      } else {
        toast({
          title: "Error",
          description: response?.data?.message || "Failed to upload image",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error uploading image",
        variant: "destructive",
      });
      return null;
    }
  }

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      setImageLoadingState(true);
      const uploadPromises = imageFiles.map((file) =>
        uploadImageToCloudinary(file)
      );

      Promise.all(uploadPromises).then((urls) => {
        const validUrls = urls.filter((url) => url !== null);
        setUploadedImageUrls(validUrls);
        setImageLoadingState(false);

        if (validUrls.length > 0) {
          toast({
            title: "Success",
            description: `${validUrls.length} image(s) uploaded successfully`,
          });
        }
      });
    }
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple
          accept="image/*"
        />
        {!imageFiles || imageFiles.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload images</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="space-y-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-2 flex-1">
                  <FileIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {uploadedImageUrls[index] && (
                      <p className="text-xs text-green-600">Uploaded ✓</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove File</span>
                </Button>
              </div>
            ))}
            <Label
              htmlFor="image-upload"
              className="flex items-center justify-center h-12 cursor-pointer border border-dashed rounded bg-gray-50 hover:bg-gray-100 transition-colors mt-2"
            >
              <span className="text-sm text-muted-foreground">
                + Add more images
              </span>
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
