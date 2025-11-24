import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Utensils, 
  Train, 
  ShoppingBag, 
  Sun, 
  CloudRain, 
  Cloud, 
  Camera, 
  Info, 
  Plane, 
  Hotel,
  ChevronDown,
  ChevronUp,
  Star,
  Coffee
} from 'lucide-react';

// --- 資料層：從PDF解析並增強的行程資料 ---
// 這裡加入了「導遊職責」：額外的景點故事、必吃、必買標籤
const itineraryData = [
  {
    day: 1,
    location: "大阪 (Osaka)",
    theme: "抵達 & 南區初體驗",
    weather: "sunny",
    mood: "excited",
    events: [
      { time: "Arrival", title: "關西機場 (KIX) 抵達", type: "transport", desc: "搭乘南海電鐵前往難波" },
      { time: "Check-in", title: "難波/心齋橋 飯店", type: "hotel", desc: "放行李，準備開逛" },
      { time: "Evening", title: "道頓堀 & 心齋橋", type: "spot", desc: "大阪最熱鬧的跑跑人看板" },
      { 
        time: "Dinner", 
        title: "大阪燒 / 章魚燒", 
        type: "food", 
        desc: "推薦：本家章魚燒 或 美津之大阪燒",
        tags: ["必吃美食", "B級美食"]
      }
    ],
    tips: "心齋橋藥妝店價格競爭激烈，建議多比價。南海電鐵有特急 Rapi:t (藍色鐵人28號)，速度最快。"
  },
  {
    day: 2,
    location: "大阪 (Osaka)",
    theme: "藍色海洋療癒日",
    weather: "cloudy",
    mood: "happy",
    events: [
      { time: "Morning", title: "大阪海遊館", type: "spot", desc: "世界最大級的水族館", tags: ["必看鯨鯊"] },
      { time: "Lunch", title: "天保山 Marketplace", type: "food", desc: "浪花美食橫丁，復古昭和風" },
      { time: "Afternoon", title: "聖瑪麗亞號 / 天保山摩天輪", type: "spot", desc: "使用大阪周遊卡很划算" }
    ],
    tips: "海遊館的觸摸池可以摸魟魚（請先洗手）。傍晚摩天輪看夕陽很美。"
  },
  {
    day: 3,
    location: "大阪 (Osaka)",
    theme: "歷史與現代交織",
    weather: "sunny",
    mood: "cool",
    events: [
      { time: "Morning", title: "大阪城公園 (天守閣)", type: "spot", desc: "豐臣秀吉的榮光", tags: ["歷史散步"] },
      { time: "Afternoon", title: "梅田商圈", type: "shopping", desc: "百貨一級戰區 (LUCUA, Grand Front)" },
      { time: "Evening", title: "梅田藍天大廈 空中庭園", type: "spot", desc: "360度絕美夜景", tags: ["浪漫夜景"] }
    ],
    tips: "梅田迷宮容易迷路，建議跟著指標走「御堂筋線」作為定位點。空中庭園的手扶梯是建築奇蹟。"
  },
  {
    day: 4,
    location: "京都 (Kyoto)",
    theme: "京都會合 & 伏見稻荷",
    weather: "rain",
    mood: "travel",
    events: [
      { time: "11:30", title: "大阪退房 -> 京都", type: "transport", desc: "前往京都車站" },
      { time: "13:30", title: "京都車站與朋友會合", type: "highlight", desc: "朋友搭 Haruka 抵達，重要會合點！" },
      { time: "Afternoon", title: "伏見稻荷大社", type: "spot", desc: "千本鳥居，藝妓回憶錄場景", tags: ["必拍景點"] },
      { time: "Dinner", title: "京都車站周邊", type: "food", desc: "拉麵小路或 Porta 地下街" }
    ],
    tips: "伏見稻荷遊客非常多，想拍無人空景建議往山上走一點。千本鳥居是獻給稻荷神的供奉。"
  },
  {
    day: 5,
    location: "京都 (Kyoto)",
    theme: "京都最美散步路線",
    weather: "sunny",
    mood: "relaxed",
    events: [
      { time: "Morning", title: "清水寺", type: "spot", desc: "清水舞台，世界文化遺產", tags: ["整修完畢"] },
      { time: "Lunch", title: "二年坂湯豆腐", type: "food", desc: "京都名物，口感細緻", tags: ["必吃美食"] },
      { time: "Afternoon", title: "二三年坂 -> 祇園", type: "walk", desc: "八坂神社、花見小路", tags: ["古都風情"] }
    ],
    tips: "二年坂傳說跌倒會倒楣兩年(迷信)，其實是要提醒大家路陡小心走。這區有很多抹茶甜點店。"
  },
  {
    day: 6,
    location: "京都 (Kyoto)",
    theme: "嵐山竹林 & 金閣輝煌",
    weather: "cloudy",
    mood: "nature",
    events: [
      { time: "Morning", title: "嵐山竹林小徑", type: "spot", desc: "渡月橋、天龍寺庭園" },
      { time: "Lunch", title: "嵐山湯豆腐 / 蕎麥麵", type: "food", desc: "推薦：廣川鰻魚飯(需預約) 或 嵐山吉村" },
      { time: "Afternoon", title: "金閣寺 (鹿苑寺)", type: "spot", desc: "貼滿金箔的舍利殿", tags: ["極致奢華"] }
    ],
    tips: "金閣寺的門票是一張符咒，可以貼在家裡保平安。嵐山的小火車如果沒訂到，單純散步也很舒服。"
  },
  {
    day: 7,
    location: "奈良 (Nara)",
    theme: "奈良小鹿療癒行",
    weather: "sunny",
    mood: "playful",
    events: [
      { time: "All Day", title: "奈良公園", type: "spot", desc: "被鹿追著跑的快樂(?)", tags: ["小心鹿仙貝"] },
      { time: "Spot", title: "東大寺 & 春日大社", type: "spot", desc: "看世界最大青銅佛像" },
      { 
        time: "Shopping", 
        title: "伴手禮採買", 
        type: "shopping", 
        desc: "中川政七商店(雜貨)、大佛布丁", 
        tags: ["必買伴手禮", "大佛布丁"] 
      }
    ],
    tips: "奈良鹿看起來可愛但其實很兇，手上有仙貝時請注意安全。大佛布丁推薦卡士達原味。"
  },
  {
    day: 8,
    location: "京都 (Kyoto)",
    theme: "京都廚房 & 採買衝刺",
    weather: "cloudy",
    mood: "eating",
    events: [
      { time: "Morning", title: "二條城", type: "spot", desc: "德川家康的寓所，鸝鳴地板" },
      { time: "Lunch", title: "錦市場", type: "food", desc: "京都的廚房，邊走邊吃", tags: ["豆乳甜甜圈", "玉子燒"] },
      { time: "Afternoon", title: "四條河原町", type: "shopping", desc: "百貨林立，最後補貨時機" }
    ],
    tips: "錦市場大部分店家規定不能邊走邊吃(Walking while eating)，通常要在店門口吃完再走。"
  },
  {
    day: 9,
    location: "神戶 (Kobe)",
    theme: "史努比夢幻夜 & 神戶牛",
    weather: "sunny",
    mood: "love",
    events: [
      { time: "Transport", title: "京都 -> 神戶三宮", type: "transport", desc: "JR 直達" },
      { time: "Stay", title: "Peanuts Hotel Check-in", type: "hotel", desc: "全館史努比主題，夢幻住宿", tags: ["重點行程"] },
      { time: "Afternoon", title: "北野異人館街", type: "spot", desc: "洋風建築，最美星巴克" },
      { 
        time: "Dinner", 
        title: "神戶牛排大餐", 
        type: "food", 
        desc: "Mouriya 或 Wakkoqu (務必預約)", 
        tags: ["必吃美食", "人生清單"] 
      }
    ],
    tips: "Peanuts Hotel 的房間每間設計都不同，備品也非常可愛。神戶牛入口即化，建議點 Medium Rare。"
  },
  {
    day: 10,
    location: "返程",
    theme: "優雅返程",
    weather: "sunny",
    mood: "sleepy",
    events: [
      { time: "Morning", title: "Peanuts Hotel 早餐", type: "food", desc: "享受最後的主題餐點" },
      { time: "Transport", title: "神戶三宮 -> KIX", type: "transport", desc: "利木津巴士直達機場" },
      { time: "Flight", title: "飛機返程", type: "transport", desc: "帶著滿滿回憶回家" }
    ],
    tips: "利木津巴士雖然比電車貴一點，但不用搬行李轉車，非常適合最後一天行李爆炸的時候。"
  }
];

