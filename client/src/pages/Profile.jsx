import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { User, Mail, LogOut, ShoppingBag, Heart, Settings } from "lucide-react";
import { logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {user?.email}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg font-medium">
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  Orders
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={user?.firstName || ""}
                        readOnly
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user?.lastName || ""}
                      readOnly
                      className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Account Type
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                        {user?.role || "User"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Member Since
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex gap-4">
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Edit Profile
                  </button>
                  <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <ShoppingBag className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Orders
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <Heart className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wishlist Items
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <Settings className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Active
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Account Status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
