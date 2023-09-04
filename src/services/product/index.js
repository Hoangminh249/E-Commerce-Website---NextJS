



// add new product service

import Cookies from "js-cookie";


export const addNewProduct = async (formData) => {
    try {
        const response = await fetch("/api/admin/add-product", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${Cookies.get("token")}`
            },
            body: JSON.stringify(FormData)
        })

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}