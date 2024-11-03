"use client";
import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaTools,
  FaBuilding,
  FaRegFileAlt,
  FaCog,
  FaTruck,
  FaTimes,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "../svg/logo";

const Sidebar = ({ isOpen, onClose }) => {
  const [openDrawer, setOpenDrawer] = useState({});
  const pathname = usePathname();

  const toggleDrawer = (section) => {
    setOpenDrawer((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const links = [
    { name: "Dashboard", icon: <FaTachometerAlt />, href: "/admin" },
    { name: "Talk to Friend", icon: <FaUser />, href: "/admin/talk-to-friend" },
    {
      name: "Verification",
      icon: <FaCog />,
      subLinks: [
        { name: "Request", href: "/admin/verification/request" },
        { name: "Verified", href: "/admin/verification/verified" },
      ],
    },
    { name: "User", icon: <FaUser />, href: "/admin/user" },
    { name: "Mechanic", icon: <FaTools />, href: "/admin/mechanic" },
    { name: "Tow", icon: <FaTruck />, href: "/admin/tow" },
    {
      name: "Company",
      icon: <FaBuilding />,
      subLinks: [
        { name: "Request", href: "/admin/company/request" },
        { name: "Verified", href: "/admin/company/verified" },
      ],
    },
    {
      name: "Reports",
      icon: <FaRegFileAlt />,
      subLinks: [
        { name: "User", href: "/admin/reports/user" },
        { name: "Mechanic", href: "/admin/reports/mechanic" },
        { name: "Tow", href: "/admin/reports/tow" },
        { name: "All Premium", href: "/admin/reports/all-premium" },
      ],
    },
    {
      name: "Subscription",
      icon: <FaRegFileAlt />,
      subLinks: [
        { name: "Cancel", href: "/admin/subscription/cancel" },
        { name: "Not Renew", href: "/admin/subscription/not-renew" },
        { name: "Payment Fail", href: "/admin/subscription/payment-fail" },
      ],
    },
    { name: "Settings", icon: <FaCog />, href: "/admin/settings" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-black text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 lg:translate-x-0 z-50 overflow-y-auto`}
    >
      <div className="flex justify-evenly items-center pt-4 pl-4 pb-4 border-b border-gray-700">
        <div className="h-10 w-10">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold">DRIVERSE</h1>
        <button className="lg:hidden" onClick={onClose}>
          <FaTimes size={24} />
        </button>
      </div>

      <ul className="mt-4">
        {links.map((link, index) => (
          <div key={index}>
            <li
              className={`p-4 flex items-center justify-between hover:bg-gray-700 cursor-pointer ${
                pathname === link.href
                  ? "bg-[#ffffff] text-black rounded-l-xl ml-2 hover:bg-slate-200"
                  : ""
              }`}
              onClick={() => link.subLinks && toggleDrawer(link.name)}
            >
              {link.href ? (
                <Link href={link.href} className="flex items-center w-full">
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              ) : (
                <div
                  className="flex items-center w-full cursor-pointer"
                  onClick={() => toggleDrawer(link.name)}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </div>
              )}
              {link.subLinks &&
                (openDrawer[link.name] ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                ))}
            </li>
            {link.subLinks && openDrawer[link.name] && (
              <ul className="ml-8">
                {link.subLinks.map((subLink, subIndex) => (
                  <li
                    key={subIndex}
                    className={`p-2 hover:bg-gray-700 ${
                      pathname === subLink.href
                        ? "bg-[#ffffff] text-black rounded-l-xl ml-2 hover:bg-slate-200"
                        : ""
                    }`}
                  >
                    <Link href={subLink.href}>{subLink.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
