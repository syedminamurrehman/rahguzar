"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  X, 
  ChevronDown, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Search,
  Calendar,
  Shield,
  Gavel,
  FileText
} from 'lucide-react';
import { RiGovernmentLine } from "react-icons/ri";
import { FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import { CiCalendar, CiViewList } from 'react-icons/ci';

type NotificationVariant = 'warning' | 'info' | 'error' | 'success';
type NotificationPosition = 'top' | 'bottom' | 'inline';
type TabType = 'roads' | 'enforcement' | 'timeline';

interface BannedRoad {
  id: number;
  name: string;
  details: string;
  coordinates?: { lat: number; lng: number };
  severity?: 'high' | 'medium' | 'low';
}

interface NotificationBannerProps {
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  persistent?: boolean;
  variant?: NotificationVariant;
  expandable?: boolean;
  pulseEffect?: boolean;
  position?: NotificationPosition;
  highlightWords?: boolean;
  animated?: boolean;
  showLocationPin?: boolean;
  glassmorphism?: boolean;
  autoCloseDelay?: number;
  onRoadClick?: (road: BannedRoad) => void;
  showSearch?: boolean;
  showStats?: boolean;
}

const BANNED_ROADS: BannedRoad[] = [
  { 
    id: 1, 
    name: "Shahrah-e-Faisal", 
    details: "From Avari Light Signal to Madam Apartments",
    severity: 'high'
  },
  { 
    id: 2, 
    name: "I.I. Chundrigar Road", 
    details: "From Tower to Shaheen Complex",
    severity: 'high'
  },
  { 
    id: 3, 
    name: "Shahrah-e-Quaideen", 
    details: "From Numaish to Shahrah-e-Faisal Nursery",
    severity: 'medium'
  },
  { 
    id: 4, 
    name: "Sher Shah Suri Road", 
    details: "From Matric Board Office to Nagan Chowrangi",
    severity: 'medium'
  },
  { 
    id: 5, 
    name: "Shaheed-e-Millat Road", 
    details: "From Jail Chowrangi to Shaheed-e-Millat Expressway",
    severity: 'high'
  },
  { 
    id: 6, 
    name: "Abdullah Haroon Road", 
    details: "From Do Talwar to Hashoo Centre via Hoshang and Khayaban-e-Iqbal",
    severity: 'medium'
  },
  { 
    id: 7, 
    name: "Do Talwar to Shahrah-e-Firdous and Abdullah Shah Ghazi Mazar", 
    details: "Complete ban",
    severity: 'high'
  },
  { 
    id: 8, 
    name: "Stadium Road", 
    details: "From Millennium Mall to New Town Police Station",
    severity: 'medium'
  },
  { 
    id: 9, 
    name: "Sir Shah Suleman Road", 
    details: "From Sir Habib Ibrahim Rehmatullah Road to Hasan Square and Karsaz",
    severity: 'low'
  },
  { 
    id: 10, 
    name: "Rashid Minhas Road", 
    details: "From Drigh Road to Sohrab Goth",
    severity: 'medium'
  },
  { 
    id: 11, 
    name: "Mauripur Road", 
    details: "From Gulbai to ICI Bridge",
    severity: 'low'
  }
];

const ENFORCEMENT_DETAILS = {
  duration: "April 15 to un specified date, 2025",
  legalBasis: "Section 144 CrPC; violations subject to action under Section 188 PPC",
  enforcement: "All Station House Officers (SHOs) have been directed to ensure strict compliance with the ban",
  imposedBy: "Sindh ministry of transport and mass transit and Commissioner Karachi",
  contact: "Traffic Police Helpline: 1915",
};

const TIMELINE_EVENTS = [
  { date: "April 15, 2025", event: "Ban goes into effect", status: "active" as const },
  { date: "May 15, 2025", event: "Mid-term review of ban implementation", status: "upcoming" as const },
  { date: "June 14, 2025", event: "Ban scheduled to end (subject to review)", status: "upcoming" as const },
  { date: "June 15, 2025", event: "Ban likely to be imposed permanently", status: "upcoming" as const },
];

function NotificationBanner({
  className = '',
  onClose,
  showCloseButton = true,
  persistent = true,
  variant = 'warning',
  expandable = true,
  pulseEffect = true,
  position = 'inline',
  highlightWords = false,
  animated = true,
  showLocationPin = true,
  glassmorphism = true,
  autoCloseDelay = 10000,
  onRoadClick,
  showSearch = true,
  showStats = true,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('roads');
  const [expandedRoads, setExpandedRoads] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoads, setFilteredRoads] = useState<BannedRoad[]>(BANNED_ROADS);
  const [isDragging, setIsDragging] = useState(false);
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-100, 0], [0, 1]);

  // Enhanced variant styles with better color schemes
  const variantStyles = {
    warning: {
      bg: glassmorphism ? 'bg-amber-50/95 backdrop-blur-md' : 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-l-4 border-amber-500',
      text: 'text-amber-900',
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      pulse: 'bg-amber-400',
      accent: 'bg-amber-500',
      highlight: 'bg-amber-200 text-amber-900 px-1 rounded font-semibold',
      shadow: 'shadow-lg shadow-amber-200/50',
      button: 'bg-amber-500 hover:bg-amber-600 text-white',
      gradient: 'from-amber-500 to-amber-600'
    },
    info: {
      bg: glassmorphism ? 'bg-blue-50/95 backdrop-blur-md' : 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-900',
      icon: <Info className="h-6 w-6 text-blue-600" />,
      pulse: 'bg-blue-400',
      accent: 'bg-blue-500',
      highlight: 'bg-blue-200 text-blue-900 px-1 rounded font-semibold',
      shadow: 'shadow-lg shadow-blue-200/50',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
      gradient: 'from-blue-500 to-blue-600'
    },
    error: {
      bg: glassmorphism ? 'bg-red-50/95 backdrop-blur-md' : 'bg-gradient-to-br from-red-50 to-red-100',
      border: 'border-l-4 border-red-500',
      text: 'text-red-900',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      pulse: 'bg-red-400',
      accent: 'bg-red-500',
      highlight: 'bg-red-200 text-red-900 px-1 rounded font-semibold',
      shadow: 'shadow-lg shadow-red-200/50',
      button: 'bg-red-500 hover:bg-red-600 text-white',
      gradient: 'from-red-500 to-red-600'
    },
    success: {
      bg: glassmorphism ? 'bg-emerald-50/95 backdrop-blur-md' : 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      border: 'border-l-4 border-emerald-500',
      text: 'text-emerald-900',
      icon: <Info className="h-6 w-6 text-emerald-600" />,
      pulse: 'bg-emerald-400',
      accent: 'bg-emerald-500',
      highlight: 'bg-emerald-200 text-emerald-900 px-1 rounded font-semibold',
      shadow: 'shadow-lg shadow-emerald-200/50',
      button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      gradient: 'from-emerald-500 to-emerald-600'
    }
  };

  const positionStyles = {
    top: 'fixed top-0 left-0 right-0 z-50 mx-4 mt-4 md:mx-auto md:max-w-4xl',
    bottom: 'fixed bottom-0 left-0 right-0 z-50 mx-4 mb-4 md:mx-auto md:max-w-4xl',
    inline: 'max-w-4xl mx-auto'
  };

  // Memoized filtered roads calculation
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRoads(BANNED_ROADS);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = BANNED_ROADS.filter(
        road => road.name.toLowerCase().includes(query) || 
                road.details.toLowerCase().includes(query)
      );
      setFilteredRoads(filtered);
    }
  }, [searchQuery]);

  // Auto-close functionality
  useEffect(() => {
    if (!persistent && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [persistent, isVisible, autoCloseDelay]);

  // Click outside handler
  useEffect(() => {
    if (!expandable || !isExpanded) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, expandable]);

  // Animation sequence
  useEffect(() => {
    if (animated && isVisible) {
      const sequence = async () => {
        await controls.start({
          x: [-2, 2, -2, 2, 0],
          transition: { duration: 0.5 }
        });
      };
      sequence();
    }
  }, [controls, animated, isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const toggleRoadExpand = useCallback((id: number) => {
    setExpandedRoads(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleRoadClick = useCallback((road: BannedRoad) => {
    onRoadClick?.(road);
  }, [onRoadClick]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragX.get() < -80) {
      handleClose();
    } else {
      dragX.set(0);
    }
  };

  const focusSearchInput = () => {
    searchInputRef.current?.focus();
  };

  const style = variantStyles[variant];
  const posStyle = positionStyles[position];

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: position === 'bottom' ? 50 : position === 'top' ? -50 : 0,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: position === 'bottom' ? 20 : -20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeOut" },
    }
  };

  const expandVariants = {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: {
          duration: 0.4,
          ease: [0.04, 0.62, 0.23, 0.98]
        },
        opacity: {
          duration: 0.3,
          delay: 0.1
        },
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const getHighlightedText = (text: string) => {
    if (!highlightWords) {
      return text;
    }
    const wordsToHighlight = ["banned", "restricted", "prohibited", "closure"];
    const regex = new RegExp(`\\b(${wordsToHighlight.join('|')})\\b`, 'gi');
    return text.split(regex).map((part, index) => {
      if (wordsToHighlight.some(word => part.toLowerCase() === word.toLowerCase())) {
        return <span key={index} className={style.highlight}>{part}</span>;
      }
      return part;
    });
  };

  const getSeverityColor = (severity: BannedRoad['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: BannedRoad['severity']) => {
    switch (severity) {
      case 'high': return <FaExclamationTriangle className="h-3 w-3" />;
      case 'medium': return <AlertTriangle className="h-3 w-3" />;
      case 'low': return <Info className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  // Statistics calculation
  const stats = {
    total: BANNED_ROADS.length,
    highSeverity: BANNED_ROADS.filter(road => road.severity === 'high').length,
    mediumSeverity: BANNED_ROADS.filter(road => road.severity === 'medium').length,
    lowSeverity: BANNED_ROADS.filter(road => road.severity === 'low').length,
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={bannerRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ x, opacity }}
        drag={showCloseButton && !isExpanded ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragDirectionLock
        onDrag={(_, info) => {
          if (info.offset.x < 0) {
            dragX.set(info.offset.x);
          }
        }}
        className={`${style.bg} ${style.border} ${style.text} rounded-2xl ${style.shadow} relative overflow-hidden ${posStyle} ${className} focus:outline-none focus:ring-3 focus:ring-black/20 transition-all duration-200`}
        role="alert"
        aria-live="polite"
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        {/* Background Effects */}
        {pulseEffect && (
          <motion.div 
            className={`absolute -top-16 -right-16 rounded-full w-40 h-40 ${style.pulse} opacity-30`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
        
        {showLocationPin && (
          <motion.div 
            className="absolute top-3 left-3 opacity-10"
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <MapPin className="h-24 w-24" style={{ color: style.accent }} />
          </motion.div>
        )}
        
        {glassmorphism && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10" />
        )}

        {/* Main Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start flex-1 min-w-0">
              <motion.div 
                className="mr-4 flex-shrink-0 mt-1"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                {style.icon}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold leading-tight pr-2">
                  {getHighlightedText("Three-Wheeler Ban: 11 Major Roads Restricted in Karachi")}
                </h3>
                
                {showStats && isExpanded && (
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-center text-xs bg-white/80 px-2 py-1 rounded-full border"
                    >
                      <span className="font-semibold mr-1">Total:</span>
                      <span>{stats.total} roads</span>
                    </motion.div>
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-center text-xs bg-red-100/80 px-2 py-1 rounded-full border border-red-200"
                    >
                      <FaExclamationTriangle className="h-3 w-3 mr-1 text-red-600" />
                      <span>High: {stats.highSeverity}</span>
                    </motion.div>
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-center text-xs bg-yellow-100/80 px-2 py-1 rounded-full border border-yellow-200"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1 text-yellow-600" />
                      <span>Medium: {stats.mediumSeverity}</span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {expandable && (
                <motion.button 
                  onClick={toggleExpand} 
                  className={`p-2 rounded-xl hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all`}
                  whileHover={{ scale: 1.05, rotate: isExpanded ? 180 : 0 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
              )}
              
              {showCloseButton && (
                <motion.button 
                  onClick={handleClose}
                  className={`p-2 rounded-xl hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all`}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close notification"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Expandable Content */}
          {expandable && (
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              className="overflow-hidden"
            >
              <div 
                className="border-t mx-6"
                style={{ borderColor: `color-mix(in srgb, ${style.accent} 20%, transparent)` }}
              >
                <motion.div 
                  className="pt-4"
                  variants={itemVariants}
                >
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 mb-6 bg-black/5 rounded-xl p-1">
                    {[
                      { key: 'roads' as TabType, label: 'Banned Roads', icon: CiViewList },
                      { key: 'enforcement' as TabType, label: 'Enforcement', icon: Shield },
                      { key: 'timeline' as TabType, label: 'Timeline', icon: Calendar },
                    ].map((tab) => (
                      <motion.button
                        key={tab.key}
                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all flex-1 justify-center ${
                          activeTab === tab.key 
                            ? `${style.button} text-white shadow-sm` 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                        onClick={() => setActiveTab(tab.key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Show ${tab.label.toLowerCase()}`}
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[300px]"
                    >
                      {/* Banned Roads Tab */}
                      {activeTab === 'roads' && (
                        <div className="space-y-4">
                          {showSearch && (
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search roads by name or location..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-10 py-3 bg-white/80 rounded-xl border border-gray-200 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all"
                                aria-label="Search banned roads"
                              />
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery('')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                  aria-label="Clear search"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}

                          <div className="max-h-80 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {filteredRoads.length > 0 ? (
                              filteredRoads.map((road) => (
                                <motion.div 
                                  key={road.id}
                                  className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200/50 hover:shadow-md transition-all cursor-pointer"
                                  whileHover={{ x: 2, scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  variants={itemVariants}
                                  layout
                                  onClick={() => handleRoadClick(road)}
                                >
                                  <div 
                                    className="flex justify-between items-start gap-3"
                                    tabIndex={0}
                                    aria-expanded={!!expandedRoads[road.id]}
                                    aria-label={`Road ${road.name}, ${road.details}. Click to ${expandedRoads[road.id] ? 'collapse' : 'expand'} details`}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleRoadExpand(road.id);
                                      }
                                    }}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">
                                          {road.id}. {road.name}
                                        </span>
                                        {road.severity && (
                                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(road.severity)}`}>
                                            {getSeverityIcon(road.severity)}
                                            {road.severity}
                                          </span>
                                        )}
                                      </div>
                                      <AnimatePresence>
                                        {expandedRoads[road.id] && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-700 leading-relaxed">
                                              {road.details}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRoadExpand(road.id);
                                      }}
                                      animate={{ rotate: expandedRoads[road.id] ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors"
                                      aria-label={expandedRoads[road.id] ? "Collapse details" : "Expand details"}
                                    >
                                      <ChevronDown className="h-4 w-4 text-gray-500" />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <motion.div 
                                className="text-center py-8 text-gray-500"
                                variants={itemVariants}
                              >
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No roads found matching &quot;{searchQuery}&quot;</p>
                                <button 
                                  onClick={() => setSearchQuery('')}
                                  className="text-sm underline hover:no-underline mt-2 focus:outline-none focus:ring-2 focus:ring-black/20 rounded"
                                >
                                  Clear search
                                </button>
                              </motion.div>
                            )}
                          </div>

                          {showStats && (
                            <motion.div 
                              className="text-center text-sm text-gray-600 pt-2"
                              variants={itemVariants}
                            >
                              Showing {filteredRoads.length} of {BANNED_ROADS.length} banned roads
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Enforcement Tab */}
                      {activeTab === 'enforcement' && (
                        <div className="space-y-4">
                          <motion.div 
                            className="bg-white/80 backdrop-blur-sm p-5 rounded-xl space-y-4"
                            variants={itemVariants}
                          >
                            {[
                              {
                                icon: Calendar,
                                title: "Duration",
                                content: ENFORCEMENT_DETAILS.duration,
                              },
                              {
                                icon: Gavel,
                                title: "Legal Basis",
                                content: ENFORCEMENT_DETAILS.legalBasis,
                              },
                              {
                                icon: Shield,
                                title: "Enforcement",
                                content: ENFORCEMENT_DETAILS.enforcement,
                              },
                              {
                                icon: RiGovernmentLine,
                                title: "Imposed By",
                                content: ENFORCEMENT_DETAILS.imposedBy,
                              },
                              {
                                icon: FileText,
                                title: "Contact",
                                content: ENFORCEMENT_DETAILS.contact,
                              },
                            ].map((item, index) => (
                              <motion.div 
                                key={item.title}
                                className="flex items-start gap-3"
                                variants={itemVariants}
                                custom={index}
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center mt-1">
                                  <item.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {item.content}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>

                          <motion.div 
                            className={`bg-gradient-to-r ${style.gradient} text-white p-4 rounded-xl flex items-start gap-3`}
                            variants={itemVariants}
                          >
                            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">
                                Legal Notice
                              </p>
                              <p className="text-sm opacity-90 mt-1">
                                Violations are subject to legal action under Section 188 of the Pakistan Penal Code. 
                                Fines and penalties may apply.
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {/* Timeline Tab */}
                      {activeTab === 'timeline' && (
                        <div className="space-y-4">
                          <div className="relative">
                            <div 
                              className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b opacity-30"
                              style={{ 
                                background: `linear-gradient(to bottom, ${style.accent} 0%, transparent 100%)` 
                              }}
                            />
                            <div className="space-y-6">
                              {TIMELINE_EVENTS.map((event, index) => (
                                <motion.div 
                                  key={event.date}
                                  className="flex items-start gap-4"
                                  variants={itemVariants}
                                  custom={index}
                                >
                                  <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                      event.status === 'active' 
                                        ? 'ring-2 ring-offset-2 ring-offset-white' 
                                        : 'opacity-60'
                                    }`}
                                    style={{ 
                                      backgroundColor: style.accent,
                                      ...(event.status === 'active' && {
                                        ringColor: style.accent
                                      })
                                    }}
                                  >
                                    <Calendar className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0 pb-6">
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {event.date}
                                    </p>
                                    <p className="text-gray-700 text-sm mt-1">
                                      {event.event}
                                    </p>
                                    {event.status === 'active' && (
                                      <span 
                                        className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white mt-2"
                                        style={{ backgroundColor: style.accent }}
                                      >
                                        Current
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <motion.div 
                            className="bg-white/80 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3 text-sm"
                            variants={itemVariants}
                          >
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="text-gray-600">
                              Timeline subject to change based on government review and public feedback
                            </span>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Footer */}
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Last updated: October 7, 2025 at 05:10 PM</span>
                    </div>
                    
                    <motion.a
                      href="https://arynews.tv/karachi-enforces-rickshaw-ban-on-11-busy-roads/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-black/20 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="Read official news article (opens in new tab)"
                    >
                      <span className="border-b border-transparent group-hover:border-gray-900 transition-colors">
                        Official News Source
                      </span>
                      <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Swipe Indicator */}
          {showCloseButton && !isExpanded && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: dragX.get() < 0 ? Math.min(Math.abs(dragX.get()) / 100, 1) : 0 }}
            >
              <motion.div 
                className="h-full rounded-full"
                style={{ 
                  width: `${Math.min(Math.abs(dragX.get()) / 100 * 100, 100)}%`,
                  backgroundColor: style.accent
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

export default NotificationBanner;
