"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  Eye,
  EyeOff,
  GraduationCap,
  Heart,
  Lock,
  Mail,
  Phone,
  Plus,
  Stethoscope,
  User,
  UserCheck,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { ImageUpload } from "@/components/FormInputs/ImageUpload";
import { createMemberWithProfile } from "@/actions/registration";
import MainLogo from "../home/main-logo";

interface CarouselImage {
  url: string;
  alt: string;
}

const registerSchema = z
  .object({
    surname: z
      .string()
      .min(2, { message: "Surname must be at least 2 characters" }),
    otherNames: z
      .string()
      .min(2, { message: "Other names must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().regex(/^(\+256|0)[7-9]\d{8}$/, {
      message: "Please enter a valid Ugandan phone number",
    }),
    image: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Updated carousel images for healthcare/nursing theme
const carouselImages: CarouselImage[] = [
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751458501/concentrated-schoolgirl-with-green-pencil_1098-3802_wxn9qq.avif",
    alt: "Healthcare professional studying",
  },
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751458526/diverse-elementary-schoolchildren-sitting-desks-raising-hand_hhqwis.avif",
    alt: "Nursing students in training",
  },
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751461842/beige-simple-happy-birthday-photo-collage-11_1308217-677_w3xkeq.avif",
    alt: "Healthcare team celebration",
  },
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751458540/smiling-student-leaning-stacked-books_1098-3789_uirnzl.avif",
    alt: "Nursing student with medical textbooks",
  },
];

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      surname: "",
      otherNames: "",
      email: "",
      phone: "",
      image: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function onSubmit(data: RegisterFormValues) {
    try {
      setIsLoading(true);
      console.log("Starting registration process...", data);

      if (!data.image) {
        toast.error("Image Required", {
          description: "Please upload your passport photo",
        });
        setIsLoading(false);
        return;
      }

      // Server action to create member with profile
      const result = await createMemberWithProfile({
        surname: data.surname,
        otherNames: data.otherNames,
        email: data.email,
        phone: data.phone,
        image: data.image || null,
        password: data.password,
      });

      if (!result.success || !result.data) {
        toast.error("Registration Failed", {
          description: result.error || "Please check your information",
        });
        return;
      }

      toast.success("Registration Successful!", {
        description: `Welcome to MyBrand! Your tracking number is ${result.data?.trackingNumber}`,
        duration: 5000,
      });

      // Redirect to login or dashboard
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Register Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Healthcare-themed Decorative Elements */}
        <div className="hidden sm:block">
          <div className="absolute top-20 left-20 text-red-400 animate-pulse">
            <Heart
              className="h-6 w-6 animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
          </div>
          <div className="absolute top-32 right-24 text-red-400 animate-pulse">
            <Stethoscope
              className="h-8 w-8 animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
            />
          </div>
          <div className="absolute bottom-40 left-16 text-yellow-400 animate-pulse">
            <Activity
              className="h-7 w-7 animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "3.5s" }}
            />
          </div>
          <div className="absolute bottom-24 right-20 text-yellow-400 animate-pulse">
            <Plus
              className="h-6 w-6 animate-bounce"
              style={{ animationDelay: "1.5s", animationDuration: "2s" }}
            />
          </div>
          <div className="absolute top-1/2 left-12 text-red-400 animate-pulse">
            <GraduationCap
              className="h-5 w-5 animate-bounce"
              style={{ animationDelay: "2s", animationDuration: "4s" }}
            />
          </div>
        </div>

        <div className="w-full max-w-lg pt-2 lg:pt-[0%] max-h-screen overflow-y-auto">
          {/* Logo and Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-4 justify-center sm:justify-start">
              <MainLogo
                src="/logo.png"
                alt="My Brand here"
                width={50}
                height={50}
                showText={true}
                text="Logo"
                variant="default"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 text-center sm:text-left">
              Join <span className="text-red-600">My Brand</span> Today
            </h1>
            <p className="text-gray-600 text-sm text-center sm:text-left">
              Create your Brand account
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-3 sm:space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                {/* Passport Photo Upload */}
                <div className="flex justify-center mb-4">
                  <div className="text-center">
                    <ImageUpload
                      value={form.watch("image") || ""}
                      onChange={(value) => form.setValue("image", value)}
                      label="Passport Photo"
                      endpoint="profileImage"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload your passport-size photo *
                    </p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Surname
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Enter surname"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors duration-200 text-sm pr-12"
                              {...field}
                            />
                            <User className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherNames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Other Names
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Enter other names"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors duration-200 text-sm pr-12"
                              {...field}
                            />
                            <User className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors duration-200 text-sm pr-12"
                              {...field}
                            />
                            <Mail className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="tel"
                              placeholder="0700123456"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors duration-200 text-sm pr-12"
                              {...field}
                            />
                            <Phone className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg pr-16 sm:pr-20 transition-colors duration-200 text-sm"
                              {...field}
                            />
                            <Lock className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg pr-16 sm:pr-20 transition-colors duration-200 text-sm"
                              {...field}
                            />
                            <Lock className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-sm shadow-lg transition-all duration-200 text-sm sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <span className="sm:hidden">Register</span>
                      <span className="hidden sm:inline">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Create your Account
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-red-600 hover:text-red-500 p-0 h-auto font-semibold text-sm"
                  onClick={handleLoginClick}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign in here
                </Button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-xs">
              © 2025 Uganda Nurses and Midwives Union. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Carousel */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(1.1) contrast(1.05)",
                minHeight: "100%",
                minWidth: "100%",
              }}
            />
          </div>
        ))}

        {/* Updated gradient overlay with  colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-red-600/15 to-transparent"></div>

        <h2 className="text-4xl font-medium mb-4 drop-shadow-2xl text-start text-white max-w-lg absolute bottom-20 left-20">
          Join Our
          <br />
          Healthcare Family
          <br />
          <span className="text-yellow-300">To Love and Serve</span>
        </h2>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end justify-center p-8">
          <div className="text-start text-white max-w-lg">
            <div className="flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white shadow-lg"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background - themed */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-yellow-50 to-red-100"></div>
      </div>
    </div>
  );
}
