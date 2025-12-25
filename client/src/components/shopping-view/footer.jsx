import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [item],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">ShopEase</h3>
            <p className="text-sm leading-relaxed">
              Your ultimate destination for quality fashion and accessories. We bring you the best brands at unbeatable prices.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/shop/listing" className="text-sm hover:text-white transition-colors">
                  Shop All
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigateToListingPage("men", "category")}
                  className="text-sm hover:text-white transition-colors text-left"
                >
                  Men
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateToListingPage("women", "category")}
                  className="text-sm hover:text-white transition-colors text-left"
                >
                  Women
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateToListingPage("kids", "category")}
                  className="text-sm hover:text-white transition-colors text-left"
                >
                  Kids
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateToListingPage("accessories", "category")}
                  className="text-sm hover:text-white transition-colors text-left"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateToListingPage("footwear", "category")}
                  className="text-sm hover:text-white transition-colors text-left"
                >
                  Footwear
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  123 Fashion Street, Thane, Maharashtra 
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-sm hover:text-white transition-colors">
                  +91 1800-12345
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:support@shophub.com" className="text-sm hover:text-white transition-colors">
                  support@shopEase.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
