import { useEffect, useState } from "react";
import { getProductCategories } from "./utils";

const Filters = (props) => {
  const { setFilters } = props;
  const [categories, setCategories] = useState([]);

  const handleGetProductCategories = async () => {
    const response = await getProductCategories();
    setCategories(response);
  };

  const handleCategoryChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: event.target.value,
    }));
  };

  useEffect(() => {
    if (!categories.length) {
      handleGetProductCategories();
    }
  }, []);

  return (
    <div className="filtersWrapper">
      <div>
        <label htmlFor="categorySelect">Category</label>
      </div>
      <div>
        <select id="categorySelect" onChange={handleCategoryChange}>
          {categories?.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;