const axios = require("axios");

const ACCESS_TOKEN = "API@CJ4650913@CJ:eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNzEzOCIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnlrKzZ1eFpHR21pZXdTOER2Z2hKZndralBVWDdtb1V3TmtvWEV1K2J2YVdWYTVkaFVZMUFoZWZJTWZzVW42dHhPSDYyNmVhUk1TVEIrcThjaE54YkVpb3FNYTFvRDZhYm5sK1BRL1pZMGVlNUxpakpWRmkzSnEvRHFEZUUyNHZtL24rRlByY1J1MGltZlMzVEhGc2Y5ZzhBb0ptNHMxQUYxdVh1RTRRZjh4Slg2Y3FjYUtKZEhta2E2L0ZHeUJkVlV0SzJzOWhKMnNEMXlZdmlTR1psK1VLcUkrMWNKY2RWTkVscXlYNWlhendpK1JtL1NObjZCWTJpb0VzY2toME1aQ1N0ZkorYzFLWUc1VGZLMG8xeXRRcWxXbW94SWVKeVduWmhPQjlReFN4SlI3b0VCZXgwMHNycmZJUzZTanBqZEE9PSIsImlhdCI6MTc1NjAyNDA0MH0.DU05Nz56mBiWu0orT-3STOdS53wuUdgGqTDrU_k4PyU"; // अपना CJ Access Token डालो

// ✅ Categories Fetch
exports.getCategories = async (req, res) => {
  try {
    const response = await axios.get(
      "https://developers.cjdropshipping.com/api2.0/v1/product/getCategory",
      {
        headers: { "CJ-Access-Token": ACCESS_TOKEN },
      }
    );
console.log(response)
    res.json({
      success: true,
      categories: response.data.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// ✅ Products by Category
    exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId, pageNum, pageSize, searchType } = req.query;

        if (!categoryId)
        return res.status(400).json({ success: false, message: "categoryId is required" });

        const response = await axios.get(
        "https://developers.cjdropshipping.com/api2.0/v1/product/list",
        {
            headers: { "CJ-Access-Token": ACCESS_TOKEN },
            params: { categoryId, pageNum, pageSize, searchType },
        }
        );

        res.json({
        success: true,
        products: response.data.data.list,
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
    };
