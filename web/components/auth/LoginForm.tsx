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
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useAuthStore } from "@/store/auth";

import { createLoginLog, loginUser } from "@/actions/auth";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { User } from "@/types/auth2";
import MainLogo from "../home/main-logo";

interface CarouselImage {
  url: string;
  alt: string;
}

type LoginMethod = "email" | "phone";

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "This field is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.input<typeof loginSchema>;

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

// Helper function to detect login method based on input
const detectLoginMethod = (identifier: string): LoginMethod => {
  return identifier.includes("@") ? "email" : "phone";
};

// Helper function to validate identifier
const validateIdentifier = (identifier: string): string | undefined => {
  const loginMethod = detectLoginMethod(identifier);

  if (loginMethod === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier)
      ? undefined
      : "Please enter a valid email address";
  } else {
    // Basic phone validation - you can customize this based on your requirements
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(identifier) &&
      identifier.replace(/\D/g, "").length >= 10
      ? undefined
      : "Please enter a valid phone number";
  }
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detectedLoginMethod, setDetectedLoginMethod] =
    useState<LoginMethod>("email");
  const router = useRouter();
  const { deviceInfo } = useDeviceInfo();
  const { setUser, setTokens } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Watch the identifier field to detect login method
  const identifierValue = form.watch("identifier");

  useEffect(() => {
    if (identifierValue) {
      const method = detectLoginMethod(identifierValue);
      setDetectedLoginMethod(method);
    }
  }, [identifierValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      console.log("Starting login process...");

      // Validate the identifier
      const validationError = validateIdentifier(data.identifier);
      if (validationError) {
        toast.error("Validation Error", {
          description: validationError,
        });
        setIsLoading(false);
        return;
      }

      // Determine login method and prepare credentials
      const loginMethod = detectLoginMethod(data.identifier);
      const credentials = {
        loginMethod,
        identifier: data.identifier,
        password: data.password,
      };

      console.log("Login credentials:", credentials);

      // Call your login function
      const result = await loginUser(credentials);

      if (!result.success || !result.data) {
        toast.error("Login Failed", {
          description: result.error || "Please check your credentials",
        });
        return;
      }

      try {
        setUser(result.data.user);
        setTokens(result.data.accessToken, result.data.refreshToken);

        console.log("Zustand stores updated successfully");
      } catch (storeError) {
        console.error("Error updating Zustand stores:", storeError);
      }

      try {
        await createLoginLog(result.data.user.id, result.data.user.name, {
          device: deviceInfo.userAgent || "Unknown Device",
          ipAddress: deviceInfo.platform || "Unknown IP",
        });
      } catch (logError) {
        console.error("Error creating login log:", logError);
      }

      toast.success("Login Successful", {
        description: `Welcome back, ${result.data.user.name}!`,
      });

      handleUserRedirect(result.data.user);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleUserRedirect(user: User) {
    router.push("/dashboard");
  }

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleRegisterClick = () => {
    router.push("/auth/register");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
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

        <div className="w-full max-w-sm sm:max-w-md pt-2 lg:pt-[0%]">
          {/* Logo and Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-4 justify-center sm:justify-start">
              <MainLogo
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                showText={true}
                text="Logo"
                variant="default"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 text-center sm:text-left">
              Welcome to <span className="text-red-600">My Brand</span>
            </h1>
            <p className="text-gray-600 text-sm text-center sm:text-left">
              Brand description tagline here
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-3 sm:space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                {/* Email or Phone Input */}
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => {
                    const IconComponent =
                      detectedLoginMethod === "email" ? Mail : Phone;

                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <span>Email or Phone Number</span>
                          {identifierValue && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {detectedLoginMethod === "email"
                                ? "Email detected"
                                : "Phone detected"}
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Enter your email or phone number"
                              className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors duration-200 text-sm pr-12"
                              {...field}
                            />
                            <IconComponent className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs sm:text-sm" />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Password
                        </FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="text-red-600 hover:text-red-500 p-0 h-auto font-normal text-xs sm:text-sm justify-start sm:justify-center ml-0"
                          onClick={handleForgotPassword}
                        >
                          Forgot Password?
                        </Button>
                      </div>

                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
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

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-sm shadow-lg transition-all duration-200 text-sm sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span className="sm:hidden">Sign In</span>
                      <span className="hidden sm:inline">
                        Sign In to Account
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                New to MyBrand ?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-red-600 hover:text-red-500 p-0 h-auto font-semibold text-sm"
                  onClick={handleRegisterClick}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Register here
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
          Empowering
          <br />
          Healthcare Heroes
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

      {/* Mobile Background -  themed */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-yellow-50 to-red-100"></div>
      </div>
    </div>
  );
}
