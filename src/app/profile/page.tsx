"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-2 text-white transition-colors"
              >
                <FaEdit size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {session.user?.name || "User"}
              </h1>
              <p className="text-gray-300 text-lg mb-4">
                Thành viên RoPhim
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendarAlt className="text-red-600" />
                  <span>Tham gia: {new Date().toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="bg-red-600/20 hover:bg-red-600/30 border border-red-600 text-red-400 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300"
            >
              <FaSignOutAlt />
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaUser className="text-red-600" />
              Thông tin tài khoản
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <FaEnvelope className="text-red-600" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{session.user?.email || "Chưa cập nhật"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <FaPhone className="text-red-600" />
                <div>
                  <p className="text-gray-400 text-sm">Số điện thoại</p>
                  <p className="text-white">{(session.user as any)?.phone || "Chưa cập nhật"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <FaUser className="text-red-600" />
                <div>
                  <p className="text-gray-400 text-sm">Tên hiển thị</p>
                  <p className="text-white">{session.user?.name || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-6">Thống kê</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-4 rounded-xl border border-red-600/30">
                <p className="text-red-400 text-sm">Phim đã xem</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-4 rounded-xl border border-blue-600/30">
                <p className="text-blue-400 text-sm">Yêu thích</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-4 rounded-xl border border-green-600/30">
                <p className="text-green-400 text-sm">Đánh giá</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 rounded-xl border border-purple-600/30">
                <p className="text-purple-400 text-sm">Điểm tích lũy</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watch History */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Lịch sử xem gần đây</h2>
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">🎬</div>
            <p className="text-gray-400">Bạn chưa xem phim nào</p>
            <p className="text-gray-500 text-sm mt-2">Khám phá và xem phim để xây dựng lịch sử của bạn</p>
          </div>
        </div>
      </div>
    </div>
  );
}