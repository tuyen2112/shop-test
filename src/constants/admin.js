export const API_URL = "https://ngochieuwedding.io.vn/api/tuyen/product";

export const INITIAL_PRODUCT_DATA = {
  name: "",
  category: "",
  price: "",
  stock: "",
  img: "",
  product_by: "",
  colors: "",
  sizes: "",
  description: "",
};

export const PRODUCT_CATEGORIES = [
  { value: "", label: "Tất cả danh mục" },
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Trẻ em", label: "Trẻ em" },
];

export const PRODUCTS_PER_PAGE = 10;

export const SECTIONS = {
  PRODUCTS: "products",
  DISCOUNTS: "discounts",
  WAREHOUSE: "warehouse",
  NEWS: "news",
};

export const TABS = {
  LIST: "list",
  ADD: "add",
  EDIT: "edit",
}; 