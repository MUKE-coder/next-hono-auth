import { ArrowRight, Database, Users, Shield, Heart } from "lucide-react";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import SmallTitle from "./small-title";
import { Button } from "../ui/button";
import { RainbowButton } from "../magicui/rainbow-button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-red-50/30 md:pt-[8%] pt-[30%] mb-9">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-90"
          )}
        />
      </div>

      {/* Decorative Side Text - Healthcare themed */}
      <div className="absolute md:-left-[12%] left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center hidden lg:block">
        <span className="text-[6rem] font-bold text-transparent bg-gradient-to-r from-red-600/20 to-red-600/5 bg-clip-text stroke-red-600/10 select-none">
          HEALTHCARE
        </span>
      </div>

      <div className="absolute md:-right-[12%] right-0 top-1/2 -translate-y-1/2 rotate-90 origin-center hidden lg:block">
        <span className="text-[6rem] font-bold text-transparent bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 bg-clip-text stroke-yellow-500/10 select-none">
          EXCELLENCE
        </span>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10">
        <SmallTitle title="Welcome to UNMU Database System" />

        <div className="relative">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-4xl lg:text-5xl max-w-5xl mx-auto bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent md:leading-snug">
            Complete Healthcare Workforce
            <br />
            <span className="text-red-600">Management System</span>
          </h1>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-yellow-500/10 blur-3xl -z-10" />
        </div>

        <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-base leading-relaxed">
          Empowering Uganda's healthcare heroes through comprehensive member
          management, professional development tracking, and data-driven
          insights for nurses and midwives.
        </p>

        <div className="flex md:gap-4 gap-1.5 justify-center items-center pt-4">
          <RainbowButton
            className="h-12 px-8 font-medium text-sm whitespace-nowrap bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            link="/auth/login"
          >
            Access Database
            <ArrowRight className="ml-2 h-4 w-4" />
          </RainbowButton>

          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-sm font-medium border-red-600/20 hover:border-red-600/40 hover:bg-red-600/5 transition-all duration-300"
          >
            View Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Feature highlights - Healthcare focused */}
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-6 gap-3 pt-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-red-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-sm">Member Management</h3>
            <p className="text-xs text-muted-foreground text-center">
              Complete nurse and midwife registry
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-yellow-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-sm">License Tracking</h3>
            <p className="text-xs text-muted-foreground text-center">
              Professional certification management
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-red-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Database className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-sm">Data Analytics</h3>
            <p className="text-xs text-muted-foreground text-center">
              Healthcare workforce insights
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-yellow-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Heart className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-sm">Professional Development</h3>
            <p className="text-xs text-muted-foreground text-center">
              Continuing education tracking
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-red-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="font-semibold text-sm">Hospital Networks</h3>
            <p className="text-xs text-muted-foreground text-center">
              Healthcare facility connections
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-yellow-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-sm">Compliance</h3>
            <p className="text-xs text-muted-foreground text-center">
              Regulatory compliance monitoring
            </p>
          </div>
        </div>

        {/* UNMU Mission Statement */}
        <div className="pt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-6 border border-red-100">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Our Mission
            </h3>
            <p className="text-sm text-gray-700 italic">
              "To Love and Serve" - Empowering Uganda's healthcare professionals
              through comprehensive data management and professional development
              support.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
