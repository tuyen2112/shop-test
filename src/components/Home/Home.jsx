import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const products = [
  { id: 1, name: "Áo Thun Nam", price: "200.000 VND", image: "https://1557691689.e.cdneverest.net/fast/1325x0/filters:format(webp)/static.5sfashion.vn/storage/product_color/cGfvEZM2jgPcqmR7sIAfTQeWnl72lXC1.webp" },
  { id: 2, name: "Quần jean Nam", price: "100.000 VND", image: "https://1557691689.e.cdneverest.net/fast/1325x0/filters:format(webp)/static.5sfashion.vn/storage/product_color/cGfvEZM2jgPcqmR7sIAfTQeWnl72lXC1.webp" },
  { id: 3, name: "Quần nỉ nam", price: "600.000 VND", image: "https://1557691689.e.cdneverest.net/fast/1325x0/filters:format(webp)/static.5sfashion.vn/storage/product_color/cGfvEZM2jgPcqmR7sIAfTQeWnl72lXC1.webp" },
  { id: 4, name: "Quần bò nam", price: "700.000 VND", image: "https://1557691689.e.cdneverest.net/fast/1325x0/filters:format(webp)/static.5sfashion.vn/storage/product_color/cGfvEZM2jgPcqmR7sIAfTQeWnl72lXC1.webp0" },
  { id: 5, name: "Áo Khoác Da", price: "1.200.000 VND", image: "https://1557691689.e.cdneverest.net/fast/1325x0/filters:format(webp)/static.5sfashion.vn/storage/product_color/cGfvEZM2jgPcqmR7sIAfTQeWnl72lXC1.webp" },
  { id: 6, name: "Mũ Lưỡi Trai", price: "150.000 VND", image: "https://1557691689.e.cdneverest.net/fast/1325x0/filters:format(webp)/static.5sfashion.vn/storage/product_color/cGfvEZM2jgPcqmR7sIAfTQeWnl72lXC1.webp" },
];



export default function Home() {

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
     
        <Navbar/>
     

      {/* Banner */}
      <div className="bg-blue-500 text-white text-center py-10 text-2xl font-bold">
        Giảm giá 50% cho sản phẩm mới!
      </div>

      {/* Product Slider */}
      <div className="container mx-auto py-10 px-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          autoplay={{ delay: 3000 }}
          modules={[Autoplay]}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white p-4 shadow-md rounded-lg "  onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-600">{product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-10">
        &copy; 2025 Fashion Store. All rights reserved.
      </footer>
    </div>
  );
}
