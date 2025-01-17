import React, { useState, useEffect } from 'react';
import { Search, History, MapPin, ChevronDown, X, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MultiEcomSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('us');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSites, setSelectedSites] = useState({});
  const [priceData, setPriceData] = useState(null);
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  const regions = {
    us: { name: 'United States', flag: '🇺🇸' },
    in: { name: 'India', flag: '🇮🇳' },
    uk: { name: 'United Kingdom', flag: '🇬🇧' },
    ca: { name: 'Canada', flag: '🇨🇦' },
    au: { name: 'Australia', flag: '🇦🇺' },
  };

  const ecommerceSites = {
    // Indian Platforms
    myntra: {
      name: 'Myntra',
      logo: '👔',
      regions: {
        in: 'https://www.myntra.com/:search?q='
      }
    },
    ajio: {
      name: 'AJIO',
      logo: '👚',
      regions: {
        in: 'https://www.ajio.com/search/?text='
      }
    },
    nykaa: {
      name: 'Nykaa',
      logo: '💄',
      regions: {
        in: 'https://www.nykaa.com/search/result/?q='
      }
    },
    tatacliq: {
      name: 'Tata CLiQ',
      logo: '🛍️',
      regions: {
        in: 'https://www.tatacliq.com/search/?searchCategory=all&text='
      }
    },
    reliancedigital: {
      name: 'Reliance Digital',
      logo: '📱',
      regions: {
        in: 'https://www.reliancedigital.in/search?q='
      }
    },
    snapdeal: {
      name: 'Snapdeal',
      logo: '🎁',
      regions: {
        in: 'https://www.snapdeal.com/search?keyword='
      }
    },
    jiomart: {
      name: 'JioMart',
      logo: '🏪',
      regions: {
        in: 'https://www.jiomart.com/search/'
      }
    },
    meesho: {
      name: 'Meesho',
      logo: '🛍️',
      regions: {
        in: 'https://www.meesho.com/search?q='
      }
    },
    croma: {
      name: 'Croma',
      logo: '🔌',
      regions: {
        in: 'https://www.croma.com/searchB?q='
      }
    },
    amazon: {
      name: 'Amazon',
      logo: '🛒',
      regions: {
        us: 'https://www.amazon.com/s?k=',
        in: 'https://www.amazon.in/s?k=',
        uk: 'https://www.amazon.co.uk/s?k=',
        ca: 'https://www.amazon.ca/s?k=',
        au: 'https://www.amazon.com.au/s?k='
      }
    },
    flipkart: {
      name: 'Flipkart',
      logo: '🔍',
      regions: {
        in: 'https://www.flipkart.com/search?q='
      }
    },
    ebay: {
      name: 'eBay',
      logo: '📦',
      regions: {
        us: 'https://www.ebay.com/sch/i.html?_nkw=',
        uk: 'https://www.ebay.co.uk/sch/i.html?_nkw=',
        au: 'https://www.ebay.com.au/sch/i.html?_nkw='
      }
    },
    walmart: {
      name: 'Walmart',
      logo: '🏪',
      regions: {
        us: 'https://www.walmart.com/search?q=',
        ca: 'https://www.walmart.ca/search?q='
      }
    },
    target: {
      name: 'Target',
      logo: '🎯',
      regions: {
        us: 'https://www.target.com/s?searchTerm='
      }
    },
    bestbuy: {
      name: 'Best Buy',
      logo: '💻',
      regions: {
        us: 'https://www.bestbuy.com/site/searchpage.jsp?st=',
        ca: 'https://www.bestbuy.ca/en-ca/search?search='
      }
    },
    newegg: {
      name: 'Newegg',
      logo: '🥚',
      regions: {
        us: 'https://www.newegg.com/p/pl?d=',
        ca: 'https://www.newegg.ca/p/pl?d='
      }
    }
  };

  // Initialize selected sites based on available sites for current region
  useEffect(() => {
    const availableSites = {};
    Object.entries(ecommerceSites).forEach(([site, data]) => {
      if (data.regions[selectedRegion]) {
        availableSites[site] = true;
      }
    });
    setSelectedSites(availableSites);
  }, [selectedRegion]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Mock price data generator for demonstration
  const generateMockPriceData = (term) => {
    const sites = Object.keys(selectedSites).filter(site => selectedSites[site]);
    return sites.map(site => ({
      site: ecommerceSites[site].name,
      price: Math.floor(Math.random() * 100) + 50,
      shipping: Math.floor(Math.random() * 10),
      total: Math.floor(Math.random() * 100) + 60
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Save to search history
    const newHistory = [
      { term: searchTerm, timestamp: new Date().toISOString(), region: selectedRegion },
      ...searchHistory
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Generate mock price comparison data
    const priceComparisonData = generateMockPriceData(searchTerm);
    setPriceData(priceComparisonData);
    setShowPriceComparison(true);

    // Open search in new tabs
    Object.entries(selectedSites).forEach(([site, isSelected]) => {
      if (isSelected && ecommerceSites[site].regions[selectedRegion]) {
        const encodedTerm = encodeURIComponent(searchTerm);
        const searchUrl = `${ecommerceSites[site].regions[selectedRegion]}${encodedTerm}`;
        window.open(searchUrl, '_blank');
      }
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Advanced E-commerce Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Region Selector */}
        <div className="flex justify-end">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
              onClick={() => setSelectedRegion(prev => 
                Object.keys(regions)[(Object.keys(regions).indexOf(prev) + 1) % Object.keys(regions).length]
              )}
            >
              <span>{regions[selectedRegion].flag}</span>
              <span>{regions[selectedRegion].name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex items-center gap-2 p-2 border rounded-lg bg-white">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter product name..."
              className="flex-1 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <History className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute z-10 w-full max-w-2xl bg-white border rounded-lg shadow-lg">
              <div className="p-2 border-b flex justify-between items-center">
                <span className="font-medium">Recent Searches</span>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Clear History
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSearchTerm(item.term);
                      setShowHistory(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span>{item.term}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {regions[item.region].flag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Selection */}
          <div className="space-y-4">
            <p className="font-medium">Available platforms for {regions[selectedRegion].name}:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(ecommerceSites).map(([key, site]) => (
                site.regions[selectedRegion] && (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSites[key] || false}
                      onChange={() => setSelectedSites(prev => ({
                        ...prev,
                        [key]: !prev[key]
                      }))}
                      className="w-4 h-4"
                    />
                    <span className="flex items-center gap-2">
                      <span>{site.logo}</span>
                      <span>{site.name}</span>
                    </span>
                  </label>
                )
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!searchTerm.trim() || !Object.values(selectedSites).some(Boolean)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            Search Selected Sites
          </button>
        </form>

        {/* Price Comparison */}
        {showPriceComparison && priceData && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Price Comparison</h3>
              <button
                onClick={() => setShowPriceComparison(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" name="Base Price" />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total (with shipping)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {priceData.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="font-medium">{item.site}</div>
                  <div className="text-sm text-gray-500">Base Price: ${item.price}</div>
                  <div className="text-sm text-gray-500">Shipping: ${item.shipping}</div>
                  <div className="text-lg font-bold text-blue-600">Total: ${item.total}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiEcomSearch;