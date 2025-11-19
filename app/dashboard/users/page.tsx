"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UserManagementModal } from "@/components/user-management-modal";
import { mockUsers } from "@/lib/mock-data";
import { showToast } from "@/lib/toast";
import { Edit2, Trash2, Plus } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "athlete" | "coach" | "medic" | "nutritionist";
  subscription: "free" | "pro" | "premium";
}

export default function UsersPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setUsers(mockUsers as any);
      setPageLoading(false);
    }
  }, [isAuthenticated, loading]);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<User, "id">) => {
    if (selectedUser) {
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u))
      );
      showToast("User updated successfully", "success");
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...userData,
      };
      setUsers([...users, newUser]);
      showToast("User created successfully", "success");
    }
    setModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId));
      showToast("User deleted successfully", "success");
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("manage")}
            </h1>
            <p className="text-muted-foreground">
              Manage all users and their subscriptions
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            {t("addUser")}
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {t("name")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {t("email")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {t("role")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {t("premium")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-foreground">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.subscription === "premium"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-100"
                            : user.subscription === "pro"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100"
                            : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {user.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No users found</p>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("addUser")}
            </button>
          </div>
        )}
      </main>

      <Footer />

      <UserManagementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}
