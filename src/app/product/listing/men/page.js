import CommonListing from "@/components/CommonListing";
import { productByCategory } from "@/services/product";



export default async function MenAllProducts(params) {

    const getAllProducts = await productByCategory("men")

    return <CommonListing data={getAllProducts && getAllProducts.data }/>
}