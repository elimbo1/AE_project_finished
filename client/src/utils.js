export const getProducts = async (filters) => {
    let url = `${import.meta.env.VITE_DUMMY_URL}/products`

    console.log(url);

    if (filters.category) {
        url += `/category/${filters.category}`
    }

    const response = await fetch(url);
    const json = await response.json();

    console.log(json);

    return json;
}

export const getProductCategories = async () => {
    const result = await fetch(`${import.meta.env.VITE_DUMMY_URL}/products/categories`);
    const response = await result.json();
    return response;
};