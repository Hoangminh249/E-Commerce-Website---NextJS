"use client";

import InputComponent from "@/components/FormElements/InputComponent/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import { GlobalContext } from "@/Context";
import { addNewProduct, updateAProduct } from "@/services/product";
import {
  adminAddProductformControls,
  AvailableSizes,
  firebaseConfig,
  firebaseStorageURL,
} from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { resolve } from "styled-jsx/css";
import { toast } from "react-toastify";
import Notification from "@/components/Nofitication";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoder";
import { useRouter } from "next/navigation";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

const helperForUPloadingImageToFirebase = async (file) => {
  const getFileName = createUniqueFileName(file);

  const storageReference = ref(storage, `ecommerce/${getFileName}`);

  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error), reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
};

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};

export default function AdminAddNewProduct(params) {
  const [formData, setFormData] = useState(initialFormData);

  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  console.log(currentUpdatedProduct, "currentUpdatedProduct");

  const router = useRouter();

  useEffect(() => {
    if (currentUpdatedProduct !== null) {
      setFormData(currentUpdatedProduct);
    }
  }, [currentUpdatedProduct]);

  const handleImage = async (e) => {
    console.log(e.target.value);

    const extractImageUrl = await helperForUPloadingImageToFirebase(
      e.target.files[0]
    );

    console.log(extractImageUrl);

    if (extractImageUrl) {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  };

  const handleTileClick = (item) => {
    let cpySizes = [...formData.sizes];

    const index = cpySizes.findIndex((i) => i.id === item.id);

    if (index === -1) {
      cpySizes.push(item);
    } else {
      cpySizes = cpySizes.filter((i) => item.id !== item.id);
    }
    setFormData({
      ...formData,
      sizes: cpySizes,
    });
  };

  const handleAddProduct = async () => {
    setComponentLevelLoader({ loading: true, id: "" });
    const res =
      currentUpdatedProduct !== null
        ? await updateAProduct(formData)
        : await addNewProduct(formData);

    console.log(res);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: " " });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFormData(initialFormData);
      setTimeout(() => {
        router.push("/admin-view/all-products");
      }, 1000);
      setCurrentUpdatedProduct(null)
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFormData(initialFormData);
    }
  };

  console.log(formData);

  return (
    <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <input
            accept="/image"
            max="100000"
            type="file"
            onChange={handleImage}
          />
          <div className="flex gap-2 flex-col">
            <label>Available sizes</label>
            <TileComponent
              selected={formData.sizes}
              onClick={handleTileClick}
              data={AvailableSizes}
            />
          </div>

          {adminAddProductformControls.map((controlItem) => {
            return controlItem.componentType === "input" ? (
              <InputComponent
                type={controlItem.type}
                placeholder={controlItem.placeholder}
                label={controlItem.label}
                value={formData[controlItem.id]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: e.target.value,
                  });
                }}
              />
            ) : controlItem.componentType === "select" ? (
              <SelectComponent
                label={controlItem.label}
                options={controlItem.options}
                value={formData[controlItem.id]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: e.target.value,
                  });
                }}
              />
            ) : null;
          })}
          <button
            onClick={handleAddProduct}
            className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide"
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={currentUpdatedProduct !== null ? "Updating Product" : "Adding Product" }
                color={"#ffffff"}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : currentUpdatedProduct !== null ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}