// --- 輔助組件 ---

// 模擬線條風格的史努比表情 (使用 SVG 繪製極簡風格)
const SnoopyFace = ({ mood }) => {
  const strokeColor = "#333";
  const strokeWidth = "2.5";

  // 基礎頭型
  const Head = () => (
    <path d="M15,25 Q10,25 10,35 Q10,50 25,50 L45,50 Q60,50 60,35 Q60,20 45,20 L35,20" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
  );
  
  // 耳朵 (黑色垂耳)
  const Ear = () => (
    <path d="M25,20 Q15,20 15,35 Q15,45 25,45 Q30,45 30,35 Z" fill="#333" />
  );

  // 鼻子
  const Nose = () => (
    <circle cx="58" cy="23" r="3.5" fill="#333" />
  );

  // 表情變化
  let Eye, Mouth;

  switch(mood) {
    case 'happy': // 開心笑
    case 'excited':
      Eye = <path d="M38,28 Q42,25 46,28" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />;
      Mouth = <path d="M35,38 Q45,45 55,35" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />;
      break;
    case 'eating': // 貪吃
      Eye = <circle cx="42" cy="28" r="2" fill={strokeColor} />;
      Mouth = <path d="M40,38 Q45,45 50,38" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />; // 舌頭感覺需簡化
      break;
    case 'sleepy': // 睡覺
      Eye = <text x="38" y="32" fontSize="10" fill="#333" fontFamily="sans-serif">zZ</text>;
      Mouth = <path d="M45,40 L50,40" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />;
      break;
    case 'love': // 愛心眼
      Eye = <path d="M38,28 L40,30 L42,28 M38,28 L40,26 L42,28" stroke={strokeColor} fill="none" />; 
      Mouth = <path d="M40,38 Q45,42 50,38" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />;
      break;
    case 'cool': // 墨鏡
    default:
      Eye = <circle cx="42" cy="28" r="2.5" fill={strokeColor} />;
      Mouth = <path d="M35,40 Q45,40 50,38" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />;
      break;
  }

  return (
    <svg width="60" height="60" viewBox="0 0 70 70" className="drop-shadow-sm">
      <Head />
      <Ear />
      <Nose />
      {Eye}
      {Mouth}
      {/* 項圈 */}
      <path d="M22,48 L30,48" stroke="#ef4444" strokeWidth="4" /> 
    </svg>
  );
};

