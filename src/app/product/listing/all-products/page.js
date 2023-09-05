import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";

export default async function AllProducts(params) {
  const getAllProducts = await getAllAdminProducts();

  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}
