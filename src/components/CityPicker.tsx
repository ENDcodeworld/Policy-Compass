import { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
} from "lucide-react";
import { cities, getCitiesByProvince, getAllProvinces } from "@/data/cities";

interface CityPickerProps {
  selectedCities: string[];
  onCityToggle: (cityName: string) => void;
  onClose?: () => void;
  mode?: "single" | "multiple";
  maxHeight?: string;
}

export default function CityPicker({
  selectedCities,
  onCityToggle,
  onClose,
  mode = "multiple",
  maxHeight = "400px",
}: CityPickerProps) {
  const [searchText, setSearchText] = useState("");
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  const allProvinces = getAllProvinces();
  const hotCities = cities.filter((c) => c.isHot);

  const filteredCities = useMemo(() => {
    if (!searchText.trim()) return cities;
    const keyword = searchText.toLowerCase();
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.province.toLowerCase().includes(keyword)
    );
  }, [searchText]);

  const provinceCityCount = useMemo(() => {
    const map: Record<string, number> = {};
    allProvinces.forEach((province) => {
      map[province] = getCitiesByProvince(province).length;
    });
    return map;
  }, [allProvinces]);

  const getCityEmoji = (cityName: string): string => {
    const emojiMap: Record<string, string> = {
      北京: "🏛️",
      上海: "🌆",
      广州: "🌸",
      深圳: "🚀",
      杭州: "🍃",
      成都: "🐼",
      武汉: "🌸",
      南京: "🏯",
      西安: "🏺",
      天津: "🌉",
      重庆: "🌃",
      苏州: "🏞️",
      青岛: "🌊",
      厦门: "🏝️",
      长沙: "🌶️",
      郑州: "🛤️",
      济南: "⛰️",
      沈阳: "❄️",
      大连: "🐚",
      哈尔滨: "⛄",
      合肥: "🏙️",
      福州: "🌺",
      昆明: "🌸",
      贵阳: "⛰️",
      太原: "🏰",
      兰州: "🏜️",
      呼和浩特: "🐎",
      南宁: "🌴",
      海口: "🏝️",
      乌鲁木齐: "🕌",
      拉萨: "🏔️",
    };
    return emojiMap[cityName] || "📍";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">选择城市</h3>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {cities.length}个城市
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索城市名称或省份..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>

        {selectedCities.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">已选：</span>
            {selectedCities.slice(0, 5).map((city) => (
              <button
                key={city}
                onClick={() => onCityToggle(city)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
              >
                {city}
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedCities.length > 5 && (
              <span className="text-xs text-slate-500">
                +{selectedCities.length - 5}个
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex" style={{ height: maxHeight }}>
        <div className="w-28 border-r border-slate-100 dark:border-slate-700 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
          {!searchText && (
            <button
              onClick={() => setActiveProvince(null)}
              className={`w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${
                activeProvince === null
                  ? "bg-white dark:bg-slate-800 text-primary-600 font-medium border-r-2 border-primary-500"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500" />
              热门城市
            </button>
          )}
          {allProvinces.map((province) => (
            <button
              key={province}
              onClick={() => setActiveProvince(province)}
              className={`w-full px-3 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                activeProvince === province
                  ? "bg-white dark:bg-slate-800 text-primary-600 font-medium border-r-2 border-primary-500"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <span className="truncate">
                {province.replace(/省|市|自治区|壮族自治区|回族自治区|维吾尔自治区/g, "")}
              </span>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {provinceCityCount[province]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {searchText ? (
            <div>
              {filteredCities.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {filteredCities.map((city) => {
                    const selected = selectedCities.includes(city.name);
                    return (
                      <button
                        key={city.name}
                        onClick={() => onCityToggle(city.name)}
                        className={`p-2.5 rounded-xl text-sm transition-all text-left ${
                          selected
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 ring-1 ring-primary-300 dark:ring-primary-700"
                            : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium">{city.name}</span>
                          {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate">
                          {city.policyCount}条政策
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm">没有找到相关城市</p>
                </div>
              )}
            </div>
          ) : activeProvince === null ? (
            <div>
              <div className="text-xs text-slate-500 mb-2 px-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                热门城市
              </div>
              <div className="grid grid-cols-3 gap-2">
                {hotCities.map((city) => {
                  const selected = selectedCities.includes(city.name);
                  return (
                    <button
                      key={city.name}
                      onClick={() => onCityToggle(city.name)}
                      className={`p-2.5 rounded-xl transition-all text-left ${
                        selected
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 ring-1 ring-primary-300 dark:ring-primary-700"
                          : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="text-lg mb-1">{getCityEmoji(city.name)}</div>
                      <div className="font-medium text-sm truncate">{city.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {city.policyCount}条政策
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-slate-500 mb-2 px-1">
                {activeProvince}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {getCitiesByProvince(activeProvince).map((city) => {
                  const selected = selectedCities.includes(city.name);
                  return (
                    <button
                      key={city.name}
                      onClick={() => onCityToggle(city.name)}
                      className={`p-2.5 rounded-xl text-sm transition-all text-left ${
                        selected
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 ring-1 ring-primary-300 dark:ring-primary-700"
                          : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate font-medium">{city.name}</span>
                        {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {city.policyCount}条政策
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
