"use client"

import React, { useEffect, useRef } from "react";

interface ScatteredImage {
  src: string;
  alt: string;
  className: string;
  rotate: number;
}

const collageImages: ScatteredImage[] = [
  { src: "https://lh3.googleusercontent.com/aida/AP1WRLtjVVqBT9D5xxq5dMycRrwdFaBeMhNi4Sab3TYE5ua_grkbY6fqN-JD79oHXGWlBlqbHbb8RBXiJ-DOF1wZ3nbe43yjHRl1ngerO8IzGUgKIf57SzeLkgUD6OobcUatikvS5OWsk1pDF4sz82LUR8cFkapp8cnnVb0seyZeXxme68VGMpDMSANihXb1IODigGVkOfUc0wHYbWDxZzCcDJpWJrEjoiXw-7NkAVQ8pR_IHXG0Rrlmb-HW_JRr", alt: "Cozy room", className: "w-64 h-80 top-[10%] left-[5%]", rotate: -6 },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQJlYXTC8QKbDBhiyvVO7NwXgxt-FvBLqSZUvry62BjCNMz7kjWLQW9Gp0eUqlBgPc8jnH0zjvFP64OUGA1ztij94JLpdY8_Ow2b4q3rk4hX836tRE3geZC5k2jR0GyV0JKSkPlEbZGwmw4_G1WhAsiMuy6277MMfonA-LNdLyBRkunn1WLiu8Cs1dQeThPx4qOFlnccV9KzqqLbTJZAfwaqZ6zJeik7i0JvBZR_aWL1rN0QcJw78xxXorC4s34edII4Ms2CdyC_PH", alt: "Student working", className: "w-72 h-48 top-[15%] right-[8%]", rotate: 4 },
  { src: "https://lh3.googleusercontent.com/aida/AP1WRLtd56nxUyVmx1_-JtY4wUzBxjUWXhfrBBI3X7OgvebTRRbZRWxB3bsbQLr7lvgWFiW9zrHVJ3RDpf6vRWGSvTl0TncnqKFwDolYWNzKp2ildj-6I1WPpnU8h5SzaXa_KcTz-DyKwp2R0T1CvrjxNJnQhqcE1PHQw8fFen4wWDreTdq47W7W_6QSDmZuwlIwGjnSrmrWIRdRl5YQDi3y6SfXjJFJbnacAC29e1oReyzYgfWDFQYxnMup3XmF", alt: "Rooftop view", className: "w-80 h-56 bottom-[12%] left-[10%]", rotate: -3 },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1FelmrOyDU58DcX2kej-SSV6JinRZHr16OI4Z0B9n_cjXfQp-CTCruPUso3Mim3DaNnYhK1mRAunkclMD2xrvIFZXRhOWw4uP3Dzsfe04iy_0lMqrNrCPPKHVfD55BM6yYqWE4acJrfNXh2vsFb1CuHZcMDmZmUACwozZbmbmX7MxMrHiQloWCoHZOAEKvpwObb89wX_QC49awtS3H5kQlb-UBPLaQwnbr8HKBe9rVnNTbhicwnjghnUJsZMRIMfdbCxB65lenrFY", alt: "Kitchen area", className: "w-56 h-72 bottom-[20%] right-[5%]", rotate: 8 },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVVd5tOqcV3Q_x3nlOTy3c2EhT6aR1d3VI3ScfbwYWlf6tehJOr294NYCU7rSBzK7aYNgvERXNaK6L3JcagE5WeuUq_eFy3QWTBSlM8BNsEQNfWfXCYtd_B5_Jep1bY1sLsFeSJSDxZ8IxtBOfLGZgu3VhyeU5BL2GeHFfcvDWCT8ewfIIoiWKD4xKn5Agy4hweSeHwcD_npWY1KEbBiJWyX5DWze6lyMJ5_-mISX7al2lXGYykv_SYXCBy9bdCMdBy2_DlTlUeZZs", alt: "Unpacking", className: "w-48 h-64 top-[40%] left-[2%]", rotate: 12 },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3Mq1AjBIAZ_i5coLVYRHFntwIzcqYX-atbO0tlW44hVZH9bmvcUEofoZGSrW_PSOOW28LRUPsvm5NKy2cFw5NtLJisfjPoBxjxsxTKWfjQl99KfYrtLjwh8nX5XiA2W2rK0WkpiTVBG05BCp7anjFft-q1BhG5HoR7tPlwdQJCYU7DoKSHURrZQrVKu4xSeEz_KoMoDOMz23qMTQGWPYQ_WmXpv-uywcP3rbc9omOevyLql1AcVplb8o7o-bqYM83FvfnpY81UV9k", alt: "Flatmates chilling", className: "w-64 h-48 bottom-[5%] right-[15%]", rotate: -2 },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjqytt-f1mq_oAG53GoE9_HMvQwxR2osPuR1zdYlSJOmwkZWvVXnLefoGJZVcECTu9ysSOHAWJn_fR4XNH_rl3RpcAvqRpuOS7XJdUORXtj8MHCZGN0klZawsnqAgyuN5ElQ4fgel_4ardbPQZdBC6ssRBSLjrDj9jwIY9--LfZNfDYEBeDSHKXmLGVp6X3xRuVV3Sco0-21lrc3M7mFgJ5Tnk0s-B_rxl1LIh2DoLWaCrl3JUKL7iSo5jeu-uYX6SyRJVZmKEMTC1", alt: "Verified badge", className: "w-40 h-32 top-[5%] left-[30%]", rotate: 15 },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyH3Dg9xBcE9KbAlaEGCbg3UcV7txexQ7ARMpQUsuTMMffQc9sDSQLIbRt1e8-OTzD1gDic4z7-NydWYuWUrhRJrqpAshS-dWeKoNmNJXNE9VzyFr-V5JiN15kbselxMYfVnKVyO3aUQ6eM1Ywjlr9yX3o_IDTMH73OG3FvNn5mgneS9X9-3iSnH0fIgUjDicsqy1l4z0hxHgCBvHNE1p0vGf4_PIuvLCcMs6qha0rsCpVIAwkj5NAqLS4rysiSVRXAO4EFKIasHXK", alt: "Street scene", className: "w-64 h-64 top-[60%] right-[10%]", rotate: -5 }
];

export const EditorialCollage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const images = containerRef.current.querySelectorAll<HTMLImageElement>(".scattered-image");
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;

      images.forEach((img, i) => {
        const speed = (i + 1) * 0.2;
        const baseRotate = img.getAttribute("data-rotate") || "0";
        img.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${baseRotate}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="mt-8 z-10 relative min-h-screen w-full pt-24 bg-surface-container-lowest flex items-center justify-center overflow-hidden">
      {collageImages.map((img, index) => (
        <img
          key={index}
          alt={img.alt}
          src={img.src}
          data-rotate={img.rotate}
          className={`absolute scattered-image rounded-xl object-cover z-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out hover:scale-105 hover:!rotate-0 hover:z-20 ${img.className}`}
          style={{ transform: `rotate(${img.rotate}deg)` }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-[20px] pointer-events-none">
        <h1 className="text-white font-black text-[120px] leading-[110px] tracking-[-0.05em] mb-12 drop-shadow-sm">
          Where Every Journey Finds a Home
        </h1>
        <a className="inline-flex items-center gap-2 border-2 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform active:scale-95 border-white text-white pointer-events-auto" href="#">
          Browse Listings <span className="material-symbols-outlined">--#</span>
        </a>
      </div>
    </section>
  );
};