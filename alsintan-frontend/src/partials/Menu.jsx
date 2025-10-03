import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  PengajuanIcon,
  MasterData,
  SettingsIcon,
  JobIcon,
  EcommerceIcon,
  TaskIcon,
} from "./Icons";

function Menu({ pathname }) {
  const menus = [
    {
      section: "Pages",
      items: [
        {
          label: "Dashboard",
          path: "/",
          match: pathname === "/" || pathname.includes("dashboard"),
          Icon: DashboardIcon,
        },
        {
          label: "Pengajuan Alsintan",
          path: "/pengajuan",
          match: pathname.includes("pengajuan"),
          Icon: PengajuanIcon,
        },
        {
          label: "Rekomendasi SMART",
          path: "/rekomendasi-smart",
          match: pathname.includes("rekomendasi-smart"),
          Icon: EcommerceIcon,
        },
        {
          label: "Status Distribusi",
          path: "/status-distribusi",
          match: pathname.includes("status-distribusi"),
          Icon: TaskIcon,
        },
        {
          label: "Riwayat Penerimaan",
          path: "/riwayat-penerimaan",
          match: pathname.includes("riwayat-penerimaan"),
          Icon: JobIcon,
        },
      ],
    },
    {
      section: "Master Data",
      items: [
        {
          label: "Data Poktan",
          path: "/data-poktan",
          match: pathname.includes("data-poktan"),
          Icon: MasterData,
        },
        {
          label: "Data Kecamatan",
          path: "/data-kecamatan",
          match: pathname.includes("data-kecamatan"),
          Icon: MasterData,
        },
        {
          label: "Data Alsintan",
          path: "/data-alsintan",
          match: pathname.includes("data-alsintan"),
          Icon: MasterData,
        },
      ],
    },
    {
      section: "Pengaturan",
      items: [
        {
          label: "Pengaturan SMART",
          path: "/smart-settings",
          match: pathname.includes("smart-settings"),
          Icon: SettingsIcon,
        },
        {
          label: "Pengaturan User",
          path: "/user-settings",
          match: pathname.includes("user-settings"),
          Icon: SettingsIcon,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {menus.map((menu, i) => (
        <div key={i}>
          {/* Section Title */}
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
            <span
              className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
            >
              •••
            </span>
            <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
              {menu.section}
            </span>
          </h3>

          {/* Items */}
          <ul className="mt-3">
            {menu.items.map(({ label, path, match, Icon }) => (
              <li
                key={path}
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${
                  match &&
                  "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                }`}
              >
                <NavLink
                  end
                  to={path}
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    match ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon match={match} />
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      {label}
                    </span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Menu;
