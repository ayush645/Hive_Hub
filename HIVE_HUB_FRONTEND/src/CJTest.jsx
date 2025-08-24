import React, { useEffect, useState } from "react";
import { getAllCategories, getProductsByCategory } from "./services/cjServices";
import Swal from "sweetalert2";
import storeService from "./services/storeService";

export default function CategoryProductSelector() {
  const [categories, setCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [thirdCategories, setThirdCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedFirst, setSelectedFirst] = useState("");
  const [selectedSecond, setSelectedSecond] = useState("");
  const [selectedThird, setSelectedThird] = useState("");

  // Pagination states
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(20); // Fixed page size
  const [hasMore, setHasMore] = useState(true); // To disable load more button when no more data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFirstChange = (e) => {
    const id = e.target.value;
    setSelectedFirst(id);
    setSelectedSecond("");
    setSelectedThird("");
    setProducts([]);
    setPageNum(1);

    const selected = categories.find((cat) => cat.categoryFirstId === id);
    setSecondCategories(selected?.categoryFirstList || []);
    setThirdCategories([]);
  };

  const handleSecondChange = (e) => {
    const id = e.target.value;
    setSelectedSecond(id);
    setSelectedThird("");
    setProducts([]);
    setPageNum(1);

    const selected = secondCategories.find((cat) => cat.categorySecondId === id);
    setThirdCategories(selected?.categorySecondList || []);
  };

  const handleThirdChange = async (e) => {
    const id = e.target.value;
    setSelectedThird(id);
    setProducts([]);
    setPageNum(1);
    if (id) {
      fetchProducts(id, 1);
    }
  };

  const fetchProducts = async (categoryId, page) => {
    setLoading(true);
    try {
      const res = await getProductsByCategory(categoryId, page, pageSize);
      if (res.success) {
        const newProducts = res.products || [];
        if (page === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        // Check if more products available
        setHasMore(newProducts.length === pageSize);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = pageNum + 1;
    setPageNum(nextPage);
    fetchProducts(selectedThird, nextPage);
  };

const handleAddToInventory = async (product) => {
  Swal.fire({
    title: 'Adding product...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    // Convert URL to File
    const urlToFile = async (url, filename, mimeType) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: mimeType });
    };

    const mainImageFile = await urlToFile(
      product.productImage,
      "main_image.jpeg",
      "image/jpeg"
    );

    // Prepare item
    const selectedCategoryObj = thirdCategories.find(
      (cat) => cat.categoryId === selectedThird
    );
    const categoryName = selectedCategoryObj?.categoryName || "";

    // Prepare item
    const item = {
      title: product.productNameEn,
      description: product.remark || product.productNameEn,
      basePrice: product.sellPrice,
      attributes: product.attributes || {},
      tags: "", 
      category: categoryName, // use name instead of id
      images: [mainImageFile],
      variants: [],
    };

    const res = await storeService.addItem([item]);

    Swal.close();

    if (true) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added to inventory!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message || "Failed to add product",
      });
    }
  } catch (err) {
    Swal.close();
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong",
    });
  }
};


// New function for adding all products
const handleAddAllToInventory = async () => {
  if (products.length === 0) {
    Swal.fire("No products", "There are no products to add!", "info");
    return;
  }

  Swal.fire({
    title: `Adding products...`,
    html: `0 / ${products.length} completed`,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];

    try {
      // Convert URL to File
      const urlToFile = async (url, filename, mimeType) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: mimeType });
      };

      const mainImageFile = await urlToFile(
        prod.productImage,
        "main_image.jpeg",
        "image/jpeg"
      );

      const selectedCategoryObj = thirdCategories.find(
        (cat) => cat.categoryId === selectedThird
      );
      const categoryName = selectedCategoryObj?.categoryName || "";

      const item = {
        title: prod.productNameEn,
        description: prod.remark || prod.productNameEn,
        basePrice: prod.sellPrice,
        attributes: prod.attributes || {},
        tags: "",
        category: categoryName,
        images: [mainImageFile],
        variants: [],
      };

      await storeService.addItem([item]);
      successCount++;
    } catch (err) {
      console.error(`Failed to add product ${prod.productNameEn}`, err);
      failCount++;
    }

    // Update Swal progress
    Swal.update({
      html: `${i + 1} / ${products.length} completed`,
    });
  }

  Swal.close();

  Swal.fire({
    icon: "success",
    title: "Add All Complete",
    html: `Successfully added: ${successCount} <br> Failed: ${failCount}`,
    timer: 4000,
    showConfirmButton: true,
  });
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Category to View Products</h2>
{products.length > 0 && (
  <div style={{ marginBottom: "20px" }}>
    <button
      onClick={handleAddAllToInventory}
      style={{
        padding: "10px 20px",
        backgroundColor: "#ffc107",
        color: "black",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
      }}
    >
      Add All to Inventory
    </button>
  </div>
)}

      {/* First Category */}
      <select value={selectedFirst} onChange={handleFirstChange}>
        <option value="">Select Main Category</option>
        {categories.map((cat) => (
          <option key={cat.categoryFirstId} value={cat.categoryFirstId}>
            {cat.categoryFirstName}
          </option>
        ))}
      </select>

      {/* Second Category */}
      {secondCategories.length > 0 && (
        <select value={selectedSecond} onChange={handleSecondChange}>
          <option value="">Select Subcategory</option>
          {secondCategories.map((sub) => (
            <option key={sub.categorySecondId} value={sub.categorySecondId}>
              {sub.categorySecondName}
            </option>
          ))}
        </select>
      )}

      {/* Third Category */}
      {thirdCategories.length > 0 && (
        <select value={selectedThird} onChange={handleThirdChange}>
          <option value="">Select Category</option>
          {thirdCategories.map((third) => (
            <option key={third.categoryId} value={third.categoryId}>
              {third.categoryName}
            </option>
          ))}
        </select>
      )}

      {/* Product List */}
      {products.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Products</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
           {products.map((prod) => (
  <div
    key={prod.pid}
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "10px",
      textAlign: "center",
    }}
  >
    <img
      src={prod.productImage}
      alt={prod.productNameEn}
      style={{ width: "100%", height: "150px", objectFit: "cover" }}
    />
    <h4 style={{ fontSize: "16px", margin: "10px 0" }}>
      {prod.productNameEn}
    </h4>
    <p style={{ color: "green", fontWeight: "bold" }}>
      ${prod.sellPrice}
    </p>
    <p style={{ fontSize: "12px", color: "#666" }}>
      {prod.categoryName}
    </p>

    {/* Add to Inventory Button */}
    <button
      onClick={() => handleAddToInventory(prod)}
      style={{
        padding: "8px 12px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      Add to Inventory
    </button>
  </div>
))}

          </div>

          {/* Load More Button */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={handleLoadMore}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
