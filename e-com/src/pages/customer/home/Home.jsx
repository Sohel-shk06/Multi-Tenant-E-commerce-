import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../../services/category.service';
import { 
  ArrowRight, Package, Laptop, Shirt, Sparkles, 
  Dumbbell, Home as HomeIcon, Gamepad2, ShieldCheck, 
  Truck, RotateCcw, Headphones, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { TrendingProducts } from './TrendingProducts';
import { NewArrivals } from './NewArrivals';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const slideInterval = useRef(null);

  const heroSlides = [
    {
      subtitle: "NEW COLLECTION",
      heading: "Upgrade Your Lifestyle",
      description: "Discover the latest trends in electronics, fashion, home essentials & more.",
      cta: "Shop Now",
      link: "/products",
      image: "/hero_banner_wide.png",
      background: "linear-gradient(135deg, #F9D3E0 0%, #D1C1E5 100%)",
      startColor: "#F9D3E0"
    },
    {
      subtitle: "TRENDING FASHION",
      heading: "Elevate Your Everyday Style",
      description: "Explore designer wardrobe essentials, modern tailoring, and comfortable footwear curated for every occasion.",
      cta: "Explore Apparel",
      link: "/products?search=fashion",
      image: "/hero_fashion_new_wide.png",
      background: "linear-gradient(135deg, #E9E1F0 0%, #B099C7 100%)",
      startColor: "#E9E1F0"
    },
    {
      subtitle: "ORGANIC BEAUTY",
      heading: "Nourish Your Natural Self",
      description: "Indulge in premium skincare formulations, clean beauty cosmetics, and spa-grade wellness remedies.",
      cta: "Browse Beauty",
      link: "/products?search=beauty",
      image: "/hero_beauty_new_wide.png",
      background: "linear-gradient(135deg, #F8CEDA 0%, #D2CCE8 100%)",
      startColor: "#F8CEDA"
    }
  ];

  const categoryMapping = [
    {
      match: ['electronics', 'elect', 'tech'],
      title: "Electronics",
      subtext: "Laptops, Mobiles & more",
      color: "bg-[#EAF2FF]",
      icon: <Laptop className="w-6 h-6 text-[#2F80ED]" />
    },
    {
      match: ['fashion', 'apparel', 'clothing'],
      title: "Fashion",
      subtext: "Men, Women & Kids",
      color: "bg-[#FFF0F5]",
      icon: <Shirt className="w-6 h-6 text-[#EB5757]" />
    },
    {
      match: ['home', 'kitchen', 'decor', 'appliances'],
      title: "Home & Kitchen",
      subtext: "Appliances & Decor",
      color: "bg-[#E8F8F0]",
      icon: <HomeIcon className="w-6 h-6 text-[#27AE60]" />
    },
    {
      match: ['beauty', 'health', 'care', 'cosmetics', 'beauty & health'],
      title: "Beauty & Health",
      subtext: "Skincare & Grooming",
      color: "bg-[#FDF0F7]",
      icon: <Sparkles className="w-6 h-6 text-[#D01E7E]" />
    },
    {
      match: ['sports', 'fitness', 'gym', 'sports & fitness'],
      title: "Sports & Fitness",
      subtext: "Equipment & Accessories",
      color: "bg-[#EEF2FF]",
      icon: <Dumbbell className="w-6 h-6 text-[#2F80ED]" />
    },
    {
      match: ['toys', 'games', 'books', 'kids', 'toys & games'],
      title: "Toys & Games",
      subtext: "Fun for All Ages",
      color: "bg-[#FFF5E6]",
      icon: <Gamepad2 className="w-6 h-6 text-[#F2994A]" />
    }
  ];

  const startSlideTimer = () => {
    stopSlideTimer();
    slideInterval.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesRes = await categoryService.getCategories();
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    startSlideTimer();
    return () => stopSlideTimer();
  }, []);

  useEffect(() => {
    if (isHovering) {
      stopSlideTimer();
    } else {
      startSlideTimer();
    }
  }, [isHovering]);

  const handlePrevSlide = (e) => {
    e.preventDefault();
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e.preventDefault();
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const getCategoryStyle = (categoryName) => {
    if (!categoryName) {
      return {
        color: "bg-[#F3ECFF]",
        icon: <Package className="w-6 h-6 text-[#6C4DF6]" />
      };
    }
    const nameLower = categoryName.toLowerCase();
    const matched = categoryMapping.find(item =>
      item.match.some(m => nameLower.includes(m))
    );
    if (matched) {
      return {
        color: matched.color,
        icon: matched.icon
      };
    }
    return {
      color: "bg-[#F3ECFF]",
      icon: <Package className="w-6 h-6 text-[#6C4DF6]" />
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4DF6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] pb-16">
      
      {/* Hero Carousel Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div 
          className="relative h-[500px] rounded-[24px] overflow-hidden border border-[#E9E7F5] shadow-sm"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 flex items-center transition-all duration-700 ease-in-out ${
                idx === activeSlide ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 translate-x-8 pointer-events-none'
              }`}
              style={{ background: slide.background }}
            >
              {/* Background image covering the entire slide background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={slide.image} 
                  alt={slide.subtitle}
                  className="w-full h-full object-cover object-right scale-[1.04] origin-right transition-transform duration-700"
                />
              </div>
              
              {/* Text backdrop gradient overlay for perfect copy legibility and seamless image blending */}
              <div 
                className="absolute inset-y-0 left-0 w-full lg:w-[58%] z-10 pointer-events-none" 
                style={{
                  background: `linear-gradient(to right, ${slide.startColor} 0%, ${slide.startColor} 45%, transparent 100%)`
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full items-center px-8 sm:px-16 lg:px-20 gap-8 relative z-20">
                {/* Slide Text */}
                <div className="lg:col-span-6 flex flex-col justify-center text-left">
                  <span className="text-[#6C4DF6] text-xs sm:text-sm font-extrabold tracking-wider mb-3">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1E2F] leading-tight mb-4 tracking-tight">
                    {slide.heading}
                  </h1>
                  <p className="text-sm sm:text-base text-[#6B7280] font-medium max-w-md mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <div>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center space-x-2 bg-[#6C4DF6] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-[#5B3EE0] transition-colors"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Left Arrow Button */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white hover:bg-gray-50 text-[#1E1E2F] flex items-center justify-center shadow-md border border-[#E9E7F5] transition-all hover:scale-105 duration-200"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white hover:bg-gray-50 text-[#1E1E2F] flex items-center justify-center shadow-md border border-[#E9E7F5] transition-all hover:scale-105 duration-200"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide ? 'bg-[#6C4DF6]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-10">
        <div className="bg-white rounded-[20px] border border-[#E9E7F5] shadow-sm grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E9E7F5] py-6 px-4">
          <div className="p-4 flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#6C4DF6]" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#1E1E2F] text-sm mb-0.5">Secure Shopping</h4>
              <p className="text-[11px] text-[#6B7280] font-medium leading-tight">100% secure payments</p>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#6C4DF6]" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#1E1E2F] text-sm mb-0.5">Fast Delivery</h4>
              <p className="text-[11px] text-[#6B7280] font-medium leading-tight">Quick & reliable delivery</p>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-[#6C4DF6]" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#1E1E2F] text-sm mb-0.5">Easy Returns</h4>
              <p className="text-[11px] text-[#6B7280] font-medium leading-tight">Hassle-free returns</p>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-[#6C4DF6]" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#1E1E2F] text-sm mb-0.5">24/7 Support</h4>
              <p className="text-[11px] text-[#6B7280] font-medium leading-tight">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h2 className="text-2.5xl font-extrabold text-[#1E1E2F] tracking-tight">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-[#6C4DF6] hover:text-[#5B3EE0] flex items-center space-x-1 transition-colors">
            <span>View All</span>
            <span>&rarr;</span>
          </Link>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => {
              const linkPath = `/products?category=${cat._id}`;
              const matchedStyle = getCategoryStyle(cat.name);
              return (
                <Link 
                  key={cat._id} 
                  to={linkPath}
                  className="bg-white p-6 rounded-[20px] border border-[#E9E7F5] text-center hover:border-[#6C4DF6] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col items-center"
                >
                  <div className={`w-14 h-14 ${matchedStyle.color} rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 overflow-hidden`}>
                    {cat.image ? (
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      matchedStyle.icon
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#1E1E2F] mb-1 truncate w-full">{cat.name}</p>
                  <p className="text-[11px] text-[#6B7280] font-medium leading-tight line-clamp-2 w-full">
                    {cat.description || "Explore collection"}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-[#E9E7F5] rounded-[24px]">
            <Package className="w-12 h-12 text-[#6B7280]/40 mx-auto mb-3" />
            <p className="text-sm text-[#6B7280] font-semibold">No categories available at the moment.</p>
          </div>
        )}
      </div>

      {/* Trending Products Section */}
      <TrendingProducts />

      {/* New Arrivals Section */}
      <NewArrivals />
    </div>
  );
};