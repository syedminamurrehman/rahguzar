"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Modal from "./modal";
import { routes } from "../data/routes";

interface Route {
  type: string;
  fare?: number;
  number: string;
  details: string;
  stops: string[];
}

const iconMapping: Record<string, string> = {
  "brts": "/images/peoplebus.png",
  "people-bus": "/images/pbus.png",
  "local-bus": "/images/bus1.png",
  "chinchi": "/images/tuk.png",
  "EV-bus": "/images/ebus.png",
};

type RoutesProps = Record<string, never>;

const Routes: React.FC<RoutesProps> = () => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const routesPerPage = 20;

  const openModal = (route: Route) => {
    setSelectedRoute(route);
    setModalOpen(true);
  };

  const closeModalAction = () => {
    setSelectedRoute(null);
    setModalOpen(false);
  };

  // 🔍 Filtered Routes
  const filteredRoutes = useMemo(() => {
    return routes.filter(
      (route) =>
        route.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.stops.some((stop) =>
          stop.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm]);

  // 🔢 Sorted Routes
  const sortedRoutes = useMemo(() => {
    if (!sortBy) return filteredRoutes;
    return filteredRoutes.filter((route) => route.type === sortBy);
  }, [filteredRoutes, sortBy]);

  // 📄 Pagination logic
  const totalPages = Math.ceil(sortedRoutes.length / routesPerPage);
  const startIndex = (currentPage - 1) * routesPerPage;
  const currentRoutes = sortedRoutes.slice(
    startIndex,
    startIndex + routesPerPage
  );

  const handlePrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔍 Search */}
      <div className="relative mb-8">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by route number, details, or stops..."
          aria-label="Search routes"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset pagination
          }}
          className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 🔽 Sort Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {["brts", "people-bus", "local-bus", "chinchi", "EV-bus"].map((type) => (
          <motion.button
            key={type}
            onClick={() => {
              setSortBy(sortBy === type ? null : type);
              setCurrentPage(1);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
              sortBy === type
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.replace("-", " ").toUpperCase()}
          </motion.button>
        ))}
        <motion.button
          onClick={() => {
            setSortBy(null);
            setCurrentPage(1);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="px-4 py-2 rounded-full text-sm sm:text-base font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm"
        >
          CLEAR SORT
        </motion.button>
      </div>

      {/* 🚌 Routes Grid */}
      {currentRoutes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentRoutes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer border border-gray-200 p-6 rounded-xl transition-all bg-white"
                onClick={() => openModal(route)}
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={iconMapping[route.type]}
                    alt={route.type}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {route.number}
                    </h3>
                    <p className="text-gray-500">{route.details}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {route.stops.length} stops&nbsp;&bull;&nbsp;Fare: Rs{" "}
                  {route.fare}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 📜 Pagination Controls */}
          <div className="flex justify-center items-center mt-10 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-full font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-600">
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-full font-medium ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 py-12">No routes found.</div>
      )}

      {/* 🔳 Modal */}
      <Modal
        isOpen={isModalOpen}
        onCloseAction={closeModalAction}
        route={
          selectedRoute
            ? {
                ...selectedRoute,
                fare: selectedRoute.fare || 0,
              }
            : null
        }
      />
    </div>
  );
};

export default Routes;
