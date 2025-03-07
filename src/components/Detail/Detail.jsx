import React from "react";
import { useParams } from "react-router-dom";

const products = [
  { id: 1, name: "Áo Thun Nam", price: "200.000 VND", description: "Áo thun nam chất liệu cotton thoáng mát.", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Quần Jean Nam", price: "100.000 VND", description: "Quần jean nam phong cách Hàn Quốc.", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Quần Nỉ Nam", price: "600.000 VND", description: "Quần nỉ mềm mại, giữ ấm tốt.", image: "https://via.placeholder.com/150" },
];

export default function Detail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <h1 className="text-center text-2xl mt-10">Sản phẩm không tồn tại</h1>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded-md" />
        <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
        <p className="text-gray-600 text-lg">{product.price}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Mua ngay
        </button>
      </div>
    </div>
  );
}