// 天氣組件
const WeatherIcon = ({ type }) => {
  switch(type) {
    case 'sunny': return <Sun className="w-5 h-5 text-amber-500" />;
    case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
    case 'rain': return <CloudRain className="w-5 h-5 text-blue-400" />;
    default: return <Sun className="w-5 h-5 text-amber-500" />;
  }
};

// 標籤樣式生成器
const Tag = ({ text }) => {
  let colorClass = "bg-gray-100 text-gray-600";
  if (text.includes("必吃")) colorClass = "bg-rose-100 text-rose-600 font-bold border-rose-200 border";
  if (text.includes("必買")) colorClass = "bg-emerald-100 text-emerald-600 font-bold border-emerald-200 border";
  if (text.includes("重點")) colorClass = "bg-amber-100 text-amber-700 font-bold border-amber-200 border";

  return (
    <span className={`text-xs px-2 py-1 rounded-full mr-2 mb-1 inline-block ${colorClass}`}>
      {text}
    </span>
  );
};

// 行程卡片
const DayCard = ({ data, isOpen, toggle }) => {
  return (
    <div className="mb-6 relative">
      {/* 左側史努比頭像 - 絕對定位或Flex佈局 */}
      <div className="absolute -left-2 top-0 z-10 hidden md:block">
         {/* Desktop view spacer */}
      </div>

      <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-stone-200' : ''}`}>
        
        {/* Header Area */}
        <div 
          onClick={toggle}
          className="p-4 flex items-center justify-between cursor-pointer bg-stone-50/50"
        >
          <div className="flex items-center gap-3">
             {/* Mobile/Card 史努比 */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-full border border-stone-100 shadow-sm">
              <SnoopyFace mood={data.mood} />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">DAY {data.day}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-600 flex items-center gap-1">
                  <MapPin size={10} /> {data.location}
                </span>
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-blue-600">
                  <WeatherIcon type={data.weather} />
                  <span className="text-xs hidden sm:inline">22°C</span>
                </div>
              </div>
              <h3 className="font-bold text-stone-800 text-lg leading-tight mt-1">{data.theme}</h3>
            </div>
          </div>
          
          <div className="text-stone-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {/* Expanded Content */}
        {isOpen && (
          <div className="p-4 pt-0">
            {/* Guide Tips Section */}
            {data.tips && (
              <div className="mt-3 mb-5 bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-3 text-sm text-amber-800">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" />
                <div>
                  <span className="font-bold block text-xs uppercase tracking-wide text-amber-600 mb-1">Guide's Note</span>
                  {data.tips}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-4 pl-2 relative border-l-2 border-stone-100 ml-2">
              {data.events.map((event, idx) => (
                <div key={idx} className="relative pl-6 pb-2">
                  {/* Dot on timeline */}
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                    ${event.type === 'food' ? 'bg-rose-400' : 
                      event.type === 'transport' ? 'bg-blue-400' : 
                      event.type === 'hotel' ? 'bg-purple-400' :
                      event.type === 'highlight' ? 'bg-amber-400' : 'bg-stone-400'}`}
                  >
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-xs font-mono text-stone-400 w-14 shrink-0">{event.time}</span>
                    <div className="flex-1">
                      <h4 className={`font-bold text-base ${event.type === 'highlight' ? 'text-amber-600' : 'text-stone-800'}`}>
                        {event.title}
                      </h4>
                      <p className="text-sm text-stone-500 mt-0.5 leading-relaxed">
                        {event.desc}
                      </p>
                      {/* Tags */}
                      {event.tags && (
                        <div className="mt-2 flex flex-wrap">
                          {event.tags.map((tag, tIdx) => (
                            <Tag key={tIdx} text={tag} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 資訊頁面 (航班與住宿)
const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 mb-4">
    <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-3">
      <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-stone-800 text-lg">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoTab = () => (
  <div className="space-y-4 animate-fadeIn">
    <InfoCard title="航班資訊 (Flight)" icon={Plane}>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
          <div>
            <div className="text-xs text-stone-400 mb-1">去程 Day 1</div>
            <div className="font-bold text-stone-800">TPE <span className="text-stone-400 mx-1">✈</span> KIX</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-400">抵達關西</div>
            <div className="font-bold text-stone-800">上午/下午</div>
          </div>
        </div>
        <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
          <div>
            <div className="text-xs text-stone-400 mb-1">回程 Day 10</div>
            <div className="font-bold text-stone-800">KIX <span className="text-stone-400 mx-1">✈</span> TPE</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-400">搭利木津巴士</div>
            <div className="font-bold text-stone-800">起飛</div>
          </div>
        </div>
      </div>
    </InfoCard>

    <InfoCard title="住宿規劃 (Accommodation)" icon={Hotel}>
      <ul className="space-y-4">
        <li className="relative pl-4 border-l-2 border-stone-300">
          <span className="text-xs font-bold text-stone-400 block mb-1">Day 1-3 (3 nights)</span>
          <div className="font-bold text-lg text-stone-800">大阪 (Osaka)</div>
          <div className="text-sm text-stone-500">難波/心齋橋區域</div>
        </li>
        <li className="relative pl-4 border-l-2 border-stone-300">
          <span className="text-xs font-bold text-stone-400 block mb-1">Day 4-8 (5 nights)</span>
          <div className="font-bold text-lg text-stone-800">京都 (Kyoto)</div>
          <div className="text-sm text-stone-500">京都車站周邊</div>
        </li>
        <li className="relative pl-4 border-l-2 border-amber-400">
          <span className="text-xs font-bold text-amber-500 block mb-1">Day 9 (1 night)</span>
          <div className="font-bold text-lg text-stone-800 flex items-center gap-2">
             神戶 Peanuts Hotel <Star size={14} className="text-amber-500 fill-current"/>
          </div>
          <div className="text-sm text-stone-500">全館史努比主題，含特色早餐</div>
        </li>
      </ul>
    </InfoCard>

    <div className="p-4 text-center text-stone-400 text-sm">
      <p>祝您有一趟愉快的旅程！</p>
      <div className="flex justify-center mt-2 opacity-50">
        <SnoopyFace mood="love" />
      </div>
    </div>
  </div>
);

// 主程式
const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [openDay, setOpenDay] = useState(1); // Default open day 1

  // 滾動到頂部當切換 tab
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans pb-24 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* 頂部導航 / 標題 */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-stone-900">KANSAI TRIP</h1>
          <p className="text-xs text-stone-500 tracking-wider font-medium">OSAKA • KYOTO • KOBE</p>
        </div>
        <div className="bg-amber-400 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
          S
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="p-4">
        
        {/* 行程 Tab */}
        {activeTab === 'itinerary' && (
          <div className="animate-fadeIn">
            {/* 總覽小卡 */}
            <div className="bg-stone-800 text-stone-50 rounded-xl p-4 mb-6 shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Total Trip</div>
                <div className="text-2xl font-bold mb-1">10 Days 9 Nights</div>
                <div className="text-sm text-stone-300 flex gap-2 items-center">
                   <span>獨旅</span> <span className="w-1 h-1 bg-stone-500 rounded-full"></span> <span>好友會合</span>
                </div>
              </div>
              {/* 裝飾圓圈 */}
              <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-stone-700 rounded-full opacity-50"></div>
            </div>

            {/* 每日卡片 */}
            <div className="space-y-2">
              {itineraryData.map((data) => (
                <DayCard 
                  key={data.day} 
                  data={data} 
                  isOpen={openDay === data.day}
                  toggle={() => setOpenDay(openDay === data.day ? null : data.day)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 住宿與航班 Tab */}
        {activeTab === 'info' && <InfoTab />}
        
      </main>

      {/* 底部導航欄 (Dock) */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-lg border border-stone-200 rounded-full shadow-lg p-1.5 flex justify-between items-center z-40">
        
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-full transition-all ${activeTab === 'itinerary' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:bg-stone-100'}`}
        >
          <MapPin size={20} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-0.5">行程</span>
        </button>

        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-full transition-all ${activeTab === 'info' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:bg-stone-100'}`}
        >
          <Info size={20} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-0.5">資訊</span>
        </button>

      </nav>

    </div>
  );
};

export default App;
