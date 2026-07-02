
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
      
      {/* Hero Carousel Section - Fully Responsive */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8">
        <div 
          className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden border border-[#E9E7F5] shadow-sm"
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
              {/* Background image - responsive sizing */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={slide.image} 
                  alt={slide.subtitle}
                  className="w-full h-full object-cover object-right sm:object-center lg:object-right scale-[1.04] origin-right transition-transform duration-700"
                />
              </div>
              
              {/* Text backdrop gradient overlay - mobile optimized */}
              <div 
                className="absolute inset-y-0 left-0 w-full sm:w-[65%] lg:w-[58%] z-10 pointer-events-none" 
                style={{
                  background: `linear-gradient(to right, ${slide.startColor} 0%, ${slide.startColor} 40%, transparent 100%)`
                }}
              />

              {/* Responsive grid layout */}
              <div className="grid grid-cols-1 w-full h-full items-center px-4 sm:px-8 md:px-12 lg:px-20 gap-4 sm:gap-8 relative z-20">
                {/* Slide Text - Mobile-first typography */}
                <div className="flex flex-col justify-center text-left max-w-full sm:max-w-md md:max-w-lg">
                  <span className="text-[#6C4DF6] text-[10px] sm:text-xs lg:text-sm font-extrabold tracking-wider mb-2 sm:mb-3">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#1E1E2F] leading-tight mb-3 sm:mb-4 tracking-tight">
                    {slide.heading}
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-[#6B7280] font-medium max-w-xs sm:max-w-sm md:max-w-md mb-4 sm:mb-6 lg:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {slide.description}
                  </p>
                  <div>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center space-x-2 bg-[#6C4DF6] text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-md hover:bg-[#5B3EE0] transition-colors"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows - Responsive sizing */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 sm:bg-white hover:bg-gray-50 text-[#1E1E2F] flex items-center justify-center shadow-md border border-[#E9E7F5] transition-all hover:scale-105 duration-200"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleNextSlide}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 sm:bg-white hover:bg-gray-50 text-[#1E1E2F] flex items-center justify-center shadow-md border border-[#E9E7F5] transition-all hover:scale-105 duration-200"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Pagination Dots - Responsive */}
          <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide ? 'bg-[#6C4DF6] w-6 sm:w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section - Hidden on Mobile, Visible on Tablet+ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-6 sm:mb-8 lg:mb-10 hidden sm:block">
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#E9E7F5] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-0 sm:divide-x divide-[#E9E7F5] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#6C4DF6]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1E1E2F] text-xs sm:text-sm mb-0.5">Secure Shopping</h4>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight">100% secure payments</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#6C4DF6]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1E1E2F] text-xs sm:text-sm mb-0.5">Fast Delivery</h4>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight">Quick & reliable delivery</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#6C4DF6]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1E1E2F] text-xs sm:text-sm mb-0.5">Easy Returns</h4>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight">Hassle-free returns</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F3ECFF]/70 rounded-full flex-shrink-0 flex items-center justify-center">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#6C4DF6]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1E1E2F] text-xs sm:text-sm mb-0.5">24/7 Support</h4>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Fully Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-6 sm:mb-8">
        <div className="flex justify-between items-end mb-4 sm:mb-6 lg:mb-8 text-left">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1E1E2F] tracking-tight">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-xs sm:text-sm font-bold text-[#6C4DF6] hover:text-[#5B3EE0] flex items-center space-x-1 transition-colors">
            <span>View All</span>
            <span>&rarr;</span>
          </Link>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((cat) => {
              const linkPath = `/products?category=${cat._id}`;
              const matchedStyle = getCategoryStyle(cat.name);
              return (
                <Link 
                  key={cat._id} 
                  to={linkPath}
                  className="bg-white p-4 sm:p-5 lg:p-6 rounded-[16px] sm:rounded-[20px] border border-[#E9E7F5] text-center hover:border-[#6C4DF6] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col items-center"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${matchedStyle.color} rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 overflow-hidden`}>
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
                  <p className="text-xs sm:text-sm font-bold text-[#1E1E2F] mb-1 truncate w-full">{cat.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight line-clamp-2 w-full">
                    {cat.description || "Explore collection"}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-white border border-[#E9E7F5] rounded-[20px] sm:rounded-[24px]">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-[#6B7280]/40 mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#6B7280] font-semibold">No categories available at the moment.</p>
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