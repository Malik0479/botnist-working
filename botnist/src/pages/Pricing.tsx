import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers = [
    {
      name: "Professional",
      icon: "🟩",
      price: isAnnual ? 29 : 39,
      description: "Perfect for individuals and small projects",
      features: {
        "Website Limit": "1 Website",
        "Monthly Message Quota": "1000 Messages per Month",
        "Analytics": "Basic Analytics Dashboard",
        "Support": "Email Support",
        "Integration": "API Access",
        "Customization": "Chatbot Customization Options"
      },
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const
    },
    {
      name: "Organizational",
      icon: "🟨",
      price: isAnnual ? 99 : 129,
      description: "Ideal for growing teams and businesses",
      popular: true,
      features: {
        "Website Limit": "3 Websites",
        "Monthly Message Quota": "Unlimited Messages",
        "Analytics": "Advanced Analytics",
        "Support": "Priority Email Support",
        "Integration": "API Access",
        "Customization": "Chatbot Styling and Branding, Access Control for Team Members"
      },
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      icon: "🟥",
      price: "Custom",
      description: "Tailored solutions for large organizations",
      features: {
        "Website Limit": "5 Websites",
        "Monthly Message Quota": "Unlimited Messages",
        "Analytics": "Enterprise-grade Analytics",
        "Support": "24/7 Support",
        "Integration": "API & Webhook Integration, Dedicated Onboarding",
        "Customization": "Custom SLAs, Multi-user Access with Roles"
      },
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  const featureCategories = [
    "Website Limit",
    "Monthly Message Quota", 
    "Analytics",
    "Support",
    "Integration",
    "Customization"
  ];

  const renderFeatureValue = (feature: string, tier: typeof pricingTiers[0]) => {
    const value = tier.features[feature as keyof typeof tier.features];
    
    if (!value) {
      return <X className="w-4 h-4 text-red-500" />;
    }
    
    return (
      <span className="text-foreground">
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden bg-background" style={{
      backgroundImage: `
        linear-gradient(90deg, hsl(var(--wood-primary) / 0.1) 1px, transparent 1px),
        linear-gradient(hsl(var(--wood-primary) / 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px'
    }}>
      
      {/* Header Section */}
      <div className="container mx-auto px-6 py-16 text-center relative z-10">
        <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8">
          <span className="text-wood-accent">Predictable pricing</span>
          <br />
          <span className="text-foreground">that scales with you.</span>
        </h1>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-lg ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
              isAnnual ? 'bg-wood-accent' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-background rounded-full transition-transform duration-300 ${
                isAnnual ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-lg ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual 
            <span className="text-wood-accent ml-1">(Save 25%)</span>
          </span>
        </div>
      </div>

      {/* Sticky Pricing Tiers */}
      <div className="sticky top-16 z-30 bg-background/98 backdrop-blur-md border-b border-wood-accent/20 py-4 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Empty space for feature labels column */}
            <div className="hidden md:block">
              <div className="text-center text-wood-accent font-semibold text-sm">
                Features
              </div>
            </div>
            
            {/* Pricing Tier Headers */}
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative p-4 rounded-lg border-2 bg-card/95 backdrop-blur-sm text-center ${
                  tier.popular 
                    ? 'border-wood-accent shadow-glow' 
                    : 'border-gray-700'
                } transition-all duration-300 hover:scale-105`}
              >
                {tier.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-wood-accent text-background px-2 py-0.5 rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="text-xl mb-1">{tier.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                <div className="mb-2">
                  {typeof tier.price === 'number' ? (
                    <div>
                      <span className="text-2xl font-bold text-foreground">${tier.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">/mo</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {featureCategories.map((category, categoryIndex) => (
            <div
              key={category}
              className="grid grid-cols-4 gap-6 py-6 border-b border-border last:border-b-0"
            >
              {/* Feature Category Label */}
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-wood-accent">
                  {category}
                </h3>
              </div>
              
              {/* Feature Values for Each Tier - Aligned with sticky headers */}
              {pricingTiers.map((tier, tierIndex) => (
                <div
                  key={`${category}-${tier.name}`}
                  className="p-4 rounded-lg bg-card/50 border border-border hover:border-wood-accent/30 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-wood-accent mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      {renderFeatureValue(category, tier)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-6">
            {/* Empty space for feature labels column */}
            <div className="hidden md:block"></div>
            
            {/* CTA Buttons aligned with pricing tiers */}
            {pricingTiers.map((tier, index) => (
              <div key={`cta-${tier.name}`} className="text-center">
                <Button
                  variant={tier.buttonVariant}
                  size="lg"
                  className={`w-full py-3 text-base font-semibold ${
                    tier.buttonVariant === 'default' 
                      ? 'bg-wood-accent hover:bg-wood-accent/90 text-background' 
                      : 'border-wood-accent text-wood-accent hover:bg-wood-accent/10'
                  }`}
                >
                  {tier.buttonText}
                </Button>
                {tier.name === "Professional" && (
                  <p className="text-muted-foreground text-xs mt-2">14-day free trial</p>
                )}
                {tier.name === "Organizational" && (
                  <p className="text-muted-foreground text-xs mt-2">14-day free trial</p>
                )}
                {tier.name === "Enterprise" && (
                  <p className="text-muted-foreground text-xs mt-2">Custom implementation</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto p-12 rounded-lg bg-gradient-to-r from-wood-accent/10 to-card/50 border border-wood-accent/20">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses transforming their websites with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-wood-accent hover:bg-wood-accent/90 text-background font-semibold px-8 py-4"
            >
              Start Your Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-wood-accent text-wood-accent hover:bg-wood-accent/10 px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;