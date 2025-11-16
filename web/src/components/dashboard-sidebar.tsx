"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDevices } from "@/hooks/use-devices";
import { useAllAlerts } from "@/hooks/use-all-alerts";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { devices, isLoading } = useDevices();
  const { alerts, criticalCount, warningCount, totalCount } = useAllAlerts();

  const navItems = [
    {
      href: "/dashboard/overview",
      label: "Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/alerts",
      label: "Alerts",
      badge: totalCount,
      badgeVariant: criticalCount > 0 ? "destructive" : warningCount > 0 ? "secondary" : "outline",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-72" : "w-20"
      } border-r transition-all duration-500 flex flex-col backdrop-blur-xl`}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <div className="transition-all duration-300">
                <h2 className="text-lg font-bold">Safe Mine Pro</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="opacity-70 hover:opacity-100 transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="opacity-70 hover:opacity-100 mx-auto transition-all hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "scale-105 shadow-lg"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <div className={`transition-transform ${isActive ? "scale-110" : ""}`}>
                    {item.icon}
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge 
                          variant={item.badgeVariant as any || "secondary"} 
                          className="text-xs min-w-[1.5rem] h-5 flex items-center justify-center"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Devices Section */}
          {sidebarOpen && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3">
                  <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wider">
                    Devices
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {devices.length}
                  </Badge>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner className="size-6" />
                  </div>
                ) : devices.length === 0 ? (
                  <div className="px-3 py-4 text-sm opacity-70 text-center">
                    No devices found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {devices.map((deviceId, idx) => {
                      const isActive = pathname === `/dashboard/device/${deviceId}`;
                      return (
                        <Link
                          key={deviceId}
                          href={`/dashboard/device/${deviceId}`}
                          className={`block px-3 py-3 rounded-xl transition-all duration-300 border ${
                            isActive
                              ? "scale-105 shadow-lg"
                              : "opacity-80 hover:opacity-100 hover:scale-105"
                          }`}
                          style={{
                            animation: `fade-in-left 0.3s ease-out ${idx * 50}ms both`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-2 h-2 rounded-full ${
                                isActive ? "animate-ping absolute" : ""
                              }`}></div>
                              <div className="w-2 h-2 rounded-full relative"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {deviceId}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link href="/">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span>Back to Home</span>}
          </button>
        </Link>
      </div>
    </aside>
  );
}
