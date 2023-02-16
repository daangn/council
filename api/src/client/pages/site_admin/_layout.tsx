import { Link, Outlet, useLocation } from 'react-router-dom';

export default function SiteAdminLayout() {
  const location = useLocation();

  return (
    <div>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-gray-100 md:pt-5 md:pb-4">
        <ul className="menu">
          <li
            className={location.pathname === '/site_admin/orgs' ? 'bordered' : ''}
          >
            <Link
              to="/site_admin/orgs"
            >
              Organizations
            </Link>
          </li>
          <li
            className={location.pathname === '/site_admin/members' ? 'bordered' : ''}
          >
            <Link to="/site_admin/members">Members</Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col md:pl-64">
        <Outlet />
      </div>
    </div>
  )
}

