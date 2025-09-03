"use client";

import { DataImage } from "@/components/data-table-v2/DataImage";
import { DataTable } from "@/components/data-table-v2/DataTable";
import {
  DataTableAction,
  DataTableColumn,
} from "@/components/data-table-v2/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateInvite } from "@/hooks/useInvite";
import { useUsersData } from "@/hooks/useUsers";
import { User } from "@/types/auth2";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, UserIcon, View } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function UsersTableListing({ userId }: { userId?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    isVerified: "",
  });

  const createInvite = useCreateInvite();

  // Initialize search query state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { users, refetch, totalPages, totalCount, isLoading, error } =
    useUsersData({
      page: currentPage,
      limit: 10,
      search: searchQuery,
    });

  // Define columns for users
  const columns: DataTableColumn<User>[] = [
    {
      id: "user",
      header: "User",
      cell: (_, row) => (
        <div className="flex items-center gap-3 ">
          <DataImage
            className="w-12 h-12 flex-shrink-0"
            src={row.image ?? ""}
          />
          <div className="">
            <div className="font-medium text-gray-900 truncate">{row.name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <span className="truncate">{row.email}</span>
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{row.role}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    // {
    //   id: "status",
    //   header: "Status",
    //   cell: (_, row) => (
    //     <div className="flex items-center gap-2 min-w-0">
    //       <div
    //         className={`h-2 w-2 rounded-full flex-shrink-0 ${
    //           row.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
    //         }`}
    //       />
    //       <div className="min-w-0">
    //         <div className="font-medium text-gray-900 truncate">
    //           {row.status}
    //         </div>
    //       </div>
    //     </div>
    //   ),
    //   sortable: true,
    // },
    {
      id: "phone",
      header: "Phone",
      cell: (_, row) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {row.phone || "Not provided"}
        </span>
      ),
      sortable: true,
    },
    {
      id: "verified",
      header: "Verified",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`h-2 w-2 rounded-full flex-shrink-0 ${
              row.isVerified ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {row.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Date Created",
      cell: (_, row) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
  ];

  // Define actions
  const actions: DataTableAction<User>[] = [
    {
      label: "View",
      icon: <View className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/dashboard/users/${row.id}`);
      },
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/dashboard/users/${row.id}?edit=true`);
      },
    },
  ];

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value === "all" ? "" : value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const FormSchema = z.object({
    email: z
      .string({
        required_error: "Please enter a valid email address.",
      })
      .email(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  function generateInviteCode(): string {
    const prefix = "inv-unmu-";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return prefix + code;
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const code = generateInviteCode();

      const invitedBy = userId as string;
      const email = data.email;
      const role = "ADMIN";

      const req = await createInvite.mutateAsync({
        code,
        email,
        role,
        invitedBy,
      });

      await refetch();

      setIsDialogOpen(false);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-full">
        <DataTable
          title={`UNMU Administrators(${totalCount})`}
          subtitle="Manage and invite system Administrators"
          columns={columns}
          data={users}
          actions={actions}
          searchPlaceholder="Search by user name or email..."
          showAddButton={true}
          addButtonLabel="Add New Admin"
          onAddClick={handleAddClick}
          showViewToggle={true}
          isLoading={isLoading}
          error={error as string}
          onRefresh={refetch}
          pageSize={10}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          enableSelection={true}
          showActions={true}
          // Custom filter handling
          filterState={filters}
          onFilterChange={handleFilterChange}
          // Custom search handling
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Admin</DialogTitle>
              <DialogDescription>
                Do you want to proceed with the admin registration?
              </DialogDescription>
            </DialogHeader>

            <DialogContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">User Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="kiskayemosese@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the email we will send the invite to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Assign ROLE</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full space-y-6">
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="MEMBER">MEMBER</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <DialogFooter>
                    <Button
                      disabled={loading}
                      type="button"
                      variant="secondary"
                      onClick={() => handleDialogClose()}
                    >
                      Cancel
                    </Button>
                    <Button disabled={loading}>
                      {loading ? (
                        <span className="flex gap-2 items-center">
                          <Loader2 className="animate-spin" /> Creating...
                        </span>
                      ) : (
                        <>Continue</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
