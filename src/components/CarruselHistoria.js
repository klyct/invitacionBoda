import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
const imagenes = [
  { src: "/assets/manos_ambos.JPG", alt: "26" },
  { src: "/assets/mano_anilo.JPG", alt: "26" },
  { src: "/assets/ambos_1.JPG", alt: "1" },
  { src: "/assets/ambos_2.JPG", alt: "2" },
  { src: "/assets/ambos_5.JPG", alt: "5" },
  { src: "/assets/ambos_6.JPG", alt: "6" },
  { src: "/assets/ambos_9.JPG", alt: "9" },
  { src: "/assets/ambos_10.JPG", alt: "10" },
  { src: "/assets/ambos_11.JPG", alt: "11" },
  { src: "/assets/ambos_12.JPG", alt: "12" },
  { src: "/assets/ambos_13.JPG", alt: "13" },
  { src: "/assets/ambos_14.JPG", alt: "14" },
  { src: "/assets/ambos_15.JPG", alt: "15" },
  { src: "/assets/ambos_16.JPG", alt: "16" },
  { src: "/assets/ambos_17.JPG", alt: "17" },
  { src: "/assets/ambos_18.JPG", alt: "18" },
  { src: "/assets/ambos_19.JPG", alt: "19" },
  { src: "/assets/ambos_20.JPG", alt: "20" },
  { src: "/assets/ambos_21.JPG", alt: "21" },
  { src: "/assets/ambos_22.JPG", alt: "22" },
  { src: "/assets/ambos_24.JPG", alt: "24" },
  { src: "/assets/ambos_25.JPG", alt: "25" },
  { src: "/assets/maincra_1.JPG", alt: "25" },
];

export default function CarruselHistoria() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-16 text-center text-gray-800 max-w-screen-xl mx-auto">
      <h2 className="text-5xl font-alexbrush font-bold mb-8 text-[#c798c8]">Nuestra historia</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 6000 }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop
        spaceBetween={8}
        slidesPerView="auto"
        centeredSlides
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="px-4"
      >
        <div className="swiper-button-prev !text-white after:!text-3xl"></div>
        <div className="swiper-button-next !text-white after:!text-3xl"></div>
        {imagenes.map((img, i) => {
          const isActive = i === activeIndex;

          return (
            <SwiperSlide
              key={i}
              className={`
                flex items-center justify-center
                transition-all duration-1000 ease-in-out
                rounded-lg overflow-hidden
                aspect-[3/4] 
                !w-[calc(100vw/2.1)] max-w-[480px]
                }
              `}
            >
              
              <img
                src={img.src}
                alt={`slide-${i}_${img.alt}`}
                className="w-full h-full object-cover object-center"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <p className="pt-8 px-8 text-xl font-roboto text-[#c798c8] max-w-xl mx-auto">
        “Nuestro amor crece con cada sonrisa, con cada abrazo, con cada mirada.”
      </p>
    </section>
  );
}
